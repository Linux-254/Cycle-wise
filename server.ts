import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DeterministicGraphEngine } from './src/engine/graphEngine';
import { SEEDED_SMES } from './src/engine/fixtures';
import { guardrailCheckInput } from './src/agent/guardrails';
import { validateExtractionSchema, validateBusinessRules } from './src/agent/schemas';
import { ProviderRegistry } from './src/integrations/providerAdapters';
import { CyclewiseAgent } from './src/agent/geminiAgent';
import { SMEProfile } from './src/agent/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

const graphEngine = new DeterministicGraphEngine();
const agent = new CyclewiseAgent(graphEngine);

const smesMap = new Map<string, SMEProfile>();
SEEDED_SMES.forEach((s) => smesMap.set(s.id, s));

// -------------------------------------------------------------
// Versioned API Contracts (v1)
// -------------------------------------------------------------

// 1. Health & Integration Status
app.get('/api/v1/health', async (_req, res) => {
  const notifHealth = await ProviderRegistry.getNotification().healthCheck();
  const idHealth = await ProviderRegistry.getIdentity().healthCheck();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    model: agent.getModelProviders().find((provider) => provider.is_active)?.model_name || 'cyclewise-dfs-v1',
    providers: {
      notification: notifHealth,
      identity: idHealth,
      logistics: { status: 'healthy', provider: 'MockSwiftCouriers' },
    },
    demo_mode: true,
    note: 'Notification, identity, logistics, and payment integrations are demo adapters until replaced with production providers.',
  });
});

// 2. Network Overview
app.get('/api/v1/network', (_req, res) => {
  const allSmes = Array.from(smesMap.values());
  const totalValue = 18000 + 18500 + 17500 + 18000;
  res.json({
    smes: allSmes,
    active_exchanges_count: 1,
    completed_exchanges_count: 8,
    total_value_unlocked_kes: totalValue,
    node_count: allSmes.length,
  });
});

// 2b. SME Onboarding
app.post('/api/v1/sme/onboard', async (req, res) => {
  const { name, sector, location, description, offer_summary, need_summary, languages } = req.body;
  if (!name || !offer_summary || !need_summary) {
    res.status(400).json({ error: 'Missing required SME onboarding fields (name, offer_summary, need_summary)' });
    return;
  }

  const newId = `sme-${String(name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
  const newSme: SMEProfile = {
    id: newId,
    name: String(name).trim(),
    sector: sector || 'General Trade',
    description: description || 'Verified Nairobi SME node in multilateral exchange network',
    location: location || 'Nairobi County',
    languages: Array.isArray(languages) ? languages : ['en', 'sw'],
    identity_status: 'verified',
    offer_summary: String(offer_summary).trim(),
    need_summary: String(need_summary).trim(),
    trust_events: [
      {
        id: `te-${Date.now()}-1`,
        sme_id: newId,
        event_type: 'identity_confirmed',
        outcome: 'verified',
        evidence_text: `Onboarded into Nairobi SME Exchange Registry via physical node location at ${location || 'Nairobi'}.`,
        created_at: new Date().toISOString().split('T')[0],
      },
    ],
  };

  smesMap.set(newSme.id, newSme);
  const generatedEdges = graphEngine.addSME(newSme);
  const searchResult = await graphEngine.findCycles(4);

  res.json({
    success: true,
    sme: newSme,
    generated_edges: generatedEdges,
    cycles_found: searchResult.cycles.length,
    matching_cycles: searchResult.cycles.filter(c => c.sme_sequence.includes(newSme.id)),
  });
});

// 3. Deterministic Match Search
app.post('/api/v1/matches/search', async (req, res) => {
  const maxCycleLength = Number(req.body.max_cycle_length) || 4;
  const result = await graphEngine.findCycles(maxCycleLength);
  res.json(result);
});

// 4. Test Runner & Observability
app.post('/api/v1/engine/test', async (_req, res) => {
  const startTime = performance.now();
  const result = await graphEngine.findCycles(4);
  const elapsed_ms = Math.round(performance.now() - startTime);

  res.json({
    success: true,
    elapsed_ms,
    cycles_found: result.cycles.length,
    cycles: result.cycles,
    metadata: result.metadata,
  });
});

// 5. Toggle Edge (for broken-chain and failure testing)
app.post('/api/v1/engine/toggle-edge', (req, res) => {
  const { from_sme_id, to_sme_id, enabled } = req.body;
  if (!from_sme_id || !to_sme_id) {
    res.status(400).json({ error: 'Missing from_sme_id or to_sme_id' });
    return;
  }

  if (enabled) {
    graphEngine.enableEdge(from_sme_id, to_sme_id);
  } else {
    graphEngine.disableEdge(from_sme_id, to_sme_id);
  }

  res.json({
    success: true,
    edge: `${from_sme_id}->${to_sme_id}`,
    enabled: !!enabled,
  });
});

// 6. Reset Fixture
app.post('/api/v1/engine/reset', (_req, res) => {
  graphEngine.resetFixture();
  res.json({
    success: true,
    message: 'Seeded graph fixture reset to initial state',
  });
});

// 7. Request Validation & Guardrail Check
app.post('/api/v1/requests/validate', (req, res) => {
  const { raw_text, extraction } = req.body;

  if (raw_text) {
    const guardrail = guardrailCheckInput(raw_text);
    if (!guardrail.allowed) {
      res.status(400).json({
        valid: false,
        error: 'Guardrail rejected input',
        details: guardrail,
      });
      return;
    }
  }

  if (extraction) {
    const schemaCheck = validateExtractionSchema(extraction);
    if (!schemaCheck.valid) {
      res.status(400).json({
        valid: false,
        errors: schemaCheck.errors,
      });
      return;
    }
    const businessCheck = validateBusinessRules(schemaCheck.parsed!);
    res.json({
      valid: businessCheck.valid,
      errors: businessCheck.errors,
      warnings: businessCheck.warnings,
      required_clarifications: businessCheck.required_clarifications,
    });
    return;
  }

  res.json({ valid: true, message: 'Input passed initial checks' });
});

// 7b. AI Models & Multi-Provider Health Status
app.get('/api/v1/agent/models', (_req, res) => {
  res.json({
    providers: agent.getModelProviders(),
    default_cascade: agent.getModelProviders().filter((provider) => provider.is_configured).map((provider) => provider.model_name).concat(['cyclewise-dfs-v1']),
  });
});

// 7c. Honest capability contract for UI and reviewers
app.get('/api/v1/agent/capabilities', (_req, res) => {
  const providers = agent.getModelProviders();
  res.json({
    interpretation: {
      status: providers.some((provider) => provider.provider !== 'local' && provider.is_configured) ? 'ai_enabled' : 'deterministic_fallback',
      configured_providers: providers.filter((provider) => provider.is_configured).map((provider) => provider.id),
      note: 'AI providers structure language; outputs still pass schema and business validation.',
    },
    matching: { status: 'deterministic', engine: 'cyclewise-dfs-v1', max_cycle_length: 4 },
    explanations: { status: 'grounded', source: 'returned graph edges and participant evidence' },
    commitment: { status: 'human_required', automatic_activation: false },
    payments: { status: 'simulated_demo', provider: 'none', automatic_money_movement: false },
  });
});

// 8. Agent: Natural-Language Intent Extraction with Multi-Model Support (extract_need_offer)
app.post('/api/v1/requests/parse', async (req, res) => {
  const { message, language, model_preference } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "message" string' });
    return;
  }

  try {
    const result = await agent.extractNeedOffer(message, language, model_preference);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Extraction error';
    res.status(400).json({ error: message });
  }
});

// 9. Agent: Full Multi-Step Human-in-the-Loop Orchestration
app.post('/api/v1/agent/orchestrate', async (req, res) => {
  const { message, language, model_preference } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "message" string' });
    return;
  }

  try {
    const result = await agent.orchestrate(message, smesMap, language, model_preference);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Agent orchestration error';
    res.status(500).json({ error: message });
  }
});

// 10. Agent: Grounded Cycle Explanation
app.post('/api/v1/agent/explain', async (req, res) => {
  const { cycle, language, model_preference } = req.body;
  if (!cycle || !cycle.edges) {
    res.status(400).json({ error: 'Missing or invalid "cycle" object' });
    return;
  }

  try {
    const explanation = await agent.explainMatch(cycle, smesMap, language, model_preference);
    res.json({ explanation });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Explanation error';
    res.status(500).json({ error: message });
  }
});

// 11. Agent: Grounded Inquiry Q&A
app.post('/api/v1/agent/inquiry', async (req, res) => {
  const { question, cycle, language, model_preference } = req.body;
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Missing or invalid "question" string' });
    return;
  }

  try {
    const result = await agent.answerInquiry(question, cycle, smesMap, language, model_preference);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Inquiry error';
    res.status(500).json({ error: message });
  }
});

// 12. Agent: Autonomous Substitute Match Coordination
app.post('/api/v1/agent/substitute', async (req, res) => {
  const { declined_sme_id, cycle } = req.body;
  if (!declined_sme_id || !cycle) {
    res.status(400).json({ error: 'Missing declined_sme_id or cycle' });
    return;
  }

  try {
    const result = await agent.substituteMatch(declined_sme_id, cycle, smesMap);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Substitute match error';
    res.status(500).json({ error: message });
  }
});

// 13. Agent: Evaluation Trajectory Logs
app.get('/api/v1/agent/trajectories', (_req, res) => {
  res.json({
    trajectories: agent.getTrajectories(),
    count: agent.getTrajectories().length,
  });
});

// -------------------------------------------------------------
// Vite Middlewares for React Frontend
// -------------------------------------------------------------
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Cyclewise Server] Running on http://0.0.0.0:${port}`);
  });
}

setupVite().catch((err) => {
  console.error('[Cyclewise Server] Startup error:', err);
});

import { GoogleGenAI } from '@google/genai';

export interface ModelProviderInfo {
  id: string;
  name: string;
  provider: 'nvidia' | 'google' | 'local';
  model_name: string;
  is_configured: boolean;
  is_active: boolean;
  tier: 'primary' | 'secondary' | 'failsafe' | 'fallback';
  description?: string;
}

export interface ModelExecutionResponse {
  raw_text: string;
  json_data?: any;
  model_used: string;
  provider: string;
  fallback_used: boolean;
  cascade_trail: string[];
  latency_ms: number;
}

export class MultiModelRouter {
  private geminiClient: GoogleGenAI | null = null;
  private nvidiaApiKey: string | null = null;
  private nvidiaBaseUrl: string = 'https://openrouter.ai/api/v1';
  private nvidiaModel: string = 'nvidia/nemotron-3-super-120b';

  // Failsafe Gemini models in priority order
  private geminiFailsafeModels = [
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.1-pro-preview',
    'gemini-flash-latest',
  ];

  constructor() {
    // 1. NVIDIA Nemotron Configuration
    this.nvidiaApiKey =
      process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY !== 'MY_NVIDIA_API_KEY'
        ? process.env.NVIDIA_API_KEY
        : null;
    if (process.env.NVIDIA_BASE_URL) {
      this.nvidiaBaseUrl = process.env.NVIDIA_BASE_URL;
    }
    if (process.env.NVIDIA_MODEL) {
      this.nvidiaModel = process.env.NVIDIA_MODEL;
    }

    // 2. Google Gemini Configuration
    const geminiKey =
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
        ? process.env.GEMINI_API_KEY
        : null;
    if (geminiKey) {
      try {
        this.geminiClient = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build-cyclewise',
            },
          },
        });
      } catch (e) {
        console.warn('[MultiModelRouter] Gemini init error:', e);
      }
    }
  }

  public getAvailableProviders(): ModelProviderInfo[] {
    return [
      {
        id: 'nvidia-nemotron',
        name: 'NVIDIA Nemotron 3 Ultra',
        provider: 'nvidia',
        model_name: this.nvidiaModel,
        is_configured: !!this.nvidiaApiKey,
        is_active: !!this.nvidiaApiKey,
        tier: 'primary',
        description: 'High-throughput reasoning model via NVIDIA NIM',
      },
      {
        id: 'nvidia-nemotron-70b',
        name: 'NVIDIA Llama-3.1 Nemotron 70B',
        provider: 'nvidia',
        model_name: 'nvidia/llama-3.1-nemotron-70b-instruct',
        is_configured: !!this.nvidiaApiKey,
        is_active: false,
        tier: 'secondary',
        description: 'Optimized 70B parameter Nemotron instruction model',
      },
      {
        id: 'google-gemini-flash',
        name: 'Google Gemini 3.8 Flash',
        provider: 'google',
        model_name: 'gemini-3.8-flash',
        is_configured: !!this.geminiClient,
        is_active: !this.nvidiaApiKey && !!this.geminiClient,
        tier: 'primary',
        description: 'Fast, multimodal structured intent parsing and multilingual Swahili grounding',
      },
      {
        id: 'google-gemini-lite',
        name: 'Google Gemini 3.1 Flash Lite [Failsafe]',
        provider: 'google',
        model_name: 'gemini-3.1-flash-lite',
        is_configured: !!this.geminiClient,
        is_active: false,
        tier: 'failsafe',
        description: 'Ultra-low latency automatic failsafe fallback',
      },
      {
        id: 'google-gemini-pro',
        name: 'Google Gemini 3.1 Pro [Failsafe]',
        provider: 'google',
        model_name: 'gemini-3.1-pro-preview',
        is_configured: !!this.geminiClient,
        is_active: false,
        tier: 'failsafe',
        description: 'Deep complex multi-hop trade reasoning failsafe',
      },
      {
        id: 'local-deterministic',
        name: 'Deterministic Grounded Engine',
        provider: 'local',
        model_name: 'cyclewise-dfs-v1',
        is_configured: true,
        is_active: !this.nvidiaApiKey && !this.geminiClient,
        tier: 'fallback',
        description: 'Pure deterministic constraint and DFS cycle validator',
      },
    ];
  }

  /**
   * Universal Structured Extraction Router:
   * Tries NVIDIA Nemotron -> Gemini 3.8 Flash -> Gemini 3.1 Flash Lite -> Gemini 3.1 Pro -> Deterministic Rule Engine
   */
  public async generateStructuredContent(
    systemPrompt: string,
    userPrompt: string,
    preferredProvider?: string
  ): Promise<ModelExecutionResponse> {
    const startTime = performance.now();
    const cascadeTrail: string[] = [];

    // Order of execution
    const providersToTry: string[] = [];
    if (preferredProvider && preferredProvider !== 'auto') {
      providersToTry.push(preferredProvider);
    }

    // Default cascade: NVIDIA Nemotron -> Google Gemini Flash -> Google Gemini Failsafes
    ['nvidia-nemotron', 'google-gemini-flash'].forEach((p) => {
      if (!providersToTry.includes(p)) {
        providersToTry.push(p);
      }
    });

    for (const provider of providersToTry) {
      // 1. NVIDIA Nemotron execution
      if ((provider === 'nvidia-nemotron' || provider === 'nvidia-nemotron-70b') && this.nvidiaApiKey) {
        const targetModel = provider === 'nvidia-nemotron-70b' 
          ? 'nvidia/llama-3.1-nemotron-70b-instruct' 
          : this.nvidiaModel;
        try {
          const res = await this.callNvidiaChat(systemPrompt, userPrompt, targetModel);
          cascadeTrail.push(`${targetModel} (NVIDIA NIM) -> Success`);
          return {
            raw_text: res,
            json_data: this.tryParseJson(res),
            model_used: targetModel,
            provider: 'nvidia',
            fallback_used: cascadeTrail.length > 1,
            cascade_trail: cascadeTrail,
            latency_ms: Math.round(performance.now() - startTime),
          };
        } catch (err: any) {
          const errReason = err?.message?.includes('429') ? 'Rate limit (429 Exceeded)' : (err.message || 'Error');
          cascadeTrail.push(`${targetModel} (NVIDIA NIM) -> ${errReason}`);
          console.log(`[MultiModelRouter] NVIDIA ${targetModel} notice (${errReason}), failing over to Gemini failsafe cascade`);
        }
      }

      // 2. Google Gemini with Multi-Model Failsafe Cascade
      if (
        (provider === 'google-gemini' ||
          provider === 'google-gemini-flash' ||
          provider === 'google-gemini-lite' ||
          provider === 'google-gemini-pro') &&
        this.geminiClient
      ) {
        // Build failsafe model order based on selected preference
        const specificModel =
          provider === 'google-gemini-lite'
            ? 'gemini-3.1-flash-lite'
            : provider === 'google-gemini-pro'
            ? 'gemini-3.1-pro-preview'
            : 'gemini-3.8-flash';

        const geminiModelsInOrder = [
          specificModel,
          ...this.geminiFailsafeModels.filter((m) => m !== specificModel),
        ];

        for (const geminiModel of geminiModelsInOrder) {
          try {
            const res = await this.callGeminiSingleModel(systemPrompt, userPrompt, geminiModel);
            cascadeTrail.push(`${geminiModel} (Google GenAI) -> Success`);
            return {
              raw_text: res,
              json_data: this.tryParseJson(res),
              model_used: geminiModel,
              provider: 'google',
              fallback_used: cascadeTrail.length > 1 || geminiModel !== specificModel,
              cascade_trail: cascadeTrail,
              latency_ms: Math.round(performance.now() - startTime),
            };
          } catch (err: any) {
            const isQuota = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.status === 429;
            const errSummary = isQuota ? 'Rate limit / Quota exceeded (429)' : (err.message || 'Error');
            cascadeTrail.push(`${geminiModel} (Google GenAI) -> ${errSummary}`);
            console.log(`[MultiModelRouter] Gemini ${geminiModel} notice (${errSummary}), trying next failsafe model...`);
          }
        }
      }
    }

    // 3. If NVIDIA was tried first and failed (or wasn't configured), ensure Gemini is tried with all failsafes
    if (this.geminiClient && !providersToTry.some((p) => p.startsWith('google-gemini'))) {
      for (const geminiModel of this.geminiFailsafeModels) {
        try {
          const res = await this.callGeminiSingleModel(systemPrompt, userPrompt, geminiModel);
          cascadeTrail.push(`${geminiModel} (Google GenAI Failsafe) -> Success`);
          return {
            raw_text: res,
            json_data: this.tryParseJson(res),
            model_used: geminiModel,
            provider: 'google',
            fallback_used: true,
            cascade_trail: cascadeTrail,
            latency_ms: Math.round(performance.now() - startTime),
          };
        } catch (err: any) {
          const isQuota = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED') || err?.status === 429;
          const errSummary = isQuota ? 'Rate limit (429)' : (err.message || 'Error');
          cascadeTrail.push(`${geminiModel} (Google GenAI Failsafe) -> ${errSummary}`);
        }
      }
    }

    // 4. Deterministic Rule & Constraint Graph Engine Fallback
    cascadeTrail.push('cyclewise-dfs-v1 -> Local Deterministic Grounded Engine Active');
    return {
      raw_text: '{}',
      json_data: null,
      model_used: 'cyclewise-dfs-v1',
      provider: 'local',
      fallback_used: true,
      cascade_trail: cascadeTrail,
      latency_ms: Math.round(performance.now() - startTime),
    };
  }

  // --- Provider Implementations ---

  private async callNvidiaChat(
    systemPrompt: string,
    userPrompt: string,
    modelName: string = this.nvidiaModel
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const url = `${this.nvidiaBaseUrl.replace(/\/$/, '')}/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.nvidiaApiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`NVIDIA NIM HTTP ${response.status}: ${errText.slice(0, 150)}`);
      }

      const json = await response.json();
      return json?.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeout);
    }
  }

  private async callGeminiSingleModel(
    systemPrompt: string,
    userPrompt: string,
    modelName: string
  ): Promise<string> {
    if (!this.geminiClient) throw new Error('Gemini client not initialized');

    const response = await this.geminiClient.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });
    return response.text || '';
  }

  private tryParseJson(text: string): any {
    if (!text) return null;
    try {
      // Clean potential markdown triple backticks
      const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return null;
    }
  }
}

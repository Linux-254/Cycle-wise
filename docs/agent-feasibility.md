# Cyclewise implementation and AI feasibility

## What is actually implemented

| Capability | Implementation | Boundary |
|---|---|---|
| Multilingual request interpretation | Configured Google/NVIDIA provider cascade with a local deterministic fallback | Provider success depends on deployment keys, model availability, quota, and network access |
| Request safety | Local prompt-injection and non-monetary guardrails before model calls | This is a product safeguard, not a claim of perfect adversarial robustness |
| Structured extraction | JSON parsing followed by schema and business-rule validation | Low-confidence or incomplete fields should remain clarification work, not be silently invented |
| Exchange matching | `cyclewise-dfs-v1` bounded DFS graph engine | The current graph uses seeded/in-memory SME data; it is not a live marketplace database |
| Match explanation | Model-assisted prose constrained by returned edges, with a deterministic fallback | Trust must be reviewed from evidence events; a match is not a trust score |
| Substitute matching | Deterministic re-search excluding a declined participant | It proposes alternate routes; it does not contact businesses or dispatch goods automatically |
| Commitment | Proposal state plus explicit human approval gate | No exchange activates automatically |
| Payments | Demo-only UI state | No M-Pesa API, escrow, wallet, or money movement is connected |

## Provider truth

`GET /api/v1/agent/capabilities` reports whether an external AI provider is configured in the current process. The UI must not present a named model as active unless it is configured and the request succeeds. The local fallback is always available for deterministic matching and basic demo extraction.

## Design system applied

The redesign uses explicit tokens (`--color-bg`, `--color-surface`, `--color-ink`, `--color-accent`, `--radius-card`, `--shadow-soft`, `--ease-standard`, and duration tokens), a quiet outer stage, a single hero object, restrained accent color, composited reveal/floating motion, visible focus states, and `prefers-reduced-motion` support. The hero communicates thesis → proposal state → next action without relying on dense decorative effects.

## Production work still required

1. Replace in-memory seeded SME state with authenticated persistence and authorization.
2. Add provider health checks and contract tests against the exact deployed model IDs.
3. Add durable proposal/consent records for every participant; do not use UI-only state for sign-off.
4. Integrate and independently verify any payment or tax provider before describing those flows as live.
5. Add an evidence-backed dispute event model instead of presenting zero unresolved disputes by default.

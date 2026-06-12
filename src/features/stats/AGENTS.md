# Purpose
Gamification, telemetry log compression, and interactive Bento Box dashboard visualizations (Radar, Heatmap, line charts) for reading statistics.

# Ownership
Achievements evaluation, stats export, local data compression, and custom SVG visual charts.

# Local Contracts
- The achievement evaluation criteria must match the Supabase PL/pgSQL evaluation triggers.
- Log compression must occur regularly to prevent IndexedDB ballooning.

# Work Guidance
- Avoid importing external charting libraries; write pure SVG components with built-in responsiveness.
- Use Framer Motion for premium micro-animations in gamification and hover tooltips.

# Verification
- Run Vitest suites for stats compression and achievement triggers: `npx vitest run`.

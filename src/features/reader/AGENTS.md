# Purpose
The core reading experience, including various rendering modes and playback controls.

# Ownership
RSVP reader, bionic reading, text pagination, and playback persistence.

# Local Contracts
- Reader state must be persisted across sessions.
- Support for multiple reading modes (RSVP, Bionic).
- Reading sessions must collect detailed telemetry in real-time via `useTelemetryTracker`.

# Work Guidance
- Optimize for high-performance text rendering.

# Verification
- Run vitest hook tests using `npm run test`.

# Child DOX Index
None.

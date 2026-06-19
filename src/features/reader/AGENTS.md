# Purpose
The core reading experience, including various rendering modes, playback controls, highlighting and annotation UI.

# Ownership
RSVP reader, bionic reading, text pagination, playback persistence, text selection and annotation interaction.

# Local Contracts
- Reader state must be persisted across sessions.
- Support for multiple reading modes (RSVP, Bionic).
- Reading sessions must collect detailed telemetry in real-time via `useTelemetryTracker`.
- Highlight/annotation flow: selection → swatch click → instant highlight (zero fricción). Note dialog is optional, never auto-opened.
- Right-click context menu on text is suppressed. Floating toolbar is the sole interaction point.
- Collision handling via `getUncoveredSegments()` in annotationOverlap.ts: palabras ya subrayadas nunca se repintan. Solo se crean annotations en los huecos libres.

# Work Guidance
- Optimize for high-performance text rendering.
- Annotation painting uses direct DOM style mutation on `span[data-word-index]` elements via `paintAnnotations()`.
- `QuickColorPicker` stores last used color in localStorage (`visus:lastAnnotationColor`). No usa `<input type="color">` nativo — el popup HEX es un input de texto estilizado.
- `SelectionToolbar` renders in two modes: new selection (color + note + dict + copy + search + TTS) and edit existing (color + edit note + delete).
- Click on annotated word triggers full-range selection via `selectRange()` in `handleAnnotationClick`.

# Verification
- Run vitest hook tests using `npm run test`.

# Child DOX Index
- `utils/annotationOverlap.ts` — Uncovered segment computation for collision-free highlighting
- `components/QuickColorPicker.tsx` — 8 inline swatches + HEX input popup (no native picker)
- `components/SelectionToolbar.tsx` — Contextual floating toolbar for text actions
- `hooks/useTextSelection.ts` — Text selection tracking with DOM word index resolution

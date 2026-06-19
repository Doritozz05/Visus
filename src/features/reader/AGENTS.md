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
- Use ref pattern (`handleXxxRef`) for event handlers passed to `readerContent` useMemo to prevent DOM recreation on unrelated state changes. Same pattern: `handleContextMenuRef`, `handleDoubleClickRef`, `handleMouseUpRef`.
- Annotation painting uses direct DOM style mutation on `span[data-word-index]` elements via `paintAnnotations()`.
- `CompactColorPicker` replaces `QuickColorPicker` in the toolbar: hue bar + sat/brightness 2D square + HEX input + native `<input type="color">` fallback + recent colors (`visus:recentAnnotationColors` in localStorage).
- `SelectionToolbar` renders in two modes: new selection (color + note + dict + copy + search + TTS) and edit existing (color + edit note + delete).
- Click on annotated word triggers full-range selection via `selectRange()` in `handleAnnotationClick`.

# Verification
- Run vitest hook tests using `npm run test`.

# Child DOX Index
- `utils/annotationOverlap.ts` — Uncovered segment computation for collision-free highlighting
- `components/CompactColorPicker.tsx` — Interactive color picker (hue bar + sat/brightness square + HEX + native picker + recent colors)
- `components/QuickColorPicker.tsx` — 8 inline swatches + HEX input popup (legacy, replaced by CompactColorPicker)
- `components/SelectionToolbar.tsx` — Contextual floating toolbar for text actions
- `hooks/useTextSelection.ts` — Text selection tracking with DOM word index resolution

# Purpose
Shared, reusable user interface components and styling elements.

# Ownership
Global components, standard UI inputs, dropdowns, error boundaries, spinners, and generic layout templates (like the sidebar).

# Local Contracts
- All general-purpose presentation components must reside under `src/components`.
- Always follow the casing rule: use sentence casing for user interface labels, headings, buttons, and text.
- Rely on theme-defined CSS custom variables rather than inline/hardcoded Tailwind styles for standard theme compliance.

# Work Guidance
- Keep components modular, highly accessible, and responsive.
- Do not import feature-specific state or contexts; components here must receive configurations via props.

# Verification
- Ensure local components compile without type errors via `npm run typecheck`.

# Child DOX Index
None.

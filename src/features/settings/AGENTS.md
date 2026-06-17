# Purpose
General settings management, including application preference persistence and custom user visual theme designing.

# Ownership
Settings components, general visual settings forms, RSVP adjustments, and the theme editor page.

# Local Contracts
- Keep visual customization features decoupled.
- Custom themes must conform to the `CustomTheme` entity definition.
- Theme editor subcomponents must be modular and reside under `components/ThemeEditor/`.
- Sidebar customization (e.g., Liquid Glass) for custom themes is managed within the theme editor.

# Work Guidance
- Use standard React Hooks and coordinate settings state via `useSettings` settings-context.
- Avoid inline layout/color styling; utilize CSS custom properties and HSL translation utilities.

# Verification
- Run vitest tests under `__tests__/`.
- Run typescript typecheck `npm run typecheck`.

# Child DOX Index
None.

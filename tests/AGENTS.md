# Purpose
End-to-end integration testing and layout validation suite.

# Ownership
Playwright tests, environment configuration, mock data fixtures, and casing assertion suites.

# Local Contracts
- All testing configuration and Playwright spec files must reside under `tests`.
- Include checks for user interface sentence casing conformance in `sentence-casing.spec.ts`.
- Tests must be runnable locally with standard npm/npx scripts.

# Work Guidance
- Use modern async-await Playwright assertions.
- Minimize hardcoded timeouts; utilize element visibility wait states.
- Clean up test artifacts and avoid persistent local storage mutations inside test runs.

# Verification
- Run the full test suite using: `npx playwright test`.

# Child DOX Index
None.

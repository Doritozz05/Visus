# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Execution Principles

**1. Think Before Coding**

- Don't assume. Don't hide confusion. Surface tradeoffs.
- Before implementing:
  - State your assumptions explicitly. If uncertain, ask.
  - If multiple interpretations exist, present them - don't pick silently.
  - If a simpler approach exists, say so. Push back when warranted.
  - If something is unclear, stop. Name what's confusing. Ask.

**2. Simplicity First**

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

**3. Surgical Changes**

- Touch only what you must. Clean up only your own mess.
- When editing existing code:
  - Don't "improve" adjacent code, comments, or formatting.
  - Don't refactor things that aren't broken.
  - Match existing style, even if you'd do it differently.
  - If you notice unrelated dead code, mention it - don't delete it.
- When your changes create orphans:
  - Remove imports/variables/functions that YOUR changes made unused.
  - Don't remove pre-existing dead code unless asked.
- The test: Every changed line should trace directly to the user's request.

**4. Goal-Driven Execution**

- Define success criteria. Loop until verified.
- Transform tasks into verifiable goals:
  - "Add validation" → "Write tests for invalid inputs, then make them pass"
  - "Fix the bug" → "Write a test that reproduces it, then make it pass"
  - "Refactor X" → "Ensure tests pass before and after"
- For multi-step tasks, state a brief plan:
  1. [Step] → verify: [check]
  2. [Step] → verify: [check]
  3. [Step] → verify: [check]
- Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
- These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Use CodeGraph to locate each target path and its dependencies instead of manual directory walking
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:

- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

- **Casing rule**: Always use sentence casing (e.g., "First word capitalized, then lowercase") for user interface labels, headings, and text instead of Title Case (except for words separated by `&` e.g., "Save & Apply" or acronyms e.g., "UI", "CSS", "JSON", "URL").
- After major or changes that could affect the prohect run "npm run validate"

## Verification

Run these aftter changing something:

| Command                                     | What it checks             |
| ------------------------------------------- | -------------------------- |
| `npm run validate`                        | TypeScript, lint and tests |
| `npm run build` (only if commit is asked) | Builds successfully        |

## Child DOX Index

- [src/app/AGENTS.md](src/app/AGENTS.md)
- [src/components/AGENTS.md](src/components/AGENTS.md)
- [src/core/AGENTS.md](src/core/AGENTS.md)
- [src/features/AGENTS.md](src/features/AGENTS.md)
- [src/lib/AGENTS.md](src/lib/AGENTS.md)
- [supabase/AGENTS.md](supabase/AGENTS.md)
- [tests/AGENTS.md](tests/AGENTS.md)

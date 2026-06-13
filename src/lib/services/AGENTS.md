# Purpose
Integration services connecting application state with external data providers, authentication, and local/cloud storage sync.

# Ownership
Book ingestion logic, Supabase database synchronization services, file storage adapters, and user authentication handlers.

# Local Contracts
- All core asynchronous logic for external integrations must be encapsulated in services here.
- Services must remain UI-agnostic and export clean interfaces or React hook wrappers if needed.
- Implement comprehensive error boundaries and offline tolerance strategies for synchronizations.

# Work Guidance
- Do not store state directly in services; coordinate through providers, context, or reactive stores.
- Design database updates to use transactions or batched insertions where appropriate.

# Verification
- Run service unit and mock tests with: `npx vitest run src/lib/services`.

# Child DOX Index
None.

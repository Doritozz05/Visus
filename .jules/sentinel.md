## 2024-05-18 - Insecure Randomness in ID Generation
**Vulnerability:** ID generation utilized `Math.random` combined with `Date.now()`. This is a predictable, weak pseudo-random number generator that could lead to collisions or ID guessing.
**Learning:** These IDs were used across multiple places including library books, stats logs, and reading bookmarks. While local IDs are generally low risk, keeping a secure foundation is key to defense in depth.
**Prevention:** Use `crypto.randomUUID()` when generating unique identifiers client-side. Update tests to assert correct UUID formats instead of regex matches for custom implementations.

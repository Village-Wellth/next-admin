---
"@village-wellth/next-admin": patch
"@village-wellth/next-admin-json-schema": patch
"@village-wellth/next-admin-generator-prisma": patch
---

Fix performance issue where all sub-relations were eagerly loaded when a relation field is in the display array, causing slow queries and Vercel OOM crashes. Reduce search type recursion depth from 4 to 2 to prevent TypeScript ts2590 error with large schemas.

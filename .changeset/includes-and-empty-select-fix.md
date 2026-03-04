---
"@village-wellth/next-admin": minor
---

Add `includes` option for relation fields and fix empty select error

- **Feature:** Added `includes` option to `list.fields` and `edit.fields` for relation fields. This allows specifying which sub-relations to load when a relation is in the `display` array, enabling formatters that depend on nested relation data (e.g., `dealOpportunity.buyer.name`). Supports deep includes via object syntax.
- **Fix:** Resolved "select statement must not be empty" Prisma error for join table models (e.g., `AdvisoryTeam`) that have no scalar fields in the generated schema.

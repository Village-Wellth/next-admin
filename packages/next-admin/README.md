# @village-wellth/next-admin

[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Village Wellth's fork of [`@premieroctet/next-admin`](https://github.com/premieroctet/next-admin) — a customizable admin dashboard for Next.js applications powered by Prisma ORM.

## Why This Fork?

The upstream package has critical performance and TypeScript issues that remain unresolved. This fork fixes them and adds features we need. See [Changes from Upstream](#changes-from-upstream) for details.

## Installation

Ensure your project's `.npmrc` has the GitHub Packages registry for the `@village-wellth` scope:

```
@village-wellth:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install:

```bash
npm install @village-wellth/next-admin @village-wellth/next-admin-generator-prisma
```

## Packages

| Package | Description |
|---------|-------------|
| `@village-wellth/next-admin` | Core admin dashboard library |
| `@village-wellth/next-admin-generator-prisma` | Prisma generator for schema introspection |
| `@village-wellth/next-admin-json-schema` | JSON Schema helpers (internal dependency) |
| `@village-wellth/next-admin-cli` | CLI for scaffolding admin pages |

## Setup Guide

### 1. Install dependencies

```bash
npm install @village-wellth/next-admin @village-wellth/next-admin-generator-prisma
```

### 2. Add the Prisma generator to your `schema.prisma`

```prisma
generator nextAdmin {
  provider = "next-admin-generator-prisma"
}
```

### 3. Generate the schema

```bash
npx prisma generate
```

### 4. Add Tailwind preset

In your `tailwind.config.js`:

```js
const nextAdminPreset = require("@village-wellth/next-admin/preset");

module.exports = {
  content: [
    // ... your content paths
    "./node_modules/@village-wellth/next-admin/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [nextAdminPreset],
};
```

### 5. Create the admin page (App Router)

```tsx
// app/admin/[[...nextadmin]]/page.tsx
import { NextAdmin } from "@village-wellth/next-admin/adapters/next";
import { getNextAdminProps } from "@village-wellth/next-admin/appRouter";
```

### 6. Create the API route

```ts
// app/api/admin/[[...nextadmin]]/route.ts
import { createHandler } from "@village-wellth/next-admin/appHandler";
```

For full setup details, refer to the [upstream documentation](https://next-admin.js.org).

---

## Changes from Upstream

### Fix: Eager Loading of Sub-Relations (Performance)

**Problem:** When a relation field (e.g., `location`) is in the `display` array, the upstream version loads **all nested relations** of that model (e.g., `deal[]`, `buyerProfile[]`, `sellerListing[]`), even when only scalar fields are needed. This causes slow list queries and **Vercel Runtime OOM crashes**.

**Fix:** Only scalar fields of related models are selected in Prisma queries. If you need specific sub-relation data for a formatter, use the [`includes` option](#feature-includes-option-for-relation-fields).

### Fix: Search Type Union Too Complex (ts2590)

**Problem:** The `search` field type recursed 4 levels deep into Prisma relations, generating 100K+ union type members with large schemas. This caused `ts(2590): Expression produces a union type that is too complex to represent`.

**Fix:** Reduced search type recursion depth to 2 levels (supports `"user.name"`, `"user.email"` patterns).

### Feature: `includes` Option for Relation Fields

After the performance fix above, relation fields in `display` only load their scalar fields. If your `formatter` needs data from nested sub-relations (e.g., `dealOpportunity.buyer.name`), use `includes` to declare exactly which sub-relations to load.

**Basic usage** — load scalar fields of specified sub-relations:

```typescript
Chat: {
  list: {
    display: ["dealOpportunity", "buyer", "createdAt"],
    fields: {
      dealOpportunity: {
        formatter: (value) => `${value.buyer.name} - ${value.listing.title}`,
        includes: ["buyer", "listing"],
      },
    },
  },
}
```

**Deep includes** — load sub-relations of sub-relations:

```typescript
DealOpportunity: {
  list: {
    display: ["buyer", "listing", "status", "createdAt"],
    fields: {
      listing: {
        formatter: (value) => `${value.user.name} - ${value.title}`,
        includes: [{ field: "listing", includes: ["user"] }],
      },
    },
  },
}
```

The `includes` option is available in both `list.fields` and `edit.fields`. If no `includes` is specified, only scalar fields are loaded (backward compatible).

### Key Files Modified

| File | What changed |
|------|-------------|
| `packages/next-admin/src/utils/prisma.ts` | Performance fix + `includes` implementation |
| `packages/next-admin/src/types.ts` | Search type depth fix + `FieldInclude` type + `includes` on field options |

---

## Development (Contributing to this fork)

### Prerequisites

- Node.js 20+
- pnpm 9.12.3+

### Setup

```bash
# Clone the repo
git clone https://github.com/Village-Wellth/next-admin.git
cd next-admin

# Install dependencies
pnpm install

# Build all packages
pnpm build:packages
```

### Project Structure

```
packages/
  next-admin/           # Core library (@village-wellth/next-admin)
  generator-prisma/     # Prisma generator (@village-wellth/next-admin-generator-prisma)
  json-schema/          # JSON Schema helpers (@village-wellth/next-admin-json-schema)
  cli/                  # CLI tool (@village-wellth/next-admin-cli)
  database/             # Example database (internal)
  examples-common/      # Shared example config (internal)
apps/
  example/              # Example Next.js app
  docs/                 # Documentation site
```

### Testing locally in your project

1. Build and pack:
   ```bash
   pnpm build:packages
   cd packages/next-admin && pnpm pack
   cd ../generator-prisma && pnpm pack
   cd ../json-schema && pnpm pack
   ```

2. In your project, install the `.tgz` files:
   ```json
   "@village-wellth/next-admin": "file:./village-wellth-next-admin-x.x.x.tgz",
   "@village-wellth/next-admin-generator-prisma": "file:./village-wellth-next-admin-generator-prisma-x.x.x.tgz",
   "@village-wellth/next-admin-json-schema": "file:./village-wellth-next-admin-json-schema-x.x.x.tgz"
   ```

3. Run `npm install`

### Publishing a new version

This repo uses [changesets](https://github.com/changesets/changesets) for versioning and publishing to [GitHub Packages](https://github.com/orgs/Village-Wellth/packages).

1. Make your changes
2. Create a changeset:
   ```bash
   pnpm changeset
   ```
   Select the affected packages and bump type (patch/minor/major).

3. Commit and push to `main`
4. The GitHub Action will create a "Version Packages" PR
5. Merge that PR to publish to GitHub Packages

**Requirements:**
- The `GITHUB_TOKEN` secret (automatically provided by GitHub Actions) handles authentication
- No additional secrets are needed for publishing to GitHub Packages

### CI / E2E Tests

The e2e workflow runs on PRs and pushes to `main`. There is one **known flaky test** inherited from the upstream repo:

```
e2e/001-crud.spec.ts:16:5 › crud Post › create Post
```

This test times out intermittently (>30s) waiting for navigation after saving a Post. It is **not related to our changes** — it's a CI environment timing issue. If you see this single test fail while 18+ others pass, it's safe to ignore. All other tests should pass.

### Syncing with upstream

To pull in updates from the original `premieroctet/next-admin`:

```bash
git remote add upstream https://github.com/premieroctet/next-admin.git
git fetch upstream
git merge upstream/main
```

Resolve any conflicts, especially in files where we've made fixes (`packages/next-admin/src/utils/prisma.ts`, `packages/next-admin/src/types.ts`).

## Upstream Documentation

For general usage, API reference, and configuration options, see the [original next-admin docs](https://next-admin.js.org).

## License

MIT - Originally created by [Premier Octet](https://www.premieroctet.com).

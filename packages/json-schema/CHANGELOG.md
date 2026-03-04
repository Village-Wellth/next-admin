# @village-wellth/next-admin-json-schema

## 0.0.2

### Patch Changes

- [687500a](https://github.com/Village-Wellth/next-admin/commit/687500a1a6981757cac861c6b7c8b8638a6851b3): Fix performance issue where all sub-relations were eagerly loaded when a relation field is in the display array, causing slow queries and Vercel OOM crashes. Reduce search type recursion depth from 4 to 2 to prevent TypeScript ts2590 error with large schemas.

## 0.0.1

### Patch Changes

- [64737aa](https://github.com/Village-Wellth/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): feat: new json-schema libraries ([#414](https://github.com/Village-Wellth/next-admin/issues/414))
- [64737aa](https://github.com/Village-Wellth/next-admin/commit/64737aaf636ee958efd028165ab4dd9ec050e29f): Fix generator

## 0.0.1-rc.3

### Patch Changes

- Fix generator

## 0.0.1-rc.0

### Patch Changes

- [1fa56bc](https://github.com/Village-Wellth/next-admin/commit/1fa56bc): feat: new json-schema libraries ([#414](https://github.com/Village-Wellth/next-admin/issues/414))

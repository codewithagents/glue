# Changelog

## [2.0.0](https://github.com/codewithagents/glue/compare/openapi-react-query-v1.0.3...openapi-react-query-v2.0.0) (2026-05-25)


### ⚠ BREAKING CHANGES

* major version bump from 0.x — update your version range from ^0.x to ^1.0.0.

### Features

* add @codewithagents/openapi-react-query — generate typed React Query v5 hooks from OpenAPI specs ([#37](https://github.com/codewithagents/glue/issues/37)) ([fe558a7](https://github.com/codewithagents/glue/commit/fe558a741c78931d7a36dd9d91eacedcce30bbef))
* **cli:** add --config flag to openapi-gen and openapi-react-query with path security validation ([#38](https://github.com/codewithagents/glue/issues/38)) ([56c4352](https://github.com/codewithagents/glue/commit/56c435213dd59fd856e11102a22c12eb0d7aa0e4))
* **openapi-gen:** deprecated JSDoc, numeric enums, date-time format, typed error unions, discriminated unions ([b23bd69](https://github.com/codewithagents/glue/commit/b23bd69000ea9ca24a9188863ecb5a6ad5b18fc8))
* promote api-errors and openapi-react-query to stable 1.0.0 ([#47](https://github.com/codewithagents/glue/issues/47)) ([075be06](https://github.com/codewithagents/glue/commit/075be063b4588080f94dc7f228ca8f30ea8aa5e8))


### Bug Fixes

* **openapi-react-query:** camelCase key factory names from kebab/snake path segments ([#46](https://github.com/codewithagents/glue/issues/46)) ([9b3c072](https://github.com/codewithagents/glue/commit/9b3c072efc37e765cc12547e87b6043bb75c0e89))
* **openapi-react-query:** params optionality, key factory args, mutation shapes ([#52](https://github.com/codewithagents/glue/issues/52) [#53](https://github.com/codewithagents/glue/issues/53) [#54](https://github.com/codewithagents/glue/issues/54)) ([c3e0be0](https://github.com/codewithagents/glue/commit/c3e0be0d28e72055221a589f0fbc92e41438f297))
* **openapi-react-query:** resolve workspace:* on publish via pnpm pack, bump to 1.0.1 ([0c02b85](https://github.com/codewithagents/glue/commit/0c02b8592de9abb68ef01e5f470702b6bbe69c0e))

## [1.0.0](https://github.com/codewithagents/glue/compare/openapi-react-query-v0.2.0...openapi-react-query-v1.0.0) (2026-05-24)


### ⚠ BREAKING CHANGES

* major version bump from 0.x — update your version range from ^0.x to ^1.0.0.

### Features

* promote api-errors and openapi-react-query to stable 1.0.0 ([#47](https://github.com/codewithagents/glue/issues/47)) ([075be06](https://github.com/codewithagents/glue/commit/075be063b4588080f94dc7f228ca8f30ea8aa5e8))

## [0.2.0](https://github.com/codewithagents/glue/compare/openapi-react-query-v0.1.0...openapi-react-query-v0.2.0) (2026-05-24)


### Features

* add @codewithagents/openapi-react-query — generate typed React Query v5 hooks from OpenAPI specs ([#37](https://github.com/codewithagents/glue/issues/37)) ([fe558a7](https://github.com/codewithagents/glue/commit/fe558a741c78931d7a36dd9d91eacedcce30bbef))
* **cli:** add --config flag to openapi-gen and openapi-react-query with path security validation ([#38](https://github.com/codewithagents/glue/issues/38)) ([56c4352](https://github.com/codewithagents/glue/commit/56c435213dd59fd856e11102a22c12eb0d7aa0e4))


### Bug Fixes

* **openapi-react-query:** camelCase key factory names from kebab/snake path segments ([#46](https://github.com/codewithagents/glue/issues/46)) ([9b3c072](https://github.com/codewithagents/glue/commit/9b3c072efc37e765cc12547e87b6043bb75c0e89))

## 0.1.0 (2026-05-24)


### Features

* **openapi-react-query:** initial release — typed React Query v5 hooks from OpenAPI 3.1 specs ([#37](https://github.com/codewithagents/glue/issues/37)) ([56c4352](https://github.com/codewithagents/glue/commit/56c4352))
* **openapi-react-query:** add --config flag with path security validation ([#38](https://github.com/codewithagents/glue/issues/38))

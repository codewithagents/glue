# Changelog

## [1.0.0](https://github.com/codewithagents/glue/compare/openapi-gen-v0.3.0...openapi-gen-v1.0.0) (2026-05-23)


### ⚠ BREAKING CHANGES

* **openapi-gen:** The generated client.ts now emits a multi-line error block (create err, call onError?.(err), throw) instead of a single throw statement. Any code that pattern-matched on the generated output shape will need updating. Config format, generated file names, and TypeScript types are stable from this version forward.

### Features

* **openapi-gen:** stable 1.0 API — onError hook ([#17](https://github.com/codewithagents/glue/issues/17)) ([6e5ccb9](https://github.com/codewithagents/glue/commit/6e5ccb9a4cd87a9dbc3516eb36581cdd1f49abb0))

## [0.3.0](https://github.com/codewithagents/glue/compare/openapi-gen-v0.2.1...openapi-gen-v0.3.0) (2026-05-23)


### Features

* **openapi-gen:** enum query params, barrel index.ts, YAML spec support ([#15](https://github.com/codewithagents/glue/issues/15)) ([6427556](https://github.com/codewithagents/glue/commit/64275567e08fd0c801f2a6fb4700edc269f6f54a))

## [0.2.1](https://github.com/codewithagents/glue/compare/openapi-gen-v0.2.0...openapi-gen-v0.2.1) (2026-05-23)


### Bug Fixes

* **openapi-gen:** required params, inline type guards, real-world fixture coverage ([#12](https://github.com/codewithagents/glue/issues/12)) ([1cb4d6f](https://github.com/codewithagents/glue/commit/1cb4d6f0321a3a77e63a9b13d649962f6f566c68))

## [0.2.0](https://github.com/codewithagents/glue/compare/openapi-gen-v0.1.0...openapi-gen-v0.2.0) (2026-05-23)


### Features

* Zod v4 schema bootstrap from OpenAPI spec ([#9](https://github.com/codewithagents/glue/issues/9)) ([132b571](https://github.com/codewithagents/glue/commit/132b5716a90784f14c6bd13aa607ec98b1d1a71b))

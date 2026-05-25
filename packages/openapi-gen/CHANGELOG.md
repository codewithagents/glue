# Changelog

## [3.1.0](https://github.com/codewithagents/glue/compare/openapi-gen-v3.0.0...openapi-gen-v3.1.0) (2026-05-25)


### Features

* **integration:** consumer type simulation + CI path validation tests ([#77](https://github.com/codewithagents/glue/issues/77)) ([8a4a2b4](https://github.com/codewithagents/glue/commit/8a4a2b40987fcd25fdf5fe5d5f5a6f84fd9b95df))

## [3.0.0](https://github.com/codewithagents/glue/compare/openapi-gen-v2.0.1...openapi-gen-v3.0.0) (2026-05-25)


### ⚠ BREAKING CHANGES

* **openapi-gen:** The generated client.ts now emits a multi-line error block (create err, call onError?.(err), throw) instead of a single throw statement. Any code that pattern-matched on the generated output shape will need updating. Config format, generated file names, and TypeScript types are stable from this version forward.

### Features

* add integration package + ApiError body unwrapping + coverage cleanup ([#31](https://github.com/codewithagents/glue/issues/31)) ([f200c7b](https://github.com/codewithagents/glue/commit/f200c7b662f743c41699c177ce37ab1069404d52))
* **cli:** add --config flag to openapi-gen and openapi-react-query with path security validation ([#38](https://github.com/codewithagents/glue/issues/38)) ([56c4352](https://github.com/codewithagents/glue/commit/56c435213dd59fd856e11102a22c12eb0d7aa0e4))
* **openapi-gen:** add Zod validation constraints from OpenAPI schema ([#28](https://github.com/codewithagents/glue/issues/28)) ([058bf01](https://github.com/codewithagents/glue/commit/058bf01cf0a4cdaf9e5ba5ac19124cab55f29129))
* **openapi-gen:** deprecated JSDoc, numeric enums, date-time format, typed error unions, discriminated unions ([b23bd69](https://github.com/codewithagents/glue/commit/b23bd69000ea9ca24a9188863ecb5a6ad5b18fc8))
* **openapi-gen:** enum query params, barrel index.ts, YAML spec support ([#15](https://github.com/codewithagents/glue/issues/15)) ([6427556](https://github.com/codewithagents/glue/commit/64275567e08fd0c801f2a6fb4700edc269f6f54a))
* **openapi-gen:** header params, cookie auth, multipart bodies, array query serialization ([#33](https://github.com/codewithagents/glue/issues/33)) ([dbfc3da](https://github.com/codewithagents/glue/commit/dbfc3da28593521e6c9832507fc684b7d2ca82cd))
* **openapi-gen:** stable 1.0 API — onError hook ([#17](https://github.com/codewithagents/glue/issues/17)) ([6e5ccb9](https://github.com/codewithagents/glue/commit/6e5ccb9a4cd87a9dbc3516eb36581cdd1f49abb0))
* React Query enhancements — nullish params, suspense, auto-invalidate, per-resource cache, server client ([#67](https://github.com/codewithagents/glue/issues/67)) ([6a407ea](https://github.com/codewithagents/glue/commit/6a407eab12c66d0d4baba571e11538bcfa898e1a))
* Zod v4 schema bootstrap from OpenAPI spec ([#9](https://github.com/codewithagents/glue/issues/9)) ([132b571](https://github.com/codewithagents/glue/commit/132b5716a90784f14c6bd13aa607ec98b1d1a71b))


### Bug Fixes

* CI path false positive, onSuccess spread, explicit server client signatures ([#72](https://github.com/codewithagents/glue/issues/72)) ([ec25bb0](https://github.com/codewithagents/glue/commit/ec25bb0c0f5df8a20c2b31a1aa499408a0ed3fcc))
* CI path false positive, onSuccess spread, explicit server client signatures ([#73](https://github.com/codewithagents/glue/issues/73)) ([f21d93d](https://github.com/codewithagents/glue/commit/f21d93d63e57ed97380820788a3ed9ad75e4adc9))
* **openapi-gen:** add repository URL and executable bit for npm provenance ([#25](https://github.com/codewithagents/glue/issues/25)) ([53ce21d](https://github.com/codewithagents/glue/commit/53ce21d7d7c964ab49ec588378c12b5225f1b6a8))
* **openapi-gen:** emit values array alongside numeric enum type ([3ca3dac](https://github.com/codewithagents/glue/commit/3ca3dac7f0fe3ffa1be43ac9ced0dd54fc8b66ee))
* **openapi-gen:** required params, inline type guards, real-world fixture coverage ([#12](https://github.com/codewithagents/glue/issues/12)) ([1cb4d6f](https://github.com/codewithagents/glue/commit/1cb4d6f0321a3a77e63a9b13d649962f6f566c68))
* **openapi-gen:** resolve $ref parameters from components, add minItems/maxItems to Zod arrays ([#35](https://github.com/codewithagents/glue/issues/35)) ([2076c24](https://github.com/codewithagents/glue/commit/2076c2499a10a35bcbea997b30afec6134528378))

## [2.0.1](https://github.com/codewithagents/glue/compare/openapi-gen-v2.0.0...openapi-gen-v2.0.1) (2026-05-25)


### Bug Fixes

* CI path false positive, onSuccess spread, explicit server client signatures ([#72](https://github.com/codewithagents/glue/issues/72)) ([ec25bb0](https://github.com/codewithagents/glue/commit/ec25bb0c0f5df8a20c2b31a1aa499408a0ed3fcc))

## [2.0.0](https://github.com/codewithagents/glue/compare/openapi-gen-v1.5.1...openapi-gen-v2.0.0) (2026-05-25)


### ⚠ BREAKING CHANGES

* **openapi-gen:** The generated client.ts now emits a multi-line error block (create err, call onError?.(err), throw) instead of a single throw statement. Any code that pattern-matched on the generated output shape will need updating. Config format, generated file names, and TypeScript types are stable from this version forward.

### Features

* add integration package + ApiError body unwrapping + coverage cleanup ([#31](https://github.com/codewithagents/glue/issues/31)) ([f200c7b](https://github.com/codewithagents/glue/commit/f200c7b662f743c41699c177ce37ab1069404d52))
* **cli:** add --config flag to openapi-gen and openapi-react-query with path security validation ([#38](https://github.com/codewithagents/glue/issues/38)) ([56c4352](https://github.com/codewithagents/glue/commit/56c435213dd59fd856e11102a22c12eb0d7aa0e4))
* **openapi-gen:** add Zod validation constraints from OpenAPI schema ([#28](https://github.com/codewithagents/glue/issues/28)) ([058bf01](https://github.com/codewithagents/glue/commit/058bf01cf0a4cdaf9e5ba5ac19124cab55f29129))
* **openapi-gen:** deprecated JSDoc, numeric enums, date-time format, typed error unions, discriminated unions ([b23bd69](https://github.com/codewithagents/glue/commit/b23bd69000ea9ca24a9188863ecb5a6ad5b18fc8))
* **openapi-gen:** enum query params, barrel index.ts, YAML spec support ([#15](https://github.com/codewithagents/glue/issues/15)) ([6427556](https://github.com/codewithagents/glue/commit/64275567e08fd0c801f2a6fb4700edc269f6f54a))
* **openapi-gen:** header params, cookie auth, multipart bodies, array query serialization ([#33](https://github.com/codewithagents/glue/issues/33)) ([dbfc3da](https://github.com/codewithagents/glue/commit/dbfc3da28593521e6c9832507fc684b7d2ca82cd))
* **openapi-gen:** stable 1.0 API — onError hook ([#17](https://github.com/codewithagents/glue/issues/17)) ([6e5ccb9](https://github.com/codewithagents/glue/commit/6e5ccb9a4cd87a9dbc3516eb36581cdd1f49abb0))
* Zod v4 schema bootstrap from OpenAPI spec ([#9](https://github.com/codewithagents/glue/issues/9)) ([132b571](https://github.com/codewithagents/glue/commit/132b5716a90784f14c6bd13aa607ec98b1d1a71b))


### Bug Fixes

* **openapi-gen:** add repository URL and executable bit for npm provenance ([#25](https://github.com/codewithagents/glue/issues/25)) ([53ce21d](https://github.com/codewithagents/glue/commit/53ce21d7d7c964ab49ec588378c12b5225f1b6a8))
* **openapi-gen:** emit values array alongside numeric enum type ([3ca3dac](https://github.com/codewithagents/glue/commit/3ca3dac7f0fe3ffa1be43ac9ced0dd54fc8b66ee))
* **openapi-gen:** required params, inline type guards, real-world fixture coverage ([#12](https://github.com/codewithagents/glue/issues/12)) ([1cb4d6f](https://github.com/codewithagents/glue/commit/1cb4d6f0321a3a77e63a9b13d649962f6f566c68))
* **openapi-gen:** resolve $ref parameters from components, add minItems/maxItems to Zod arrays ([#35](https://github.com/codewithagents/glue/issues/35)) ([2076c24](https://github.com/codewithagents/glue/commit/2076c2499a10a35bcbea997b30afec6134528378))

## [1.4.0](https://github.com/codewithagents/glue/compare/openapi-gen-v1.3.1...openapi-gen-v1.4.0) (2026-05-24)


### Features

* **cli:** add --config flag to openapi-gen and openapi-react-query with path security validation ([#38](https://github.com/codewithagents/glue/issues/38)) ([56c4352](https://github.com/codewithagents/glue/commit/56c435213dd59fd856e11102a22c12eb0d7aa0e4))

## [1.3.1](https://github.com/codewithagents/glue/compare/openapi-gen-v1.3.0...openapi-gen-v1.3.1) (2026-05-23)


### Bug Fixes

* **openapi-gen:** resolve $ref parameters from components, add minItems/maxItems to Zod arrays ([#35](https://github.com/codewithagents/glue/issues/35)) ([2076c24](https://github.com/codewithagents/glue/commit/2076c2499a10a35bcbea997b30afec6134528378))

## [1.3.0](https://github.com/codewithagents/glue/compare/openapi-gen-v1.2.0...openapi-gen-v1.3.0) (2026-05-23)


### Features

* **openapi-gen:** header params, cookie auth, multipart bodies, array query serialization ([#33](https://github.com/codewithagents/glue/issues/33)) ([dbfc3da](https://github.com/codewithagents/glue/commit/dbfc3da28593521e6c9832507fc684b7d2ca82cd))

## [1.2.0](https://github.com/codewithagents/glue/compare/openapi-gen-v1.1.0...openapi-gen-v1.2.0) (2026-05-23)


### Features

* add integration package + ApiError body unwrapping + coverage cleanup ([#31](https://github.com/codewithagents/glue/issues/31)) ([f200c7b](https://github.com/codewithagents/glue/commit/f200c7b662f743c41699c177ce37ab1069404d52))

## [1.1.0](https://github.com/codewithagents/glue/compare/openapi-gen-v1.0.1...openapi-gen-v1.1.0) (2026-05-23)


### Features

* **openapi-gen:** add Zod validation constraints from OpenAPI schema ([#28](https://github.com/codewithagents/glue/issues/28)) ([058bf01](https://github.com/codewithagents/glue/commit/058bf01cf0a4cdaf9e5ba5ac19124cab55f29129))

## [1.0.1](https://github.com/codewithagents/glue/compare/openapi-gen-v1.0.0...openapi-gen-v1.0.1) (2026-05-23)


### Bug Fixes

* **openapi-gen:** add repository URL and executable bit for npm provenance ([#25](https://github.com/codewithagents/glue/issues/25)) ([53ce21d](https://github.com/codewithagents/glue/commit/53ce21d7d7c964ab49ec588378c12b5225f1b6a8))

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

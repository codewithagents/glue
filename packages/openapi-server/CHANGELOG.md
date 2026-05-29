# Changelog

## [1.2.0](https://github.com/codewithagents/glue/compare/openapi-server-v1.1.0...openapi-server-v1.2.0) (2026-05-29)


### Features

* **smoke:** expand to 9 real API requests, run on every push to main ([#144](https://github.com/codewithagents/glue/issues/144)) ([ba0c7c3](https://github.com/codewithagents/glue/commit/ba0c7c39c97f4f0a152fed67676346c035de90fd))

## [1.1.0](https://github.com/codewithagents/glue/compare/openapi-server-v1.0.0...openapi-server-v1.1.0) (2026-05-29)


### Features

* examples directory — 11 real-world specs, 7 generator bug fixes ([#137](https://github.com/codewithagents/glue/issues/137)) ([66edd3f](https://github.com/codewithagents/glue/commit/66edd3feacad868ed24058370c910628ccd7dc5a))


### Bug Fixes

* **ci:** isolate codecov uploads + expand compat matrix to all 3 generators ([#140](https://github.com/codewithagents/glue/issues/140)) ([240b79a](https://github.com/codewithagents/glue/commit/240b79a0360d2f89cc08db56e8629c8c068c07a2))
* **coverage:** use lcov projectRoot option to emit repo-relative SF paths ([8cefc4f](https://github.com/codewithagents/glue/commit/8cefc4fa39755c923b97c0938ccec72b3fe3768f))
* generator handles 127/128 real-world specs + docs update ([#139](https://github.com/codewithagents/glue/issues/139)) ([07fcd2a](https://github.com/codewithagents/glue/commit/07fcd2a4c7c9e92b91ea0b3754e9774cf7ff1439))

## [1.0.0](https://github.com/codewithagents/glue/compare/openapi-server-v0.3.0...openapi-server-v1.0.0) (2026-05-27)


### ⚠ BREAKING CHANGES

* generated files are now Prettier-formatted. Re-generate after upgrading if you run prettier --check on committed output.

### Features

* regenerate with Prettier and add vitest unit tests ([#134](https://github.com/codewithagents/glue/issues/134)) ([1d50c89](https://github.com/codewithagents/glue/commit/1d50c8915432464bde64067720691431973bf494))
* YAML/Zod pipeline tests + openapi-server Prettier and 1.0.0 ([#133](https://github.com/codewithagents/glue/issues/133)) ([8ec2f1e](https://github.com/codewithagents/glue/commit/8ec2f1ec17486fc3645939e515cbb401500927f3))

## [0.3.0](https://github.com/codewithagents/glue/compare/openapi-server-v0.2.0...openapi-server-v0.3.0) (2026-05-26)


### Features

* **openapi-server:** Zod request validation via input_schema + YAML spec support ([#102](https://github.com/codewithagents/glue/issues/102)) ([5d9276e](https://github.com/codewithagents/glue/commit/5d9276e55807e68a3ccce7a85b9950bd90242561))


### Bug Fixes

* repair per-package Codecov badges and add openapi-server coverage ([#97](https://github.com/codewithagents/glue/issues/97)) ([72b3b50](https://github.com/codewithagents/glue/commit/72b3b50e6bb0502e21d2ae967ee20f6578fffc86))

## [0.2.0](https://github.com/codewithagents/glue/compare/openapi-server-v0.1.0...openapi-server-v0.2.0) (2026-05-26)


### Features

* add @codewithagents/openapi-server package ([#91](https://github.com/codewithagents/glue/issues/91)) ([44cbe80](https://github.com/codewithagents/glue/commit/44cbe801317f29d22892ec92ef557189c0dbee2b))

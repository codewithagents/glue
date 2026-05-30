---
title: Compatibility
description: OpenAPI version support and the 128-spec compatibility matrix.
---

## OpenAPI version support

| Version | Support level |
|---|---|
| OpenAPI 3.1.x (including 3.1.1) | Primary target. Full support. |
| OpenAPI 3.0.x | Best-effort. Most features work. |
| OpenAPI 2.0 (Swagger) | Not supported. |

OpenAPI 3.1 is the primary target across all packages. Every PR runs the full generator pipeline against 128 real-world specs. The compatibility matrix CI run uses the specs in the [`examples/`](https://github.com/codewithagents/glue/tree/main/examples) directory.

## 128-spec matrix

The generator is tested on every PR against a curated set of public OpenAPI specs including:

- Stripe, GitHub, Spotify, OpenAI, Adyen, Twilio, Slack, Vercel
- AWS service specs, Google Cloud APIs
- Community-contributed real-world specs

The matrix distinguishes between:

- **Showcase specs (11):** committed generated output with drift detection. Any change to generator behavior that affects these specs will fail the CI check.
- **Compat matrix specs (117):** generated at CI time and checked for errors. No committed output.

### Known limitations

Some specs use patterns the generator does not yet fully support:

- Dots in `operationId` values (common in Google APIs).
- Spaces or special characters in `operationId`.
- Very deeply nested `$ref` chains in some AWS specs.

These produce warnings or are skipped. They do not fail the generator for the rest of the spec.

<!-- TODO (Phase 2): embed live pass/fail counts from the CI matrix run, and link to the per-spec results -->

## TypeScript support

All generated output passes TypeScript `strict: true`. The generator targets TypeScript 5.x and 6.x. Generated imports use `.js` extensions for `NodeNext` module resolution compatibility.

## Framework compatibility

The generated client uses only the native `fetch` API. It works in:

- Node.js 18 and later (built-in `fetch`)
- Deno
- Bun
- All modern browsers
- Edge runtimes (Cloudflare Workers, Vercel Edge, etc.)

## What is not supported (yet)

- Python, Ruby, Go, or other non-TypeScript targets.
- Runtime SDK wrappers (the generated output is a codegen artifact, not a maintained SDK).
- OpenAPI callbacks and webhooks (generation is best-effort).

If you need one of these, Glue is probably not the right tool for your case.

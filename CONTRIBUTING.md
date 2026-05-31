# Contributing

Thank you for your interest in contributing! This is a pnpm monorepo. Here's everything you need to get started.

---

## Prerequisites

- **Node.js 22+**
- **pnpm 10+** — `npm install -g pnpm`
- **TypeScript 6** — installed automatically as a dev dependency

---

## Getting started

```bash
git clone https://github.com/codewithagents/openapi-zod-ts.git
cd openapi-zod-ts
pnpm install
```

### Repository structure

```
packages/
  api-errors/       # @codewithagents/api-errors
  openapi-gen/      # @codewithagents/openapi-gen
.github/
  workflows/        # CI (build + lint + test) and Release Please
```

---

## Development workflow

### Run tests for a specific package

```bash
pnpm --filter @codewithagents/openapi-gen test
pnpm --filter @codewithagents/api-errors test
```

### Run all tests

```bash
pnpm test
```

### Run tests with coverage

```bash
pnpm --filter @codewithagents/openapi-gen test:coverage
```

### Build a package

```bash
pnpm --filter @codewithagents/openapi-gen build
```

### Type-check without emitting

```bash
pnpm --filter @codewithagents/openapi-gen lint
```

### Update snapshots after intentional output changes

```bash
pnpm --filter @codewithagents/openapi-gen test -- -u
```

---

## Commit message convention

We use [Conventional Commits](https://www.conventionalcommits.org/) with **package scopes**. This is not optional — [Release Please](https://github.com/googleapis/release-please) reads commit scopes to decide which package to version-bump.

| Type | When to use |
|---|---|
| `feat(openapi-gen): ...` | New feature in openapi-gen |
| `fix(api-errors): ...` | Bug fix in api-errors |
| `chore(openapi-gen): ...` | Maintenance (deps, config, CI) |
| `docs(openapi-gen): ...` | Documentation only |
| `test(openapi-gen): ...` | Adding or fixing tests |
| `refactor(openapi-gen): ...` | Refactoring with no behaviour change |

**Why scopes matter:** An unscoped commit (`feat: ...`) is treated as a change to ALL packages and bumps every package's version. Always scope to the package you changed.

### Breaking changes

Add `BREAKING CHANGE:` in the commit footer (or `!` after the type) to trigger a major version bump:

```
feat(openapi-gen)!: drop TypeScript 5 support

BREAKING CHANGE: TypeScript 6.0 is now required.
```

---

## Adding a new package

1. Create `packages/your-package/` with a `package.json` (name: `@codewithagents/your-package`)
2. Add it to `pnpm-workspace.yaml` (already covered by `packages/*`)
3. Add an entry to `release-please-config.json` with a `component` field
4. Add an entry to `.release-please-manifest.json`
5. Add a publish job to `.github/workflows/release.yml`

---

## Pull request guidelines

- **Small and focused** — one concern per PR. If it touches unrelated files, split it.
- **Tests required** — new behaviour must have tests; bug fixes must have a regression test.
- **TypeScript strict** — all generated code and library code must pass `strict: true`.
- **No `any`** — use `unknown` + type guards, or proper generics.
- **Snapshot updates** — if you change generated output intentionally, run `test -- -u` to update snapshots and commit the new snapshot file.

---

## Code style

- TypeScript 6 strict mode throughout
- Generated code should look like code a developer would write — readable, not magical
- Prefer explicit types over inference where it aids clarity
- Use `type` imports (`import type { Foo }`) where possible

---

## Questions?

Open a [Discussion](https://github.com/codewithagents/openapi-zod-ts/discussions) or file an issue. We're happy to help.

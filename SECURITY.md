# Security Policy

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities privately via GitHub's [Security Advisories](../../security/advisories/new) feature.

We will respond within 48 hours and aim to release a fix within 7 days for confirmed issues.

## Security regression tests

This toolchain generates code from untrusted OpenAPI specs, so the primary threat
class is spec-driven code injection (a hostile spec value breaking out of a generated
string literal and injecting executable code). We guard this with dedicated regression
tests, kept discoverable by convention:

- **Files:** `packages/*/src/__tests__/security-escape.test.ts`
- **Describe blocks:** every block label is prefixed with `SECURITY:`
- **What they assert:** adversarial spec values (quotes, backticks, `${`, newlines in
  paths, enum values, header names, resource names) appear in generated output only as
  safely-escaped string literals, never as injected statements.

Run only the security tests across all packages:

```
pnpm -r test -t SECURITY
```

When adding a new generator code path that emits a spec-derived string, add a matching
`SECURITY:` test that feeds an adversarial payload through it.

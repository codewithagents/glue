---
name: add-package
description: Step-by-step guide to add a new publishable package to the codewithagents/glue monorepo and get its 0.1.0 on npm.
allowed-tools: Read, Bash, Edit, Write
---

# Add a New Package

Complete ceremony for introducing a new package, from skeleton to automated releases.

## Overview

```
1. Create package skeleton (PR)
2. Wire Release Please + publish pipeline (same PR or follow-up)
3. Merge PR
4. Owner publishes 0.1.0 manually (one-time, with 2FA)
5. Owner configures Trusted Publisher on npmjs.com (one-time)
6. All future releases: fully automated via Release Please
```

---

## Step 1 — Package skeleton

Create `packages/<name>/` with:

```
packages/<name>/
  package.json
  tsconfig.json
  tsconfig.build.json    # if the package has a CLI or build step
  src/
    index.ts
  CLAUDE.md              # compact: what it generates/does, non-obvious decisions
  CHANGELOG.md           # bootstrap (see template below)
```

**`package.json` minimum:**
```json
{
  "name": "@codewithagents/<name>",
  "version": "0.1.0",
  "description": "...",
  "type": "module",
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "test": "vitest run",
    "lint": "tsc -p tsconfig.build.json --noEmit"
  },
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/codewithagents/glue" },
  "publishConfig": { "access": "public" }
}
```

If it has a CLI binary add:
```json
"bin": { "<cli-name>": "./dist/cli.js" }
```
And append `&& chmod +x dist/cli.js` to the build script.

**No `pnpm-workspace.yaml` change needed** — all `packages/*` are auto-discovered.

**Bootstrap `CHANGELOG.md`:**
```markdown
# Changelog

## 0.1.0 (YYYY-MM-DD)

### Features

* initial release
```

---

## Step 2 — Wire Release Please

**`release-please-config.json`** — add entry:
```json
"packages/<name>": {
  "release-type": "node",
  "package-name": "@codewithagents/<name>",
  "component": "<name>",
  "changelog-path": "CHANGELOG.md",
  "bump-major-pre-major": true
}
```

**`.release-please-manifest.json`** — seed at current version:
```json
"packages/<name>": "0.1.0"
```
Seeding prevents Release Please from creating a spurious 0.1.0 release after merge (it already exists).

---

## Step 3 — Wire publish pipeline

In `.github/workflows/release.yml`:

**Add `workflow_dispatch` input** (recovery use):
```yaml
publish_<name_underscored>:
  description: 'Re-publish @codewithagents/<name> (for failed release recovery)'
  type: boolean
  default: false
```

**Add job output** in the `release-please` job:
```yaml
<name>--release_created: ${{ steps.release.outputs['packages/<name>--release_created'] }}
<name>--version: ${{ steps.release.outputs['packages/<name>--version'] }}
```

**Add publish job** (copy `publish-openapi-gen` and adapt):
```yaml
publish-<name>:
  name: Publish @codewithagents/<name>
  needs: release-please
  if: ${{ needs.release-please.outputs['<name>--release_created'] || inputs.publish_<name_underscored> }}
  runs-on: ubuntu-latest
  permissions:
    contents: read
    id-token: write
  steps:
    # Copy action pins from publish-openapi-gen job in release.yml — keep them identical
    - uses: actions/checkout@...
    - uses: pnpm/action-setup@...
    - uses: actions/setup-node@... # node-version: 22, cache: pnpm, registry-url: https://registry.npmjs.org
    - run: npm install -g npm@latest    # OIDC requires npm ≥11.5.1
    - run: npm config delete //registry.npmjs.org/:_authToken  # remove injected token
    - run: pnpm install --frozen-lockfile
    - run: pnpm --filter @codewithagents/<name> build
    # Add extra build steps for workspace deps if needed (e.g. openapi-gen)
    - run: npm publish --access public --provenance
      working-directory: packages/<name>
```

---

## Step 4 — Merge the PR

Standard squash merge. CI must be green first.

---

## Step 5 — Owner publishes 0.1.0 manually (one-time)

**Why manual?** OIDC Trusted Publishing only works for packages that already exist on npm. The very first publish must be done by a human with 2FA.

```bash
cd packages/<name>
pnpm build
npm publish --access public
# npm will prompt for 2FA OTP
```

Check it landed: `npm info @codewithagents/<name>`

---

## Step 6 — Owner configures Trusted Publisher on npmjs.com (one-time)

1. Go to https://www.npmjs.com/package/@codewithagents/<name>
2. **Settings** → **Publishing access** → **Add a publisher**
3. Choose **GitHub Actions**
4. Fill in:
   - **Repository owner**: `codewithagents`
   - **Repository name**: `glue`
   - **Workflow filename**: `release.yml`
   - **Environment** (optional): leave blank unless the job uses one
5. Save

After this, the `publish-<name>` GitHub Actions job can publish via OIDC — no token required.

---

## Step 7 — Verify the pipeline

Make a `feat:` commit touching `packages/<name>/` and open a PR. After merge, Release Please will:
1. Open a "Release PR" bumping the version to 0.2.0
2. On merge of that release PR → create a GitHub release → trigger `publish-<name>` → publish to npm automatically

---

## Checklist

- [ ] `packages/<name>/` skeleton created with correct `package.json` and `CLAUDE.md`
- [ ] `CHANGELOG.md` bootstrapped
- [ ] `release-please-config.json` updated
- [ ] `.release-please-manifest.json` seeded at `0.1.0`
- [ ] `release.yml` updated (input + output + job)
- [ ] PR merged, CI green
- [ ] Owner ran `npm publish --access public` locally with 2FA
- [ ] Owner configured Trusted Publisher on npmjs.com

import { execFileSync } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const EXAMPLES_DIR = resolve(__dirname, '..')
const CLI = resolve(REPO_ROOT, 'packages/openapi-gen/dist/cli.cjs')

/**
 * Specs to generate before smoke tests run.
 * Showcase specs (open-meteo, canada_holidays, exchangerate) are regenerated
 * fresh each run — their committed output serves the Showcase drift-check workflow.
 * Smoke-only specs (_smoke-dnd5e) are never committed.
 */
const SMOKE_SPECS = ['open-meteo', 'canada_holidays', 'exchangerate', '_smoke-dnd5e']

export default async function setup(): Promise<void> {
  for (const spec of SMOKE_SPECS) {
    console.log(`[smoke] generating ${spec}...`)
    execFileSync('node', [CLI, '--config', `configs/${spec}.json`], {
      cwd: EXAMPLES_DIR,
      stdio: 'inherit',
    })
  }
}

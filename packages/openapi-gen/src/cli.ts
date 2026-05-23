#!/usr/bin/env node
import { generate } from './generator.js'
generate(process.cwd()).catch((err: Error) => {
  console.error(err.message)
  process.exit(1)
})

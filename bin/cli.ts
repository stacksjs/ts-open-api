#!/usr/bin/env bun

import { CLI } from '@stacksjs/clapp'
import { generateTypes } from '../src/generator'
import { version } from '../package.json'

const cli = new CLI('open-api')

interface GenerateOptions {
  output: string
  alphabetize?: boolean
  immutable?: boolean
  silent?: boolean
}

cli
  .command('<input>', 'Generate TypeScript types from OpenAPI schema')
  .option('--output <output>', 'Output file path', { default: './api-types.ts' })
  .option('--alphabetize', 'Alphabetize types')
  .option('--immutable', 'Generate readonly properties')
  .option('--silent', 'Silent mode')
  .example('open-api openapi.json --output api-types.ts')
  .example('open-api schema.json --output types.ts --alphabetize')
  .action(async (input: string, options: GenerateOptions) => {
    try {
      await generateTypes({
        input,
        output: options.output,
        alphabetize: options.alphabetize,
        immutable: options.immutable,
        silent: options.silent,
      })
    }
    catch (error) {
      console.error('Error generating types:', error)
      process.exit(1)
    }
  })

cli.command('version', 'Show the version of the CLI').action(() => {
  console.log(version)
})

cli.version(version)
cli.help()
cli.parse()

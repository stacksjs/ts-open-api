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
  exportType?: boolean
  defaultNonNullable?: boolean
  additionalProperties?: boolean
  pathParamsAsTypes?: boolean
  supportArrayLength?: boolean
  noHeader?: boolean
  includeDescriptions?: boolean
  includeExamples?: boolean
}

cli
  .command('<input>', 'Generate TypeScript types from OpenAPI schema')
  .option('--output <output>', 'Output file path', { default: './api-types.ts' })
  .option('--alphabetize', 'Alphabetize types')
  .option('--immutable', 'Generate readonly properties')
  .option('--silent', 'Silent mode')
  .option('--export-type', 'Use export type instead of export interface')
  .option('--default-non-nullable', 'Treat schema objects as non-nullable by default')
  .option('--additional-properties', 'Allow arbitrary properties via index signature')
  .option('--path-params-as-types', 'Generate path params as string literal types')
  .option('--support-array-length', 'Support array length validation in types')
  .option('--no-header', 'Disable header comment')
  .option('--include-descriptions', 'Include descriptions as JSDoc comments')
  .option('--include-examples', 'Include examples in JSDoc comments')
  .example('open-api openapi.json --output api-types.ts')
  .example('open-api schema.json --output types.ts --alphabetize')
  .example('open-api openapi.yaml --output types.ts --immutable --include-descriptions')
  .action(async (input: string, options: GenerateOptions) => {
    try {
      await generateTypes({
        input,
        output: options.output,
        alphabetize: options.alphabetize,
        immutable: options.immutable,
        silent: options.silent,
        exportType: options.exportType,
        defaultNonNullable: options.defaultNonNullable,
        additionalProperties: options.additionalProperties,
        pathParamsAsTypes: options.pathParamsAsTypes,
        supportArrayLength: options.supportArrayLength,
        header: !options.noHeader,
        includeDescriptions: options.includeDescriptions,
        includeExamples: options.includeExamples,
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

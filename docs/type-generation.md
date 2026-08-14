---
title: Type Generation
description: Configure and customize TypeScript type generation from OpenAPI schemas.
---

# Type Generation

ts-open-api provides extensive options for customizing the generated TypeScript types.

## Basic Generation

### CLI Generation

```bash
# Generate types from a local file
open-api ./openapi.json --output ./api-types.ts

# Generate from a remote URL
open-api https://api.example.com/openapi.json --output ./api-types.ts
```

### Programmatic Generation

```ts
import { generateTypes } from 'ts-open-api'

await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
})
```

## Output Customization

### Alphabetize Types

Sort generated types alphabetically:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  alphabetize: true,
})
```

### Immutable Types

Generate readonly properties:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  immutable: true,
})
```

Generated output:

```ts
export interface User {
  readonly "id": string
  readonly "name": string
  readonly "email"?: string
}
```

### Export Type vs Interface

Use `export type` instead of `export interface`:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  exportType: true,
})
```

Generated output:

```ts
export type User = {
  "id"?: string
  "name"?: string
}
```

## Documentation

### Include Descriptions

Add JSDoc comments from schema descriptions:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  includeDescriptions: true,
})
```

Generated output:

```ts
export interface User {
  /** The unique identifier for the user */
  "id": string
  /** The user's full name */
  "name": string
}
```

### Include Examples

Add examples to JSDoc comments:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  includeDescriptions: true,
  includeExamples: true,
})
```

Generated output:

```ts
export interface User {
  /**
   * The unique identifier for the user
   * @example "user-123"
   */
  "id": string
  /**
   * The user's full name
   * @example "John Doe"
   */
  "name": string
}
```

## Header Customization

### Disable Header

Remove the auto-generated header comment:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  header: false,
})
```

### Custom Header

Provide a custom header comment:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  headerComment: `/**
 * Custom API Types
 * Generated on ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY
 */`,
})
```

## Schema Transformation

### Transform Hook

Modify schemas before type generation:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  transform: (schema) => {
    // Convert date-time strings to Date type
    if (schema.type === 'string' && schema.format === 'date-time') {
      return { ...schema, tsType: 'Date' }
    }

    // Add null to optional fields
    if (!schema.required) {
      return { ...schema, nullable: true }
    }

    return schema
  },
})
```

### Post-Transform Hook

Modify the generated TypeScript:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  postTransform: (typescript) => {
    // Add custom imports
    return `import type { CustomType } from './custom'\n\n${typescript}`
  },
})
```

## Inject Custom Types

Add custom type definitions:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  inject: `
// Custom utility types
type Nullable<T> = T | null
type Optional<T> = T | undefined
type ID = string | number
`,
})
```

## Advanced Options

### Default Non-Nullable

Treat schema objects as non-nullable by default:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  defaultNonNullable: true,
})
```

### Additional Properties

Allow arbitrary properties via index signature:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  additionalProperties: true,
})
```

### Path Parameters as Types

Generate path params as string literal types:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  pathParamsAsTypes: true,
})
```

### Array Length Support

Support array length validation in types:

```ts
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  supportArrayLength: true,
})
```

## Complete Example

```ts
import { generateTypes } from 'ts-open-api'

await generateTypes({
  input: './openapi.json',
  output: './src/api-types.ts',

  // Formatting
  alphabetize: true,
  immutable: true,
  exportType: false,

  // Documentation
  includeDescriptions: true,
  includeExamples: true,

  // Header
  headerComment: `/**
 * API Types
 * Generated: ${new Date().toISOString()}
 */`,

  // Transformations
  transform: (schema) => {
    if (schema.format === 'date-time') {
      return { ...schema, tsType: 'Date' }
    }
    return schema
  },

  postTransform: (ts) => {
    return `import { z } from 'zod'\n\n${ts}`
  },

  inject: `
type Nullable<T> = T | null
`,

  // Output
  silent: false,
})
```

## Node.js API

For more control, use the generator class directly:

```ts
import { OpenAPITypeScriptGenerator } from 'ts-open-api'
import type { OpenAPISchema } from 'ts-open-api'

// Load your schema
const schema: OpenAPISchema = JSON.parse(
  await Bun.file('./openapi.json').text()
)

// Create generator
const generator = new OpenAPITypeScriptGenerator(schema, {
  input: './openapi.json',
  output: './api-types.ts',
  alphabetize: true,
  immutable: true,
  includeDescriptions: true,
})

// Generate TypeScript
const typescript = generator.generate()

// Post-process as needed
const finalOutput = typescript
  .replace(/export interface/g, 'export type')
  .replace(/\{/g, '= {')

// Write output
await Bun.write('./api-types.ts', finalOutput)
```

## Integration Examples

### With Bun Build

```ts
// build.ts
import { generateTypes } from 'ts-open-api'

// Generate types before building
await generateTypes({
  input: './api/openapi.json',
  output: './src/generated/api-types.ts',
  alphabetize: true,
})

// Continue with build
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
})
```

### Package.json Scripts

```json
{
  "scripts": {
    "generate-types": "open-api ./openapi.json --output ./src/api-types.ts",
    "prebuild": "bun run generate-types"
  }
}
```

## Next Steps

- [Configuration](/config) - Complete options reference
- [CLI Usage](/cli-usage) - Command-line interface
- [Schema Parsing](/schema-parsing) - Schema format details

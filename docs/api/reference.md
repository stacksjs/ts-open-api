# API Reference

Complete API reference for ts-open-api.

## Functions

### generateTypes

Generate TypeScript definitions from an OpenAPI schema.

```typescript
import { generateTypes } from 'ts-open-api'

await generateTypes(options: GeneratorOptions): Promise<void>
```

#### GeneratorOptions

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `input` | `string` | Yes | - | Path to OpenAPI schema (local or URL) |
| `output` | `string` | Yes | - | Output file path |
| `alphabetize` | `boolean` | No | `false` | Sort types alphabetically |
| `immutable` | `boolean` | No | `false` | Generate readonly properties |
| `exportType` | `boolean` | No | `false` | Use `type` instead of `interface` |
| `defaultNonNullable` | `boolean` | No | `false` | Treat schemas as non-nullable |
| `additionalProperties` | `boolean` | No | `false` | Allow index signatures |
| `pathParamsAsTypes` | `boolean` | No | `false` | Path params as string literals |
| `supportArrayLength` | `boolean` | No | `false` | Array length validation |
| `includeDescriptions` | `boolean` | No | `false` | Include JSDoc descriptions |
| `includeExamples` | `boolean` | No | `false` | Include @example in JSDoc |
| `header` | `boolean` | No | `true` | Include header comment |
| `headerComment` | `string` | No | - | Custom header comment |
| `silent` | `boolean` | No | `false` | Suppress console output |
| `transform` | `Function` | No | - | Pre-transform schema hook |
| `postTransform` | `Function` | No | - | Post-transform TypeScript hook |
| `inject` | `string` | No | - | Custom types to inject |

#### Example

```typescript
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  alphabetize: true,
  immutable: true,
  includeDescriptions: true,
  includeExamples: true,
  transform: (schema) => {
    // Modify schema before generation
    return schema
  },
  postTransform: (typescript) => {
    // Modify generated TypeScript
    return typescript
  }
})
```

## Classes

### OpenAPITypeScriptGenerator

Low-level generator class for manual usage.

```typescript
import { OpenAPITypeScriptGenerator } from 'ts-open-api'
import type { OpenAPISchema, GeneratorOptions } from 'ts-open-api'

const schema: OpenAPISchema = { ... }
const options: GeneratorOptions = { input: '', output: '' }

const generator = new OpenAPITypeScriptGenerator(schema, options)
const typescript = generator.generate()
```

#### Constructor

```typescript
new OpenAPITypeScriptGenerator(schema: OpenAPISchema, options: GeneratorOptions)
```

#### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `generate()` | `string` | Generate TypeScript definitions |

## Types

### OpenAPISchema

OpenAPI schema object type.

```typescript
interface OpenAPISchema {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  paths?: Record<string, PathItem>
  components?: {
    schemas?: Record<string, SchemaObject>
    responses?: Record<string, ResponseObject>
    parameters?: Record<string, ParameterObject>
  }
}
```

### SchemaObject

Schema object type.

```typescript
interface SchemaObject {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'
  format?: string
  properties?: Record<string, SchemaObject | ReferenceObject>
  required?: string[]
  items?: SchemaObject | ReferenceObject
  enum?: (string | number)[]
  allOf?: (SchemaObject | ReferenceObject)[]
  anyOf?: (SchemaObject | ReferenceObject)[]
  oneOf?: (SchemaObject | ReferenceObject)[]
  nullable?: boolean
  description?: string
  example?: any
  deprecated?: boolean
  additionalProperties?: boolean | SchemaObject
}
```

### ReferenceObject

Reference object type.

```typescript
interface ReferenceObject {
  $ref: string
}
```

### GeneratorOptions

Generator options type.

```typescript
interface GeneratorOptions {
  input: string
  output: string

  // Type generation
  exportType?: boolean
  alphabetize?: boolean
  immutable?: boolean
  additionalProperties?: boolean
  defaultNonNullable?: boolean
  pathParamsAsTypes?: boolean
  supportArrayLength?: boolean

  // Documentation
  includeDescriptions?: boolean
  includeExamples?: boolean

  // Header
  header?: boolean
  headerComment?: string

  // Output
  silent?: boolean

  // Transforms
  transform?: (schema: SchemaObject) => SchemaObject
  postTransform?: (typescript: string) => string
  inject?: string
}
```

## CLI

### Command

```bash
open-api <input> [options]
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--output <path>` | `-o` | Output file path |
| `--alphabetize` | | Sort types alphabetically |
| `--immutable` | | Generate readonly properties |
| `--silent` | | Suppress console output |
| `--export-type` | | Use `export type` |
| `--default-non-nullable` | | Non-nullable by default |
| `--additional-properties` | | Allow index signatures |
| `--path-params-as-types` | | Path params as literals |
| `--support-array-length` | | Array length validation |
| `--no-header` | | Disable header comment |
| `--include-descriptions` | | Include JSDoc descriptions |
| `--include-examples` | | Include @example in JSDoc |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

### Examples

```bash
# Basic usage
open-api ./openapi.json -o ./types.ts

# Full options
open-api ./openapi.json \
  --output ./types.ts \
  --alphabetize \
  --immutable \
  --include-descriptions \
  --include-examples
```

## Type Mappings

### OpenAPI to TypeScript

| OpenAPI | TypeScript |
|---------|------------|
| `string` | `string` |
| `number` | `number` |
| `integer` | `number` |
| `boolean` | `boolean` |
| `null` | `null` |
| `array` | `T[]` |
| `object` | `{ ... }` |
| `enum` | Union of literals |
| `$ref` | Referenced type name |
| `allOf` | Intersection (`&`) |
| `oneOf` | Union (`\|`) |
| `anyOf` | Union (`\|`) |
| `nullable: true` | `T \| null` |

### Format Handling

All string formats are currently mapped to `string`. Use the `transform` option for custom mapping:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  transform: (schema) => {
    if (schema.type === 'string') {
      switch (schema.format) {
        case 'date-time':
          return { ...schema, tsType: 'Date' }
        case 'uuid':
          return { ...schema, tsType: 'UUID' }
        default:
          return schema
      }
    }
    return schema
  }
})
```

<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-open-api

A blazingly fast, native OpenAPI to TypeScript type generator built with Bun. Generate TypeScript types from OpenAPI 3.0 schemas with zero runtime overhead.

## Why ts-open-api?

- ⚡️ **Lightning Fast** - Built with Bun for maximum performance
- 🎯 **Zero Runtime** - Pure TypeScript types with no runtime dependencies
- 🔧 **Highly Configurable** - Extensive options for customizing output
- 📝 **JSDoc Support** - Generate rich documentation from your OpenAPI schemas
- 🎨 **Transform API** - Customize type generation with transform hooks
- 🧪 **Well Tested** - Comprehensive test suite with 26+ test cases
- 🚀 **Native Implementation** - No external dependencies for type generation

## Features

- ✅ Full OpenAPI 3.0 & 3.1 support
- ✅ Generate types from local or remote schemas
- ✅ Support for all schema types (objects, arrays, enums, unions, etc.)
- ✅ Schema composition (allOf, anyOf, oneOf)
- ✅ Reference resolution ($ref)
- ✅ Path parameters, query parameters, and headers
- ✅ Request bodies and responses
- ✅ JSDoc comments with descriptions and examples
- ✅ Readonly/immutable types
- ✅ Custom type transformations
- ✅ Alphabetical sorting
- ✅ CLI and programmatic API

## Installation

```bash
# Using bun
bun add -D ts-open-api

# Using npm
npm install -D ts-open-api

# Using pnpm
pnpm add -D ts-open-api

# Using yarn
yarn add -D ts-open-api
```

## Quick Start

### CLI Usage

```bash
# Generate types from a local OpenAPI schema
open-api ./openapi.json --output ./api-types.ts

# Generate from a remote schema
open-api https://api.example.com/openapi.json --output ./api-types.ts

# With options
open-api ./openapi.json \
  --output ./api-types.ts \
  --alphabetize \
  --immutable \
  --include-descriptions
```

### Programmatic Usage

```typescript
import { generateTypes } from 'ts-open-api'

await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  alphabetize: true,
  immutable: true,
  includeDescriptions: true,
})
```

### Node.js API

```typescript
import { OpenAPITypeScriptGenerator } from 'ts-open-api'
import type { OpenAPISchema } from 'ts-open-api'

const schema: OpenAPISchema = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
  paths: {
    '/users': {
      get: {
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
        },
      },
    },
  },
}

const generator = new OpenAPITypeScriptGenerator(schema, {
  input: '',
  output: '',
  alphabetize: true,
})

const typescript = generator.generate()
console.log(typescript)
```

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output file path | `./api-types.ts` |
| `--alphabetize` | Sort types alphabetically | `false` |
| `--immutable` | Generate readonly properties | `false` |
| `--silent` | Suppress console output | `false` |
| `--export-type` | Use `export type` instead of `export interface` | `false` |
| `--default-non-nullable` | Treat schema objects as non-nullable by default | `false` |
| `--additional-properties` | Allow arbitrary properties via index signature | `false` |
| `--path-params-as-types` | Generate path params as string literal types | `false` |
| `--support-array-length` | Support array length validation in types | `false` |
| `--no-header` | Disable header comment | `false` |
| `--include-descriptions` | Include descriptions as JSDoc comments | `false` |
| `--include-examples` | Include examples in JSDoc comments | `false` |

## Programmatic API Options

All CLI options are available in the programmatic API, plus additional advanced options:

```typescript
interface GeneratorOptions {
  input: string
  output: string

  // Type generation options
  exportType?: boolean
  alphabetize?: boolean
  immutable?: boolean
  additionalProperties?: boolean
  defaultNonNullable?: boolean
  pathParamsAsTypes?: boolean
  supportArrayLength?: boolean

  // Documentation options
  includeDescriptions?: boolean
  includeExamples?: boolean

  // Header options
  header?: boolean
  headerComment?: string

  // Output options
  silent?: boolean

  // Advanced options
  transform?: (schema: SchemaObject) => SchemaObject
  postTransform?: (typescript: string) => string
  inject?: string
}
```

## Advanced Usage

### Custom Transformations

Transform schemas before type generation:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  transform: (schema) => {
    // Add custom logic to transform schemas
    if (schema.type === 'string' && schema.format === 'date-time') {
      // Convert all date-time strings to Date types
      return { ...schema, type: 'string', tsType: 'Date' }
    }
    return schema
  },
})
```

### Post-Processing Generated Types

Modify the generated TypeScript code:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  postTransform: (typescript) => {
    // Add custom imports or modify generated code
    return `import type { CustomType } from './custom'\n\n${typescript}`
  },
})
```

### Inject Custom Types

Add custom type definitions at the beginning of the file:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  inject: `
// Custom utility types
type Nullable<T> = T | null
type Optional<T> = T | undefined
`,
})
```

### Custom Header

Replace the default header comment:

```typescript
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

## Examples

### Generate Immutable Types with Descriptions

```bash
open-api ./openapi.json \
  --output ./api-types.ts \
  --immutable \
  --include-descriptions \
  --include-examples
```

Output:

```typescript
export interface User {
  /** The unique identifier for the user */
  readonly "id": string
  /**
   * The user's full name
   * @example "John Doe"
   */
  readonly "name": string
  /** The user's email address */
  readonly "email"?: string
}
```

### Generate Alphabetized Types

```bash
open-api ./openapi.json --output ./api-types.ts --alphabetize
```

### Programmatic Generation with All Options

```typescript
import { generateTypes } from 'ts-open-api'

await generateTypes({
  input: './openapi.json',
  output: './api-types.ts',
  alphabetize: true,
  immutable: true,
  includeDescriptions: true,
  includeExamples: true,
  exportType: true,
  transform: (schema) => {
    // Custom transformations
    return schema
  },
  postTransform: (ts) => {
    // Post-process generated TypeScript
    return ts
  },
})
```

## Integration with Build Tools

### Package.json Scripts

```json
{
  "scripts": {
    "generate-types": "open-api ./openapi.json --output ./src/api-types.ts",
    "generate:watch": "open-api ./openapi.json --output ./src/api-types.ts --watch",
    "prebuild": "bun run generate-types"
  }
}
```

### With Bun

```typescript
// build.ts
import { generateTypes } from 'ts-open-api'

// Generate types before building
await generateTypes({
  input: './api/openapi.json',
  output: './src/generated/api-types.ts',
  alphabetize: true,
})

// Continue with your build process
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
})
```

## Comparison with openapi-typescript

| Feature | ts-open-api | openapi-typescript |
|---------|-------------|-------------------|
| Runtime | Bun (faster) | Node.js |
| Dependencies | Zero for generation | Several |
| OpenAPI 3.0 | ✅ | ✅ |
| OpenAPI 3.1 | ✅ | ✅ |
| Transform API | ✅ | ✅ |
| JSDoc Support | ✅ | ✅ |
| Immutable Types | ✅ | ✅ |
| Alphabetization | ✅ | ❌ |
| Path Params | ✅ | ✅ |
| Native Code | ✅ | ❌ |
| Type Safety | ✅ | ✅ |

## Testing

```bash
bun test
```

The project includes comprehensive tests covering:
- Basic schema types (string, number, boolean, array)
- Object types with properties
- Nested objects
- Enum types
- Nullable types
- Composition types (allOf, anyOf, oneOf)
- Reference resolution
- Path operations
- Parameters and request bodies

## TypeScript Configuration

For best results, use these TypeScript settings:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noUncheckedIndexedAccess": true,
    "strict": true
  }
}
```

## Changelog

Please see our [releases](https://github.com/stacksjs/ts-open-api/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-open-api/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-open-api?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-open-api
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-open-api/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-open-api/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-open-api/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-open-api -->

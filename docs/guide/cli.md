# CLI Usage

Learn how to use the ts-open-api command line interface.

## Basic Usage

```bash
# Generate types from local file
open-api ./openapi.json --output ./api-types.ts

# Generate from remote URL
open-api https://api.example.com/openapi.json --output ./api-types.ts
```

## Command Syntax

```bash
open-api <input> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<input>` | Path to OpenAPI schema (local or URL) |

## Options

### Output Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output file path | `./api-types.ts` |
| `-o <path>` | Short form of --output | `./api-types.ts` |
| `--silent` | Suppress console output | `false` |

### Type Generation Options

| Option | Description | Default |
|--------|-------------|---------|
| `--alphabetize` | Sort types alphabetically | `false` |
| `--immutable` | Generate readonly properties | `false` |
| `--export-type` | Use `export type` instead of `export interface` | `false` |
| `--default-non-nullable` | Treat schemas as non-nullable by default | `false` |
| `--additional-properties` | Allow arbitrary properties via index signature | `false` |
| `--path-params-as-types` | Generate path params as string literal types | `false` |
| `--support-array-length` | Support array length validation in types | `false` |

### Documentation Options

| Option | Description | Default |
|--------|-------------|---------|
| `--include-descriptions` | Include descriptions as JSDoc comments | `false` |
| `--include-examples` | Include examples in JSDoc comments | `false` |
| `--no-header` | Disable header comment | `false` |

## Examples

### Basic Generation

```bash
# Simple generation
open-api ./openapi.json --output ./types.ts

# With alphabetization
open-api ./openapi.json --output ./types.ts --alphabetize
```

### Immutable Types with Documentation

```bash
open-api ./openapi.json \
  --output ./types.ts \
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
}
```

### Remote Schema

```bash
# From HTTPS URL
open-api https://api.example.com/openapi.json --output ./types.ts

# With options
open-api https://petstore.swagger.io/v2/swagger.json \
  --output ./petstore-types.ts \
  --alphabetize \
  --immutable
```

### Silent Mode

```bash
# No console output (useful for CI/CD)
open-api ./openapi.json --output ./types.ts --silent
```

### Export Type Mode

```bash
# Use 'type' instead of 'interface'
open-api ./openapi.json --output ./types.ts --export-type
```

Output:

```typescript
export type User = {
  "id": string
  "name": string
}
```

## Integration with Build Tools

### package.json Scripts

```json
{
  "scripts": {
    "generate-types": "open-api ./openapi.json --output ./src/api-types.ts",
    "generate:watch": "nodemon --watch openapi.json --exec 'bun run generate-types'",
    "prebuild": "bun run generate-types",
    "pretest": "bun run generate-types"
  }
}
```

### Pre-commit Hook

Using Husky:

```bash
# .husky/pre-commit
#!/bin/sh
bun run generate-types
git add src/api-types.ts
```

### CI/CD Pipeline

GitHub Actions example:

```yaml
name: Generate Types

on:
  push:
    paths:
      - 'openapi.json'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - run: bun install

      - name: Generate Types
        run: bun run generate-types

      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: update API types"
          file_pattern: src/api-types.ts
```

## Combining with Other Tools

### With TypeScript Compiler

```bash
# Generate types, then type-check
open-api ./openapi.json --output ./src/types/api.ts && tsc --noEmit
```

### With Prettier

```bash
# Generate and format
open-api ./openapi.json --output ./src/types/api.ts && prettier --write src/types/api.ts
```

### With ESLint

```bash
# Generate and lint
open-api ./openapi.json --output ./src/types/api.ts && eslint src/types/api.ts --fix
```

## Troubleshooting

### Invalid Schema

```bash
# Error: Invalid OpenAPI schema
# Solution: Validate your schema first
npx @redocly/cli lint openapi.json
```

### Network Errors

```bash
# Error: Failed to fetch from URL
# Solution: Check URL accessibility
curl -I https://api.example.com/openapi.json
```

### Permission Errors

```bash
# Error: Permission denied
# Solution: Check file permissions
chmod 755 ./node_modules/.bin/open-api
```

### Large Schemas

For very large schemas:

```bash
# Increase Node.js memory if needed
NODE_OPTIONS="--max-old-space-size=4096" open-api ./large-schema.json --output ./types.ts
```

## Help

```bash
# Show help
open-api --help

# Show version
open-api --version
```

## Next Steps

- Learn about [type generation options](./generation.md)
- See the [API reference](/api/reference)

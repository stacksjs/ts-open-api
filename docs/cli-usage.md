---
title: CLI Usage
description: Command-line interface reference for ts-open-api.
---

# CLI Usage

ts-open-api provides a command-line interface for generating TypeScript types from OpenAPI schemas.

## Basic Usage

```bash
# Generate types from a local file
open-api ./openapi.json --output ./api-types.ts

# Generate from a remote URL
open-api https://api.example.com/openapi.json --output ./api-types.ts
```

## Command Options

### Input/Output

| Option | Description | Default |
|--------|-------------|---------|
| `<input>` | Path or URL to OpenAPI schema | Required |
| `--output <path>` | Output file path | `./api-types.ts` |

### Type Generation

| Option | Description | Default |
|--------|-------------|---------|
| `--alphabetize` | Sort types alphabetically | `false` |
| `--immutable` | Generate readonly properties | `false` |
| `--export-type` | Use `export type` instead of `export interface` | `false` |
| `--default-non-nullable` | Treat schema objects as non-nullable by default | `false` |
| `--additional-properties` | Allow arbitrary properties via index signature | `false` |
| `--path-params-as-types` | Generate path params as string literal types | `false` |
| `--support-array-length` | Support array length validation in types | `false` |

### Documentation

| Option | Description | Default |
|--------|-------------|---------|
| `--include-descriptions` | Include descriptions as JSDoc comments | `false` |
| `--include-examples` | Include examples in JSDoc comments | `false` |
| `--no-header` | Disable header comment | `false` |

### Output Control

| Option | Description | Default |
|--------|-------------|---------|
| `--silent` | Suppress console output | `false` |

## Examples

### Basic Generation

```bash
# Simple generation
open-api ./openapi.json --output ./api-types.ts

# From remote URL
open-api https://petstore.swagger.io/v2/swagger.json --output ./petstore.ts
```

### With Formatting Options

```bash
# Alphabetized and immutable
open-api ./openapi.json \
  --output ./api-types.ts \
  --alphabetize \
  --immutable
```

### With Documentation

```bash
# Include all documentation
open-api ./openapi.json \
  --output ./api-types.ts \
  --include-descriptions \
  --include-examples
```

### Complete Example

```bash
open-api ./openapi.json \
  --output ./src/generated/api-types.ts \
  --alphabetize \
  --immutable \
  --include-descriptions \
  --include-examples \
  --export-type
```

## Package.json Integration

Add scripts to your package.json:

```json
{
  "scripts": {
    "generate-types": "open-api ./openapi.json --output ./src/api-types.ts",
    "generate:watch": "nodemon --watch openapi.json --exec 'bun run generate-types'",
    "prebuild": "bun run generate-types"
  }
}
```

## CI/CD Integration

### GitHub Actions

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

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1

      - name: Install ts-open-api
        run: bun add -D ts-open-api

      - name: Generate Types
        run: |
          bunx open-api ./openapi.json \
            --output ./src/generated/api-types.ts \
            --alphabetize \
            --include-descriptions

      - name: Check for changes
        run: |
          if [[ -n $(git status --porcelain) ]]; then
            git config user.name "github-actions"
            git config user.email "github-actions@github.com"
            git add .
            git commit -m "chore: regenerate API types"
            git push
          fi
```

### Pre-commit Hook

Using bun-git-hooks:

```json
{
  "git-hooks": {
    "pre-commit": {
      "staged-lint": {
        "openapi.json": "bunx open-api openapi.json --output src/api-types.ts && git add src/api-types.ts"
      }
    }
  }
}
```

## Watch Mode

Watch for schema changes and regenerate:

```bash
# Using nodemon
nodemon --watch openapi.json --exec "bunx open-api ./openapi.json --output ./api-types.ts"

# Using chokidar-cli
chokidar "openapi.json" -c "bunx open-api ./openapi.json --output ./api-types.ts"
```

## Multiple Schemas

Generate types from multiple schemas:

```bash
#!/bin/bash
# generate-all-types.sh

# Main API
open-api ./api/openapi.json \
  --output ./src/types/api.ts \
  --alphabetize

# Admin API
open-api ./api/admin-openapi.json \
  --output ./src/types/admin-api.ts \
  --alphabetize

# Public API
open-api ./api/public-openapi.json \
  --output ./src/types/public-api.ts \
  --alphabetize

echo "All types generated successfully"
```

## Validation

The CLI validates the input schema before generation:

```bash
# Will fail with error if schema is invalid
open-api ./invalid-schema.json --output ./types.ts
# Error: Invalid OpenAPI schema: missing required field 'info'
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3` | File not found |
| `4` | Invalid schema |
| `5` | Write error |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAPI_DEBUG` | Enable debug output |
| `OPENAPI_SILENT` | Suppress all output |

## Tips

### 1. Use .gitignore

Add generated files to your build pipeline, but consider ignoring in git:

```gitignore
# If regenerated on build
src/generated/api-types.ts
```

Or track the generated file if you want visibility:

```gitignore
# Track generated types
!src/generated/api-types.ts
```

### 2. Add Type Checking

Verify generated types compile:

```json
{
  "scripts": {
    "generate-types": "open-api ./openapi.json --output ./src/api-types.ts",
    "typecheck": "tsc --noEmit",
    "validate": "bun run generate-types && bun run typecheck"
  }
}
```

### 3. Document Your Workflow

```markdown
## API Types

Types are generated from `openapi.json`:

\`\`\`bash
bun run generate-types
\`\`\`

Regenerate after any schema changes.
```

## Next Steps

- [Configuration](/config) - Complete options reference
- [Type Generation](/type-generation) - Customization options
- [Schema Parsing](/schema-parsing) - Schema format details

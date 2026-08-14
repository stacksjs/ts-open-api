# Type Generation

Learn about the type generation options and customization available in ts-open-api.

## Schema Support

### OpenAPI 3.0 & 3.1

ts-open-api supports both OpenAPI 3.0 and 3.1 specifications:

```typescript
// Both are supported
await generateTypes({ input: './openapi-3.0.json', output: './types.ts' })
await generateTypes({ input: './openapi-3.1.json', output: './types.ts' })
```

### Component Schemas

All schemas defined in `components/schemas` are generated:

```json
{
  "components": {
    "schemas": {
      "User": { ... },
      "Post": { ... },
      "Comment": { ... }
    }
  }
}
```

```typescript
export interface User { ... }
export interface Post { ... }
export interface Comment { ... }
```

### Path Operations

Path operations generate typed interfaces:

```json
{
  "paths": {
    "/users": {
      "get": {
        "parameters": [...],
        "responses": { "200": { ... } }
      }
    }
  }
}
```

```typescript
export interface paths {
  "/users": {
    get: {
      parameters?: { ... }
      responses: { 200: { ... } }
    }
  }
}
```

## Type Mapping

### Primitive Types

| OpenAPI Type | TypeScript Type |
|--------------|-----------------|
| `string` | `string` |
| `number` | `number` |
| `integer` | `number` |
| `boolean` | `boolean` |
| `null` | `null` |

### String Formats

String formats are currently all mapped to `string`:

```json
{
  "type": "string",
  "format": "date-time"  // Still generates 'string'
}
```

Use the `transform` option to customize:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  transform: (schema) => {
    if (schema.type === 'string' && schema.format === 'date-time') {
      return { ...schema, tsType: 'Date' }
    }
    return schema
  }
})
```

### Arrays

```json
{
  "type": "array",
  "items": { "type": "string" }
}
```

```typescript
string[]
```

### Objects

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  }
}
```

```typescript
{
  "name"?: string
}
```

## Required Properties

Properties listed in `required` are non-optional:

```json
{
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "email": { "type": "string" }
  }
}
```

```typescript
{
  "id": string
  "name": string
  "email"?: string
}
```

## Nullable Types

```json
{
  "type": "string",
  "nullable": true
}
```

```typescript
string | null
```

## Reference Resolution

References are resolved to type names:

```json
{
  "type": "object",
  "properties": {
    "author": { "$ref": "#/components/schemas/User" }
  }
}
```

```typescript
{
  "author"?: User
}
```

## Composition

### allOf (Intersection)

```json
{
  "allOf": [
    { "$ref": "#/components/schemas/Base" },
    { "type": "object", "properties": { "extra": { "type": "string" } } }
  ]
}
```

```typescript
(Base & {
  "extra"?: string
})
```

### oneOf (Union)

```json
{
  "oneOf": [
    { "$ref": "#/components/schemas/Cat" },
    { "$ref": "#/components/schemas/Dog" }
  ]
}
```

```typescript
(Cat | Dog)
```

### anyOf (Union)

```json
{
  "anyOf": [
    { "type": "string" },
    { "type": "number" }
  ]
}
```

```typescript
(string | number)
```

## JSDoc Generation

### Descriptions

With `includeDescriptions: true`:

```json
{
  "User": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "The user's full name"
      }
    }
  }
}
```

```typescript
export interface User {
  /** The user's full name */
  "name"?: string
}
```

### Examples

With `includeExamples: true`:

```json
{
  "email": {
    "type": "string",
    "description": "User email address",
    "example": "john@example.com"
  }
}
```

```typescript
/**
 * User email address
 * @example "john@example.com"
 */
"email"?: string
```

### Deprecation

```json
{
  "oldField": {
    "type": "string",
    "deprecated": true
  }
}
```

```typescript
/** @deprecated */
"oldField"?: string
```

## Custom Transformations

### Pre-Transform

Modify schemas before type generation:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  transform: (schema) => {
    // Convert all date-time to Date type
    if (schema.type === 'string' && schema.format === 'date-time') {
      return { ...schema, type: 'Date' }
    }

    // Add custom property
    if (schema.type === 'object') {
      return {
        ...schema,
        properties: {
          ...schema.properties,
          _metadata: { type: 'object' }
        }
      }
    }

    return schema
  }
})
```

### Post-Transform

Modify generated TypeScript:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  postTransform: (typescript) => {
    // Add custom imports
    return `import type { CustomType } from './custom'\n\n${typescript}`
  }
})
```

### Inject Custom Types

Add custom type definitions:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  inject: `
// Custom utility types
type Nullable<T> = T | null
type Optional<T> = T | undefined
type ID = string | number
`
})
```

## Custom Headers

Replace the default header:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  headerComment: `/**
 * API Types
 * Generated on ${new Date().toISOString()}
 * DO NOT EDIT MANUALLY
 */`
})
```

Disable header:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  header: false
})
```

## Alphabetization

Sort types alphabetically:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  alphabetize: true
})
```

## Immutable Types

Generate readonly properties:

```typescript
await generateTypes({
  input: './openapi.json',
  output: './types.ts',
  immutable: true
})
```

Output:

```typescript
export interface User {
  readonly "id": string
  readonly "name": string
}
```

## Next Steps

- Learn about [CLI usage](./cli.md)
- See the [API reference](/api/reference)

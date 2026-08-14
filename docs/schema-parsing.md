---
title: Schema Parsing
description: Learn how ts-open-api parses OpenAPI schemas and handles different schema types.
---

# Schema Parsing

ts-open-api provides comprehensive parsing for OpenAPI 3.0 and 3.1 schemas, converting them to TypeScript types with full fidelity.

## Supported Schema Versions

- OpenAPI 3.0.x
- OpenAPI 3.1.x

## Schema Types

### Primitive Types

ts-open-api handles all OpenAPI primitive types:

```yaml
# OpenAPI Schema
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        age:
          type: integer
        score:
          type: number
        isActive:
          type: boolean
```

Generated TypeScript:

```ts
export interface User {
  "id"?: string
  "age"?: number
  "score"?: number
  "isActive"?: boolean
}
```

### Array Types

Arrays are fully supported with item type inference:

```yaml
components:
  schemas:
    UserList:
      type: array
      items:
        $ref: '#/components/schemas/User'

    Tags:
      type: array
      items:
        type: string
```

Generated TypeScript:

```ts
export type UserList = User[]

export type Tags = string[]
```

### Object Types

Objects with required properties:

```yaml
components:
  schemas:
    CreateUserRequest:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
        name:
          type: string
        age:
          type: integer
```

Generated TypeScript:

```ts
export interface CreateUserRequest {
  "email": string
  "name": string
  "age"?: number
}
```

### Enum Types

Enums are converted to union types:

```yaml
components:
  schemas:
    Status:
      type: string
      enum:
        - pending
        - active
        - suspended

    Priority:
      type: integer
      enum:
        - 1
        - 2
        - 3
```

Generated TypeScript:

```ts
export type Status = "pending" | "active" | "suspended"

export type Priority = 1 | 2 | 3
```

### Nullable Types

Nullable properties include `null` in the type union:

```yaml
components:
  schemas:
    Profile:
      type: object
      properties:
        bio:
          type: string
          nullable: true
        avatar:
          type: string
          nullable: true
```

Generated TypeScript:

```ts
export interface Profile {
  "bio"?: string | null
  "avatar"?: string | null
}
```

## Schema Composition

### allOf (Intersection)

Combines multiple schemas:

```yaml
components:
  schemas:
    Person:
      type: object
      properties:
        name:
          type: string

    Employee:
      allOf:
        - $ref: '#/components/schemas/Person'
        - type: object
          properties:
            employeeId:
              type: string
```

Generated TypeScript:

```ts
export interface Person {
  "name"?: string
}

export type Employee = (Person & {
  "employeeId"?: string
})
```

### anyOf (Union)

One or more of the schemas:

```yaml
components:
  schemas:
    Pet:
      anyOf:
        - $ref: '#/components/schemas/Dog'
        - $ref: '#/components/schemas/Cat'
```

Generated TypeScript:

```ts
export type Pet = (Dog | Cat)
```

### oneOf (Discriminated Union)

Exactly one of the schemas:

```yaml
components:
  schemas:
    Response:
      oneOf:
        - $ref: '#/components/schemas/SuccessResponse'
        - $ref: '#/components/schemas/ErrorResponse'
```

Generated TypeScript:

```ts
export type Response = (SuccessResponse | ErrorResponse)
```

## Reference Resolution

### Local References

References to components in the same document:

```yaml
components:
  schemas:
    Order:
      type: object
      properties:
        user:
          $ref: '#/components/schemas/User'
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
```

Generated TypeScript:

```ts
export interface Order {
  "user"?: User
  "items"?: OrderItem[]
}
```

### Nested References

Deeply nested references are resolved:

```yaml
components:
  schemas:
    Department:
      type: object
      properties:
        manager:
          $ref: '#/components/schemas/Employee'
        team:
          type: array
          items:
            $ref: '#/components/schemas/Employee'
```

## Additional Properties

### Allow Any Additional Properties

```yaml
components:
  schemas:
    Metadata:
      type: object
      additionalProperties: true
```

Generated TypeScript:

```ts
export interface Metadata {
  [key: string]: any
}
```

### Typed Additional Properties

```yaml
components:
  schemas:
    StringMap:
      type: object
      additionalProperties:
        type: string
```

Generated TypeScript:

```ts
export interface StringMap {
  [key: string]: string
}
```

### No Additional Properties

```yaml
components:
  schemas:
    StrictObject:
      type: object
      additionalProperties: false
      properties:
        id:
          type: string
```

Generated TypeScript:

```ts
export interface StrictObject {
  "id"?: string
}
```

## Path Parameters

Path operations are parsed with full type information:

```yaml
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

Generated TypeScript:

```ts
export interface paths {
  "/users/{id}": {
    get: {
      parameters: {
        path: { "id": string }
      }
      responses: {
        200: { status: number; body: User }
      }
    }
  }
}
```

## Request Bodies

```yaml
paths:
  /users:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

Generated TypeScript:

```ts
export interface paths {
  "/users": {
    post: {
      requestBody: CreateUserRequest
      responses: {
        201: { status: number; body: User }
      }
    }
  }
}
```

## Programmatic Parsing

```ts
import { OpenAPITypeScriptGenerator } from 'ts-open-api'
import type { OpenAPISchema } from 'ts-open-api'

// Parse and generate from a schema object
const schema: OpenAPISchema = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0.0' },
  paths: {},
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
}

const generator = new OpenAPITypeScriptGenerator(schema, {
  input: '',
  output: '',
})

const typescript = generator.generate()
console.log(typescript)
```

## Next Steps

- [Type Generation](/type-generation) - Customize type output
- [Configuration](/config) - Generator options
- [CLI Usage](/cli-usage) - Command-line interface

/**
 * OpenAPI TypeScript Generator Types
 */

export interface OpenAPIConfig {
  verbose: boolean
}

export type OpenAPIOptions = Partial<OpenAPIConfig>

export interface OpenAPISchema {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  servers?: Array<{
    url: string
    description?: string
  }>
  paths: Record<string, PathItem>
  components?: {
    schemas?: Record<string, SchemaObject>
    responses?: Record<string, ResponseObject>
    parameters?: Record<string, ParameterObject>
    requestBodies?: Record<string, RequestBodyObject>
    securitySchemes?: Record<string, SecuritySchemeObject>
  }
  security?: SecurityRequirementObject[]
  tags?: TagObject[]
}

export interface PathItem {
  get?: OperationObject
  post?: OperationObject
  put?: OperationObject
  delete?: OperationObject
  patch?: OperationObject
  options?: OperationObject
  head?: OperationObject
  trace?: OperationObject
  parameters?: ParameterObject[]
}

export interface OperationObject {
  operationId?: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: ParameterObject[]
  requestBody?: RequestBodyObject | ReferenceObject
  responses: Record<string, ResponseObject | ReferenceObject>
  deprecated?: boolean
  security?: SecurityRequirementObject[]
}

export interface ParameterObject {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  description?: string
  required?: boolean
  deprecated?: boolean
  schema?: SchemaObject | ReferenceObject
  example?: any
}

export interface RequestBodyObject {
  description?: string
  content: Record<string, MediaTypeObject>
  required?: boolean
}

export interface ResponseObject {
  description: string
  content?: Record<string, MediaTypeObject>
  headers?: Record<string, HeaderObject | ReferenceObject>
}

export interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject
  example?: any
  examples?: Record<string, ExampleObject | ReferenceObject>
}

export interface SchemaObject {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'
  format?: string
  title?: string
  description?: string
  default?: any
  enum?: any[]
  const?: any

  // Number validations
  minimum?: number
  maximum?: number
  exclusiveMinimum?: boolean | number
  exclusiveMaximum?: boolean | number
  multipleOf?: number

  // String validations
  minLength?: number
  maxLength?: number
  pattern?: string

  // Array validations
  items?: SchemaObject | ReferenceObject
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean

  // Object validations
  properties?: Record<string, SchemaObject | ReferenceObject>
  required?: string[]
  additionalProperties?: boolean | SchemaObject | ReferenceObject
  minProperties?: number
  maxProperties?: number

  // Composition
  allOf?: (SchemaObject | ReferenceObject)[]
  oneOf?: (SchemaObject | ReferenceObject)[]
  anyOf?: (SchemaObject | ReferenceObject)[]
  not?: SchemaObject | ReferenceObject

  // Other
  nullable?: boolean
  readOnly?: boolean
  writeOnly?: boolean
  deprecated?: boolean
  example?: any
}

export interface ReferenceObject {
  $ref: string
}

export interface HeaderObject {
  description?: string
  required?: boolean
  deprecated?: boolean
  schema?: SchemaObject | ReferenceObject
}

export interface ExampleObject {
  summary?: string
  description?: string
  value?: any
}

export interface SecuritySchemeObject {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  description?: string
  name?: string
  in?: 'query' | 'header' | 'cookie'
  scheme?: string
  bearerFormat?: string
}

export interface SecurityRequirementObject {
  [name: string]: string[]
}

export interface TagObject {
  name: string
  description?: string
}

export interface GeneratorOptions {
  input: string
  output: string
  exportType?: boolean
  alphabetize?: boolean
  immutable?: boolean
  additionalProperties?: boolean
  defaultNonNullable?: boolean
  pathParamsAsTypes?: boolean
  supportArrayLength?: boolean
  silent?: boolean
}

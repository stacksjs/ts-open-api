import { describe, expect, test } from 'bun:test'
import { OpenAPITypeScriptGenerator } from '../src/generator'
import type { OpenAPISchema } from '../src/types'

describe('OpenAPI TypeScript Generator', () => {
  describe('Basic Schema Types', () => {
    test('generates string type', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            StringType: {
              type: 'string',
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type StringType')
      expect(result).toContain('string')
    })

    test('generates number type', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            NumberType: {
              type: 'number',
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type NumberType')
      expect(result).toContain('number')
    })

    test('generates boolean type', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            BoolType: {
              type: 'boolean',
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type BoolType')
      expect(result).toContain('boolean')
    })

    test('generates array type', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            ArrayType: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type ArrayType')
      expect(result).toContain('string[]')
    })
  })

  describe('Object Types', () => {
    test('generates object with properties', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
              required: ['id', 'name'],
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export interface User')
      expect(result).toContain('"id": number')
      expect(result).toContain('"name": string')
      expect(result).toContain('"email"?: string')
    })

    test('generates nested objects', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Profile: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export interface Profile')
      expect(result).toContain('"name"?: string')
      expect(result).toContain('"age"?: number')
    })
  })

  describe('Enum Types', () => {
    test('generates string enum', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type Status')
      expect(result).toContain('"active"')
      expect(result).toContain('"inactive"')
      expect(result).toContain('"pending"')
    })
  })

  describe('Nullable Types', () => {
    test('generates nullable types', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            NullableString: {
              type: 'string',
              nullable: true,
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('string | null')
    })
  })

  describe('Composition Types', () => {
    test('generates allOf composition', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Base: {
              type: 'object',
              properties: {
                id: { type: 'number' },
              },
            },
            Extended: {
              allOf: [
                { $ref: '#/components/schemas/Base' },
                {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                  },
                },
              ],
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type Extended')
      expect(result).toContain('Base')
    })

    test('generates anyOf composition', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            StringOrNumber: {
              anyOf: [
                { type: 'string' },
                { type: 'number' },
              ],
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type StringOrNumber')
      expect(result).toContain('string | number')
    })

    test('generates oneOf composition', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Either: {
              oneOf: [
                { type: 'string' },
                { type: 'boolean' },
              ],
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export type Either')
      expect(result).toContain('string | boolean')
    })
  })

  describe('References', () => {
    test('resolves $ref correctly', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
              },
            },
            UserList: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export interface User')
      expect(result).toContain('export type UserList')
      expect(result).toContain('User[]')
    })
  })

  describe('Paths', () => {
    test('generates path with GET operation', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('export interface paths')
      expect(result).toContain('"/users"')
      expect(result).toContain('get:')
      expect(result).toContain('responses:')
      expect(result).toContain('200:')
    })

    test('generates path parameters', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users/{id}': {
            get: {
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' },
                },
              ],
              responses: {
                '200': {
                  description: 'Success',
                },
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('"/users/{id}"')
      expect(result).toContain('parameters:')
      expect(result).toContain('path:')
      expect(result).toContain('"id": string')
    })

    test('generates query parameters', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/search': {
            get: {
              parameters: [
                {
                  name: 'q',
                  in: 'query',
                  required: false,
                  schema: { type: 'string' },
                },
                {
                  name: 'limit',
                  in: 'query',
                  required: false,
                  schema: { type: 'number' },
                },
              ],
              responses: {
                '200': {
                  description: 'Success',
                },
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('"/search"')
      expect(result).toContain('query?:')
      expect(result).toContain('"q"?: string')
      expect(result).toContain('"limit"?: number')
    })

    test('generates request body', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string' },
                      },
                    },
                  },
                },
              },
              responses: {
                '201': {
                  description: 'Created',
                },
              },
            },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('post:')
      expect(result).toContain('requestBody:')
      expect(result).toContain('"name"?: string')
      expect(result).toContain('"email"?: string')
    })
  })

  describe('Options', () => {
    test('alphabetizes schemas when option is enabled', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Zebra: { type: 'string' },
            Apple: { type: 'string' },
            Banana: { type: 'string' },
          },
        },
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
        alphabetize: true,
      })
      const result = generator.generate()

      const appleIndex = result.indexOf('export type Apple')
      const bananaIndex = result.indexOf('export type Banana')
      const zebraIndex = result.indexOf('export type Zebra')

      expect(appleIndex).toBeLessThan(bananaIndex)
      expect(bananaIndex).toBeLessThan(zebraIndex)
    })
  })

  describe('Header Comments', () => {
    test('includes auto-generated header', () => {
      const schema: OpenAPISchema = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
      }

      const generator = new OpenAPITypeScriptGenerator(schema, {
        input: '',
        output: '',
      })
      const result = generator.generate()

      expect(result).toContain('This file was auto-generated by ts-open-api')
      expect(result).toContain('DO NOT MAKE DIRECT CHANGES TO THE FILE')
    })
  })
})

import type { OpenAPIConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: OpenAPIConfig = {
  verbose: true,
}

// eslint-disable-next-line ts/no-top-level-await
export const config: OpenAPIConfig = await loadConfig({
  name: 'open-api',
  defaultConfig,
})

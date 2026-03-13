# Claude Code Guidelines

## About

ts-open-api is a native OpenAPI to TypeScript type generator built with Bun. It converts OpenAPI 3.0 and 3.1 schemas (local or remote) into zero-runtime TypeScript types, supporting schema composition (allOf/anyOf/oneOf), reference resolution, JSDoc generation, and custom type transformations. The project provides both a CLI (`open-api`) and a programmatic API (`generateTypes`, `OpenAPITypeScriptGenerator`) with extensive configuration options including immutable types, alphabetical sorting, and post-processing hooks.

## Linting

- Use **pickier** for linting — never use eslint directly
- Run `bunx --bun pickier .` to lint, `bunx --bun pickier . --fix` to auto-fix
- When fixing unused variable warnings, prefer `// eslint-disable-next-line` comments over prefixing with `_`

## Frontend

- Use **stx** for templating — never write vanilla JS (`var`, `document.*`, `window.*`) in stx templates
- Use **crosswind** as the default CSS framework which enables standard Tailwind-like utility classes
- stx `<script>` tags should only contain stx-compatible code (signals, composables, directives)

## Dependencies

- **buddy-bot** handles dependency updates — not renovatebot
- **better-dx** provides shared dev tooling as peer dependencies — do not install its peers (e.g., `typescript`, `pickier`, `bun-plugin-dtsx`) separately if `better-dx` is already in `package.json`
- If `better-dx` is in `package.json`, ensure `bunfig.toml` includes `linker = "hoisted"`

## Commits

- Use conventional commit messages (e.g., `fix:`, `feat:`, `chore:`)

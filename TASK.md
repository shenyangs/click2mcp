# A08 — Click2MCP

Build one REAL recorder-to-MCP bridge. Read ./AGENTS.md. Input restricted to a bundled dummy web app at 127.0.0.1. This isn't an arbitrary live browser takeover tool.

## Scope and stack
- React/Vite dashboard, Playwright Chromium controlled browser, official MCP TypeScript SDK v2 (`@modelcontextprotocol/server` and `@modelcontextprotocol/client`), Zod v4. A local fixture website at `fixtures/demo-form` with a task name field, a non-sensitive category selector, Submit, and an onscreen confirmation ID.
- `Start recording` opens managed page. Recorder captures a STRICT event schema: `goto` (allowed origin only), `fill` (only allowlisted dummy text inputs; never passwords), `selectOption`, `click` (stable selector from data-testid), optional wait for confirmation. Do not record secrets, raw page cookies, keypresses, arbitrary JS or cross-origin navigation.
- `Generate MCP` serializes the action list to a safe JSON recipe; one generic MCP tool `submit_demo_task` executes the RECIPE using a new Playwright browser context. Tool appears in SDK listTools and can actually be called via SDK; return confirmation ID from webpage.
- An LLM can optionally propose the tool description, but generation and execution must be deterministic and truthful without a model key. Clearly describe which part is and isn't AI.

## P0 happy path
1. Open recording, enter 'Fix login issue', select 'Engineering', submit. Show 3–4 recorded actions.
2. Click Generate: display validated MCP tool name, argument JSON schema and recipe. No raw shell command generator.
3. Click 'Test tool': local MCP client lists `submit_demo_task`, calls it with one test input, and receives an ACTUAL task receipt from fixture app.

## Must prove
- Unit tests reject unapproved origins, password fills, dangerous selector strings, and unexpected action types.
- MCP integration test `listTools` includes tool, `callTool` submits form and returns receipt.
- E2E demonstrates real recorded event count and actual returned confirmation; video/screenshot.
- README scopes to one local site and one generated tool; don't claim general browser actions on the web.

## X hook
'I clicked through a workflow once. It became an actual MCP tool.' Show recording → JSON recipe → tool invocation → returned confirmation ID.


Execute within this directory only. Run npm install, implement, then build/test/e2e/demo. Preserve real logs and status.json.

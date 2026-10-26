import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','install','chromium','ffmpeg'],{stdio:'inherit',env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:resolve('.cache/ms-playwright')}});
process.exit(result.status ?? 1);

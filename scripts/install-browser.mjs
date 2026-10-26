import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { browserPath } from './browser-path.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.cache/ms-playwright');
let chromium;
try { ({chromium} = await import('@playwright/test')); }
catch { console.error('缺少 Playwright 依赖。请先运行 npm ci --cache .cache/npm，或 npm run setup。'); process.exit(1); }
const available = existsSync(browserPath(chromium.executablePath()));
console.log(available ? '发现可复用 Chromium，跳过大体积浏览器下载；检查录屏编码器。' : '将 Chromium 和录屏编码器安装到项目浏览器缓存，不安装系统组件。');
const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','install',...(available?[]:['chromium']),'ffmpeg'],{stdio:'inherit',env:process.env});
if(result.status!==0) console.error('浏览器准备失败，请检查网络后重试 npm run browser:install。');
process.exit(result.status ?? 1);

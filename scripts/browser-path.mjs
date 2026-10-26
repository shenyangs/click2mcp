import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
export function browserPath(defaultPath) {
  if (existsSync(defaultPath)) return defaultPath;
  const cached = resolve(homedir(), 'Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
  if (process.platform === 'darwin' && existsSync(cached)) return cached;
  return defaultPath;
}

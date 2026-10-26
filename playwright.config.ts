import { defineConfig, devices } from '@playwright/test';
import { browserOptions } from './server/core';
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || `${process.cwd()}/.cache/ms-playwright`;
export default defineConfig({
  expect: {timeout:20000},
  testDir: 'tests', testMatch: ['*.spec.ts'], timeout: 45_000, retries: 0, workers: 1,
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4208', viewport: {width: 1440, height: 900}, video: {mode:'on',size:{width:1440,height:900}}, screenshot: 'on', launchOptions: browserOptions() },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:4208', reuseExistingServer: !process.env.CI, timeout: 90_000 },
  outputDir: 'artifacts/playwright', reporter: [['list']],
});

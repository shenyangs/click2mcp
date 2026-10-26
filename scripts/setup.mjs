import { spawnSync } from 'node:child_process';
const [major,minor]=process.versions.node.split('.').map(Number);
if (!((major===22&&minor>=12)||major===24||major>=26)) { console.error('需要 Node.js 22.12+（22 系列）、24.x 或 26+，请升级后重试。'); process.exit(1); }
console.log('准备安装项目锁定依赖和必要浏览器，不修改系统设置。');
const npm = process.env.npm_execpath;
if (!npm) { console.error('请通过 npm run setup 运行本脚本。'); process.exit(1); }
for (const args of [[npm, 'ci', '--cache', '.cache/npm'], ['scripts/install-browser.mjs']]) {
 const result = spawnSync(process.execPath, args, {stdio:'inherit'});
 if (result.status !== 0) { console.error('安装未完成：请检查网络和上方错误，修复后重新运行 npm run setup。'); process.exit(result.status || 1); }
}
console.log('准备完成。运行 npm run doctor 检查环境，再运行 npm run dev。访问 http://127.0.0.1:4208');

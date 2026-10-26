import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'node:net';
import { browserPath } from './browser-path.mjs';
let failed=false;
function report(ok,message){console.log(`${ok?'通过':'未通过'}：${message}`);if(!ok)failed=true;}
const [major,minor]=process.versions.node.split('.').map(Number);
report((major===22&&minor>=12)||major===24||major>=26,`Node.js ${process.versions.node}（要求 22.12+ 的 22 系列、24.x 或 26+）`);
const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
const missing=Object.keys({...pkg.dependencies,...pkg.devDependencies}).filter(name=>!existsSync(resolve('node_modules',name,'package.json')));
report(!missing.length,missing.length?`缺少项目依赖：${missing.join('、')}。请运行 npm run setup。`:'项目依赖齐全');
if(!missing.length){
 process.env.PLAYWRIGHT_BROWSERS_PATH ||= resolve('.cache/ms-playwright');
 try{
  const {chromium}=await import('@playwright/test');const executablePath=browserPath(chromium.executablePath());
  report(existsSync(executablePath),'Chromium 可执行文件'+(existsSync(executablePath)?'已找到':'缺失，请运行 npm run browser:install'));
  if(existsSync(executablePath)){let browser;try{browser=await chromium.launch({executablePath,headless:true,timeout:15000});report(true,'Chromium 实际启动成功');}catch{report(false,'Chromium 无法启动，请检查操作系统所需库；本工具不会自动修改系统。');}finally{await browser?.close();}}
  const cache=process.env.PLAYWRIGHT_BROWSERS_PATH;const ff=existsSync(cache)&&readdirSync(cache).some(n=>n.startsWith('ffmpeg-')&&existsSync(resolve(cache,n,process.platform==='win32'?'ffmpeg-win64.exe':process.platform==='darwin'?'ffmpeg-mac':'ffmpeg-linux')));
  report(ff,'录屏编码器'+(ff?'已找到':'缺失，请运行 npm run browser:install'));
 }catch{report(false,'浏览器检查失败，请运行 npm run setup 修复依赖。');}
}
for(const port of [4208,5208])await new Promise(done=>{const server=createServer();server.once('error',()=>{report(false,`127.0.0.1:${port} 已占用或不可用。若本项目已启动请先停止；其他程序请自行关闭，勿更改固定端口。`);done();});server.listen(port,'127.0.0.1',()=>server.close(()=>{report(true,`127.0.0.1:${port} 可用`);done();}));});
console.log('无需 API Key；默认使用本地示例站点，真实浏览器执行，无模型推理。');
console.log(failed?'请按诊断修复后重试 npm run doctor。':'环境就绪：npm run dev → http://127.0.0.1:4208');
process.exitCode=failed?1:0;

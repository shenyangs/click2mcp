# Click2MCP · 把页面操作变成 MCP 工具

「我点击完成了一次流程，它就变成了真正的 MCP 工具。」

Click2MCP 是一个中文默认的本地演示项目：在受控浏览器中录制示例表单操作，生成经过严格校验的 JSON 配方，再通过官方 MCP SDK 发现、调用工具，获得实际页面提交产生的回执。

**零 API Key 即可运行。示例站点是内置 fixture，浏览器执行和 MCP 调用是真实的；配方生成是确定性逻辑，没有模型推理。** 不连接外部业务网站，不读取用户凭据。

## 环境与首次启动

需要 Node.js **22.12+（22 系列）、24.x 或 26+**、随 Node 安装的 npm，以及首次安装依赖/浏览器时的网络连接。项目锁文件固定本次验证版本，请使用 `npm ci`，不要删除锁文件后任意升级。本次实际验证环境为 macOS、Node.js 26.4.0；版本范围依据锁定的 Vite / Vitest 要求，23.x、25.x 不在支持范围。

在本仓库根目录执行（macOS 终端、Linux shell、Windows PowerShell 命令相同）：

```sh
npm run setup
npm run doctor
npm run dev
```

`setup` 是不依赖已安装第三方包的 Node 脚本，依次执行 `npm ci --cache .cache/npm` 和浏览器准备脚本；只写入本项目依赖及缓存，不安装系统库、不修改机器设置。已有可用 Chromium 会复用，避免重复大体积下载。

也可手动执行完全等价的步骤：

```sh
npm ci --cache .cache/npm
npm run browser:install
npm run doctor
npm run dev
```

启动终端会输出中文入口。打开 **http://127.0.0.1:4208**；API 地址为 **http://127.0.0.1:5208**，健康检查为 http://127.0.0.1:5208/api/health。请使用这个精确地址，不用 `localhost` 替换：安全白名单固定为 `127.0.0.1`。两端都只监听本机回环地址，手机或其他电脑不能直接访问。

- `node_modules`、npm 缓存 `.cache/npm`、浏览器缓存 `.cache/ms-playwright` 都位于本项目，Git 会忽略它们。
- `browser:install` 只安装必要的 Chromium 和 FFmpeg；目前可只读复用 macOS 已有的兼容 Chromium 缓存。其他环境从项目缓存使用浏览器，无须父目录或兄弟项目文件。
- Linux 可能还需要 Chromium 的操作系统库。本脚本不会运行系统级安装或更改设置；如启动失败，请按 Playwright 输出由机器管理员补齐。
- 无须复制 `.env.example`，没有模型 Key 配置项，也不自动加载 `.env`。
- 关闭终端中的服务可按 `Ctrl+C`。

## 三步体验

1. 点击 **开始录制**，保留「修复登录问题」与「工程」，点击 **录制表单提交**。看见四个实际捕获的事件；展开「查看受控浏览器的真实截图」可查看第一次提交的页面回执。
2. 点击 **生成 MCP**，查看 `submit_demo_task`、参数 JSON Schema 及四步配方。
3. 点击 **测试工具**。SDK 先执行 `listTools`，再通过 `callTool` 在新 Chromium 上下文重放操作；结果区显示新回执、任务、分类与执行方式。

可以修改任务名称作为后续工具调用参数；分类来自已录制配方。需要重新录制时点击 **开始录制**。界面支持键盘 Tab 焦点、Enter 激活按钮、小屏纵向布局；进行中会禁用相关操作并播报中文状态，错误会显示恢复提示。

## 依赖与作用

下列为锁文件中的本次验证版本；所有直接及传递依赖以 `package-lock.json` 为准。

| 依赖 | 锁定版本 | 作用 |
| --- | --- | --- |
| React / React DOM | 19.3.1 | 中文操作台与状态显示 |
| Vite | 8.3.5 | 开发服务器、API 代理、前端构建 |
| Express | 5.3.0 | 本机 API、示例表单与回执接口 |
| Playwright (`@playwright/test`) | 1.64.1 | 受控 Chromium、录制/重放、端到端测试、截图录屏 |
| MCP server / client | 2.4.0 | 官方 SDK 的工具注册、发现、stdio 调用 |
| Zod | 4.6.7 | 动作、输入与配方白名单校验 |
| TypeScript | 7.0.2 | 类型检查 |
| Vitest | 5.0.5 | 安全规则单元测试 |
| tsx | 4.23.15 | 执行后端 TypeScript 与 MCP 子进程 |
| concurrently | 10.0.6 | 同时启动网页和 API |
| lucide-react | 1.61.0 | 界面图标 |

`@vitejs/plugin-react` 提供 React 构建支持，`@types/*` 提供 Node、React、Express 类型。Chromium 是实际执行页面的浏览器，FFmpeg 是 Playwright 录屏编码器。开发依赖也用于本地运行和测试，请不要使用 `npm ci --omit=dev`。

## 检查与失败恢复

```sh
npm run doctor
npm run build
npm run test
npm run e2e
npm run demo
```

`doctor` 使用 Node 内置模块先检查版本及缺失依赖；依赖齐全后检查浏览器文件、实际启动 Chromium、录屏编码器和固定端口。通过返回 0，需处理的问题返回 1；不检查无关 Key。端口检查需要临时绑定回环端口，服务已启动时报告占用属于正常现象，请先停止服务再诊断。

| 问题 | 处理方式 |
| --- | --- |
| 找不到 npm / Node 版本不足 | 安装受支持的 Node.js 版本（见环境要求），重新打开终端后执行 `node --version` |
| 缺依赖或模块找不到 | 在仓库根目录运行 `npm run setup` |
| 依赖或浏览器下载失败 | 检查网络，重试 `npm run setup`；不必删除缓存 |
| 找不到浏览器或 FFmpeg | 运行 `npm run browser:install`，再运行 doctor |
| 4208 / 5208 被占用 | 先停止已有本项目服务；若是其他程序，请自行关闭占用程序，再启动。不更改固定端口 |
| 页面提示服务连接失败 | 检查 `npm run dev` 终端，运行 doctor；恢复服务后重试 |
| 录制无效、重复提交或调用超时 | 点击「开始录制」重新走完四步；查看终端和 doctor 结果 |
| 旧回执找不到 | 回执仅保存在内存，服务重启后需重新提交 |

通常不需要环境变量。若必须使用已有浏览器缓存，macOS/Linux 可先执行 `export PLAYWRIGHT_BROWSERS_PATH="/已有缓存目录"`；Windows PowerShell 使用 `$env:PLAYWRIGHT_BROWSERS_PATH="C:\已有缓存目录"`。两者均为当前终端设置，不写系统配置。不要在 Windows 使用 Unix 的 `export` 或 `$PWD` 安装命令；上述 npm 脚本已处理路径差异。

## 真实验证与证据

中文版本实际执行结果记录在 `status.json`。本次验证包含 build、9 项安全单测、4 项端到端/集成检查、独立 demo；端到端测试不仅检查显示，还查询回执接口核对实际提交的中文任务和分类。新增小屏、键盘、网络错误反馈检查；网络失败检查仅在测试中主动中断请求，不伪造成功回执。

- 中文日志：`artifacts/build-zh.log`、`test-zh.log`、`e2e-zh.log`、`demo-zh.log`。
- setup / doctor 证据：`artifacts/setup-zh.log`、`doctor-zh.log`、`doctor-missing-zh.log`。缺依赖测试使用项目 artifacts 内不含 node_modules 的隔离目录，预期退出码 1。
- 中文截图：`artifacts/demo.png`、`artifacts/mobile-zh.png`。
- 真实演示视频：`artifacts/playwright/` 中的 `video.webm`；每次 Playwright 运行会更新该目录。
- 早期英文版本曾因 FFmpeg 缺失和默认五秒断言超时失败；对应首次、第二次日志仍在本地保留，后续已安装编码器并将结果等待上限改为 20 秒，未伪报早期成功。

中文版本最后复跑中也曾出现一次回执等待超过 20 秒（`artifacts/e2e-zh-timeout.log`）；未修改断言的重跑全部通过，偶发超时的根因尚未定位，不宣称已修复。

日志、视频、截图和缓存只保留本地，不随公开仓库提交。克隆后运行上述命令即可生成自己的证据。**本次 setup 使用已有依赖缓存和 Chromium；全新机器从零下载浏览器、Windows/Linux 实际运行尚未验证。**

## 能力与安全边界

- 只支持一个内置示例站点、一个工具、一个内存录制会话；不是多用户服务或任意网站自动化产品。
- 面板表单控制受控浏览器，DOM 监听器捕获真实事件；不是桌面浏览器扩展。只录制非敏感示例文本，不记录密码、Cookie 或键盘日志。
- 白名单严格限定来源、页面路径、选择器、动作类型、分类、四步顺序和额外字段；不能执行任意脚本或 shell 命令。
- 任务长度 1–120 字，API JSON 上限 32 KiB，录制上限 16 事件；页面操作超时八秒，浏览器启动超时 15 秒，MCP 请求使用 SDK 的超时机制。
- Host / Origin 检查不等于身份认证，同机进程仍可访问 API。只在可信机器运行，不输入敏感信息，用完关闭服务。
- 配方生成无模型推理，未实现可选的模型描述建议、持久化导入导出、外部 MCP 托管或部署。

MIT 许可证。品牌和代码标识保留原文，默认交互与项目说明为中文。

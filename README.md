# Click2MCP

把一次浏览器表单操作，变成可以重复调用的 MCP 工具。

适合想理解「页面操作怎样变成工具调用」的开发者，也适合用来演示浏览器自动化：在左侧录制创建任务的流程，在右侧生成配方，再用官方 MCP SDK 调用它。中间始终显示受控浏览器的真实截图，下方展示捕获的操作步骤。

![开始录制前的工作空间](docs/images/recorder-empty.png)

## 跑起来

需要 Node.js **22.12+（22 系列）、24.x 或 26+** 和 npm。首次下载依赖与浏览器需要网络，无需 API Key。

进入 `apps/click2mcp`，执行：

```sh
npm run setup
npm run doctor
npm run dev
```

打开 [本地工作空间](http://127.0.0.1:4208)。API 使用 `127.0.0.1:5208`，请使用 `127.0.0.1`，不要替换为 `localhost`。退出时按 `Ctrl+C`。

`setup` 安装锁文件中的依赖以及 Chromium / FFmpeg，缓存写入项目的 `.cache`，也会复用已有兼容浏览器。`doctor` 会实际启动 Chromium 并检查端口，请在启动服务前运行。缺依赖时重跑 setup；端口被占用时先关闭已有服务。Linux 缺少浏览器系统库时，需要按 Playwright 提示补齐。

## 试一条真实流程

1. 点击 **开始录制**，填写「修复登录问题」、选择「工程」，点击 **录制表单提交**。
2. 时间线出现四步：打开页面、填写任务、选择分类、提交表单。点击 **生成 MCP**，得到 `submit_demo_task`。JSON 配方可展开查看。
3. 点击 **测试工具**。SDK 发现工具并在全新浏览器上下文执行，右侧显示真实的 `TASK-…` 回执。

![录制完成并成功调用工具](docs/images/recorder-success.png)

你可以修改左侧任务名称再调用，验证同一配方能处理不同任务。分类保留录制时的选择；需要更换分类时，重新开始录制。预览是每次操作后更新的截图，操作通过截图下方的表单控制。

## 用了什么

React + TypeScript 构建界面，Vite 启动前端，Express 提供本地 API。Playwright 驱动真实 Chromium 并捕获 DOM 事件；Zod 校验动作白名单；官方 MCP SDK 通过 stdio 完成 `listTools` 和 `callTool`。配方由确定性逻辑生成，没有模型推理。完整版本以 `package-lock.json` 为准，运行时也需要开发依赖。

## 验证与边界

```sh
npm run doctor
npm run build
npm run test
npm run e2e
npm run demo
```

测试包含 9 项安全规则单测和 4 项端到端检查：真实 SDK 调用、回执内容核对、来源限制、390px 小屏、键盘焦点与断网反馈。README 中两张截图来自 1440px 宽的实际运行页面，随仓库提交。测试视频、日志在本地 `artifacts/`，结果记录在 `status.json`。

这是一个本地原型：只有内置示例站点、一个工具和一个内存会话。不是任意网站录制器或浏览器扩展；不支持外部 MCP 托管、持久化导入导出或多用户。服务重启后回执会清空。只允许指定来源、路径、字段及四步操作，不执行任意脚本；请勿输入敏感内容。

已在 macOS 验证，安装复用了现有缓存；全新机器下载以及 Windows / Linux 尚未实测。此前曾出现 MCP 回执等待超过 20 秒，相同断言重跑通过，偶发超时原因仍未定位。

MIT License.

# A08 — Click2MCP：把页面操作变成 MCP 工具

## 目标与边界

构建真实的「录制 → 生成配方 → MCP 调用 → 页面回执」闭环。仅操作项目内置、位于 127.0.0.1 的非敏感示例站点，不接管任意浏览器，不自动化外部网站。所有工作限于本项目目录，遵循 AGENTS.md。

## 技术栈与要求

- TypeScript、React、Vite、Express、Playwright Chromium、官方 MCP TypeScript SDK 2（`@modelcontextprotocol/server` 和 `@modelcontextprotocol/client`）、Zod 4。
- 网页固定为 http://127.0.0.1:4208，API 固定为 http://127.0.0.1:5208，均只监听回环地址。
- `fixtures/demo-form` 提供任务名称、非敏感分类、提交按钮和回执编号。默认中文，可运行的零 Key 演示。
- 「开始录制」打开受控页面。仅允许 `goto`、白名单文本输入框的 `fill`、`selectOption`、稳定 `data-testid` 选择器的 `click`。不记录密码、Cookie、原始键盘事件、任意脚本或跨域导航。
- 「生成 MCP」校验并序列化安全 JSON 配方，注册唯一工具 `submit_demo_task`。不得生成任意 shell 命令。
- 「测试工具」必须由真实 SDK `listTools` 发现工具，`callTool` 在新浏览器上下文重放配方并返回页面实际回执。
- 生成逻辑是确定性的，无模型推理。可选模型描述建议未实现，不得伪称 AI 已参与。

## 三步演示

1. 点击「开始录制」，填写「修复登录问题」，选择「工程」，点击「录制表单提交」，显示四个真实捕获的事件。
2. 点击「生成 MCP」，展示工具名、参数 JSON Schema 与配方。
3. 点击「测试工具」，展示真实工具发现结果和提交回执。

## 必须验证

- 单元测试拒绝未许可来源、密码字段、危险选择器、未知动作和额外字段。
- 集成测试通过 SDK 发现和调用工具，并查询回执验证实际提交内容。
- 端到端测试断言事件数和真实回执，保留中文截图及 Playwright 录屏。
- 实际运行 `npm run build`、`npm run test`、`npm run e2e`、`npm run demo`。
- 提供跨平台 `npm run setup`、中文 `npm run doctor`，只安装项目依赖和所需浏览器，不修改系统设置。检查缺依赖时的友好诊断。
- 中文 README 说明环境、依赖、三步操作、恢复方法和限制；保留 MIT LICENSE，更新 status.json。日志和录屏留本地，不提交缓存、凭据或机器私有路径。

传播语：「我点击完成了一次流程，它就变成了真正的 MCP 工具。」

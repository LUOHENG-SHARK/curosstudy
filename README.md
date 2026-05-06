# Brand Copy Studio

一句话生成中文品牌文案（React + Ant Design + Express，默认对接 DeepSeek OpenAI 兼容接口）。

## 本地运行

```bash
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npm run dev:api        # 终端 1
npm run dev:client     # 终端 2 → http://localhost:5173
```

生产构建：

```bash
npm run build && npm start
```

## 上传到 GitHub

本地仓库若已初始化，只需关联远程并推送（勿提交 `.env`，已在 `.gitignore` 中忽略）：

```bash
cd /Users/didi/Desktop/brand-copy-studio
git remote remove origin 2>/dev/null
git remote add origin https://github.com/LUOHENG-SHARK/curosstudy.git
git push -u origin main
```

若已添加过 `origin`，可改用：`git remote set-url origin https://github.com/LUOHENG-SHARK/curosstudy.git`。

**认证**：HTTPS 推送需在终端登录 GitHub（浏览器弹窗或 Personal Access Token）。也可改用 SSH：

```bash
git remote set-url origin git@github.com:LUOHENG-SHARK/curosstudy.git
git push -u origin main
```

或使用 [GitHub CLI](https://cli.github.com/)：`gh auth login` 后再执行 `git push`。

## 一键部署（推荐 Render）

1. 打开 [Render Dashboard](https://dashboard.render.com/) → **New** → **Web Service**。
2. **Connect** 你的 GitHub 仓库并选中本项目。
3. 配置：
   - **Runtime**：Node
   - **Build Command**：`npm install && npm run build`
   - **Start Command**：`npm start`
4. **Environment** 里新增 **`DEEPSEEK_API_KEY`**（或 `LLM_API_KEY` / `OPENAI_API_KEY`，与本地 `.env` 一致）。
5. 部署完成后使用 Render 提供的 **HTTPS URL** 访问；健康检查可请求 `GET /api/health`。

也可使用仓库根目录的 **`render.yaml`**：在 Render 中选择 **Blueprint** 按向导导入。

### Railway

[Railway](https://railway.app/) → New Project → Deploy from GitHub → 选仓库；**Variables** 里设置 `DEEPSEEK_API_KEY`，**Build** 使用默认 Nixpacks（或自定义：`npm install && npm run build`），**Start**：`npm start`。

### Docker（任意容器平台）

```bash
docker build -t brand-copy-studio .
docker run -p 10000:10000 -e PORT=10000 -e DEEPSEEK_API_KEY=你的密钥 brand-copy-studio
```

云平台请将 **`PORT`** 设为平台提供的端口（Render/Railway 会自动注入）。

## 环境变量

| 变量 | 说明 |
|------|------|
| `DEEPSEEK_API_KEY` | 推荐；DeepSeek API Key |
| `LLM_API_KEY` | 通用密钥（优先级最高） |
| `OPENAI_API_KEY` | 兼容旧配置 |
| `LLM_BASE_URL` | 默认 `https://api.deepseek.com/v1` |
| `LLM_MODEL` | 默认 `deepseek-chat` |
| `PORT` | 监听端口，默认 `3789` |

免费实例可能休眠，首次访问会稍慢，属正常现象。

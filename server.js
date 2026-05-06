import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();
const PORT = process.env.PORT || 3789;

app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const distDir = path.join(__dirname, "dist");
const indexHtml = path.join(distDir, "index.html");

const SYSTEM_PROMPT = `你是资深中文品牌文案与创意总监。用户会输入极其简短的主题或业务一句话（可能只有几个字）。
请根据这句话推测合理的品类、气质与受众，输出一段「有画面、有情绪、可落地」的品牌向文案。

硬性要求：
- 使用简体中文。
- 正文 120～220 字为宜；可分 2～4 个短段落，段落之间空一行。
- 避免空洞口号堆砌；要有具体意象（光线、触感、时间、场景其一即可）。
- 不要输出标题前缀如「文案：」；不要Bullet列表；不要解释你的写作思路。
- 若用户输入非中文，仍用中文撰写正文。
- 语气克制、高级，可根据主题微调（温柔 / 锐利 / 俏皮 / 沉静），但整体要像真实品牌在官网或海报上会用的句子。`;

/** DeepSeek 等为 OpenAI 兼容 /chat/completions；密钥与地址仍可通过 LLM_* 或 OPENAI_* 覆盖 */
function resolveLlmEnv() {
  const apiKey =
    process.env.LLM_API_KEY?.trim() ||
    process.env.DEEPSEEK_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";

  const baseUrl = (
    process.env.LLM_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.deepseek.com/v1"
  ).replace(/\/$/, "");

  const model =
    process.env.LLM_MODEL?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    "deepseek-chat";

  const temperature = Number.parseFloat(process.env.LLM_TEMPERATURE ?? "0.85");
  const safeTemperature = Number.isFinite(temperature) ? Math.min(2, Math.max(0, temperature)) : 0.85;

  return { apiKey, baseUrl, model, temperature: safeTemperature };
}

app.post("/api/generate", async (req, res) => {
  const raw = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!raw) {
    return res.status(400).json({ error: "请输入一句话主题。" });
  }
  if (raw.length > 500) {
    return res.status(400).json({ error: "输入过长，请控制在 500 字以内。" });
  }

  const { apiKey, baseUrl, model, temperature } = resolveLlmEnv();
  if (!apiKey) {
    return res.status(503).json({
      error:
        "未配置 API 密钥。请在项目根目录 .env 中设置 DEEPSEEK_API_KEY（推荐）、LLM_API_KEY 或 OPENAI_API_KEY，保存后重启服务。",
    });
  }

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: raw },
        ],
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = data?.error?.message || `上游接口错误 (${r.status})`;
      return res.status(502).json({ error: msg });
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return res.status(502).json({ error: "模型未返回有效内容，请重试。" });
    }

    return res.json({ text });
  } catch (e) {
    return res.status(502).json({ error: e instanceof Error ? e.message : "网络请求失败。" });
  }
});

if (fs.existsSync(indexHtml)) {
  app.use(express.static(distDir));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res
      .status(503)
      .type("html")
      .send(
        `<!doctype html><meta charset=utf-8><title>需要先构建前端</title>` +
          `<pre style="font:15px/1.6 -apple-system,sans-serif;padding:24px">尚未生成前端资源。\n\n请在项目根目录执行：\n\n  npm install\n  npm run build\n  npm start\n</pre>`,
      );
  });
}

app.listen(PORT, () => {
  const { baseUrl, model, apiKey } = resolveLlmEnv();
  console.log(`Brand Copy Studio → http://localhost:${PORT}`);
  console.log(`LLM · ${model} @ ${baseUrl}`);
  console.log(
    apiKey ? `API key：已加载（${apiKey.length} 字符）` : "API key：未加载 · 请检查项目根目录 .env 是否已保存并含 DEEPSEEK_API_KEY",
  );
});

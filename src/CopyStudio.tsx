import { CopyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Flex,
  Input,
  Layout,
  Space,
  Typography,
} from "antd";
import { useCallback, useState } from "react";

const { Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

export function CopyStudio() {
  const { message } = App.useApp();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onGenerate = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      message.warning("先写一句话主题，再生成。");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "请求失败");
        return;
      }
      setOutput(data.text?.trim() || "");
    } catch {
      setError("无法连接服务器。开发时请同时运行 API（npm run dev）与前端（npm run dev:client）。");
    } finally {
      setLoading(false);
    }
  }, [message, prompt]);

  const onCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      message.success("已复制到剪贴板");
    } catch {
      message.error("复制失败，请手动选择文本");
    }
  }, [message, output]);

  return (
    <Layout className="apple-hero-gradient" style={{ minHeight: "100%" }}>
      <Content style={{ maxWidth: 980, margin: "0 auto", padding: "56px 24px 40px", width: "100%" }}>
        <Space direction="vertical" size={48} style={{ width: "100%" }}>
          <header>
            <Text type="secondary" style={{ letterSpacing: "0.08em", fontSize: 13, fontWeight: 600 }}>
              BRAND COPY
            </Text>
            <Title level={1} style={{ marginTop: 12, marginBottom: 0, fontWeight: 600 }}>
              一句话，落成品牌文案
            </Title>
            <Paragraph
              type="secondary"
              style={{
                fontSize: 19,
                maxWidth: 720,
                marginTop: 16,
                marginBottom: 0,
                lineHeight: 1.5,
              }}
            >
              遵循 Ant Design 的信息层级与交互反馈；视觉参考苹果产品站的留白与中性灰阶。输入一句业务描述，得到可用于官网首屏或海报的中文叙事。
            </Paragraph>
          </header>

          <Card
            bordered={false}
            styles={{
              body: { padding: "28px 28px 24px" },
            }}
            style={{
              boxShadow: "0 18px 48px rgba(0, 0, 0, 0.06)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Text strong style={{ fontSize: 15 }}>
                  你的那一句话
                </Text>
                <Paragraph type="secondary" style={{ margin: "6px 0 0", fontSize: 14 }}>
                  例如「卖咖啡」「凌晨健身房」「儿童绘本馆」。⌘/Ctrl + Enter 快捷生成。
                </Paragraph>
              </div>

              <Input.TextArea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="卖咖啡"
                autoSize={{ minRows: 3, maxRows: 8 }}
                maxLength={500}
                showCount
                onPressEnter={(e) => {
                  if (e.metaKey || e.ctrlKey) {
                    e.preventDefault();
                    void onGenerate();
                  }
                }}
              />

              <Flex wrap="wrap" gap={12} align="center">
                <Button
                  type="primary"
                  size="large"
                  icon={<ThunderboltOutlined />}
                  loading={loading}
                  onClick={() => void onGenerate()}
                >
                  生成文案
                </Button>
                <Button size="large" icon={<CopyOutlined />} disabled={!output} onClick={() => void onCopy()}>
                  复制结果
                </Button>
              </Flex>
            </Space>
          </Card>

          <Card
            title={<Text style={{ fontSize: 17, fontWeight: 600 }}>生成结果</Text>}
            bordered={false}
            styles={{
              body: { paddingTop: 12 },
            }}
            style={{
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
              minHeight: 220,
            }}
          >
            {error ? (
              <Paragraph style={{ color: "#ff3b30", marginBottom: 0 }}>{error}</Paragraph>
            ) : output === null ? (
              <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 15, lineHeight: 1.65 }}>
                生成后的文案会显示在这里。请在项目根目录 <Text code>.env</Text> 中配置{" "}
                <Text code>DEEPSEEK_API_KEY</Text>（或 <Text code>LLM_API_KEY</Text>），执行 <Text code>npm run build</Text>{" "}
                后 <Text code>npm start</Text>；本地联调：终端一 <Text code>npm run dev:api</Text>，终端二{" "}
                <Text code>npm run dev:client</Text>。
              </Paragraph>
            ) : (
              <Paragraph style={{ marginBottom: 0, fontSize: 17, lineHeight: 1.75, letterSpacing: "0.02em" }}>
                {output}
              </Paragraph>
            )}
          </Card>
        </Space>
      </Content>

      <Footer style={{ textAlign: "center", background: "transparent", color: "#86868b", padding: "24px 16px 40px" }}>
        文案由大模型生成，发布前请人工校对。
      </Footer>
    </Layout>
  );
}

import type { ThemeConfig } from "antd";

/**
 * Ant Design 5 token 体系 + 苹果官网常见的排版与中性色。
 * 原则：8px 网格、清晰层级、克制主色、系统字体栈。
 */
export const appleAntdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#0071e3",
    colorInfo: "#0071e3",
    colorSuccess: "#34c759",
    colorWarning: "#ff9500",
    colorError: "#ff3b30",

    colorBgLayout: "#f5f5f7",
    colorBgContainer: "#ffffff",
    colorBorderSecondary: "rgba(0, 0, 0, 0.06)",

    colorText: "#1d1d1f",
    colorTextSecondary: "#6e6e73",
    colorTextTertiary: "#86868b",

    borderRadius: 12,
    borderRadiusLG: 16,

    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    fontSize: 16,
    fontSizeHeading1: 48,
    fontSizeHeading2: 28,
    lineHeight: 1.47059,
    lineHeightHeading1: 1.05,
    lineHeightHeading2: 1.14,

    controlHeightLG: 52,
    paddingLG: 24,
    paddingContentHorizontalLG: 32,
    motionDurationMid: "0.2s",
  },
  components: {
    Layout: {
      bodyBg: "#f5f5f7",
      headerBg: "transparent",
      footerBg: "transparent",
    },
    Card: {
      paddingLG: 28,
    },
    Button: {
      primaryShadow: "0 8px 24px rgba(0, 113, 227, 0.22)",
      fontWeight: 600,
    },
    Typography: {
      titleMarginTop: "0.6em",
      titleMarginBottom: "0.35em",
    },
    Input: {
      activeBorderColor: "#0071e3",
      hoverBorderColor: "rgba(0, 113, 227, 0.45)",
    },
  },
};

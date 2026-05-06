import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

import { appleAntdTheme } from "./theme";
import { CopyStudio } from "./CopyStudio";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={appleAntdTheme}>
      <AntApp>
        <CopyStudio />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);

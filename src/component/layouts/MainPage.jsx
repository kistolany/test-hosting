import React, { useState } from "react";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import "../Main.css";

const { Content } = Layout;

const MainPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  return (
    <ConfigProvider theme={{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }}>
      <Layout style={{ minHeight: "100vh" }}>
        
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isDark={isDark} 
        />

        <Layout>
          <Header
            isDark={isDark} 
            setIsDark={setIsDark} 
          />

          <ContentWrapper isDark={isDark} />
        </Layout>
        
      </Layout>
    </ConfigProvider>
  );
};

const ContentWrapper = ({ isDark }) => {
  const { token: { colorBgContainer, borderRadiusLG } } = antdTheme.useToken();
  
  return (
    <Content
      className="content"
      style={{ 
        margin: '24px 16px',
        padding: 24,
        background: colorBgContainer, 
        borderRadius: borderRadiusLG,
        minHeight: 280 
      }}
    >
      <div style={{ color: isDark ? "#fff" : "#000" }}>
        <Outlet context={{ isDark }}/>
      </div>
    </Content>
  );
};

export default MainPage;
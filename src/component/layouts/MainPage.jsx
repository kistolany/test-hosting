import React, { useEffect, useState } from "react";
import { Layout, ConfigProvider, theme as antdTheme, Grid } from "antd";
import { Outlet } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

import Sidebar from "./Sidebar";
import Header from "./Header";
import "../Main.css";
import "../Scholar.css";
import "../Dashboard.css";
import "../Academic.css";
import "../Student.css";
import "../Login.css";
import "../Attendant.css";
import "../Print.css";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainPage = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { lang } = useLanguage();
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  return (
    <ConfigProvider theme={{ algorithm: isDark ? darkAlgorithm : defaultAlgorithm }}>
      <Layout className={`main-shell lang-${lang} ${isDark ? "theme-dark" : "theme-light"}`}>
        
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isDark={isDark}
          isMobile={isMobile}
        />

        {isMobile && !collapsed && (
          <div className="sidebar-backdrop" onClick={() => setCollapsed(true)} />
        )}

        <Layout className="main-inner-layout">
          <Header
            isDark={isDark} 
            setIsDark={setIsDark} 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <ContentWrapper isDark={isDark} />
        </Layout>
        
      </Layout>
    </ConfigProvider>
  );
};

const ContentWrapper = ({ isDark }) => {
  return (
    <Content
      className="content"
      style={{ 
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        overflowY: "auto"
      }}
    >
      <div style={{ color: isDark ? "#fff" : "#000" }}>
        <Outlet context={{ isDark }}/>
      </div>
    </Content>
  );
};

export default MainPage;
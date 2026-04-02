import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Space, Switch, Dropdown, Avatar, theme as antdTheme, Button, AutoComplete, Input } from "antd";
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";

const { Header: AntHeader } = Layout;

const Header = ({ isDark, setIsDark, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = antdTheme.useToken();
  const [searchValue, setSearchValue] = useState("");
  const { lang, setLanguage, t, fontClass } = useLanguage();

  const globalPages = useMemo(
    () => [
      { value: "/dashboard", label: t("navigation.dashboard") },
      { value: "/student", label: t("navigation.student") },
      { value: "/academic", label: t("navigation.academic") },
      { value: "/scholarshipForm", label: t("navigation.scholarship") },
      { value: "/enrollmentForm", label: t("navigation.enrollment") },
      { value: "/attendant", label: t("navigation.attendant") },
      { value: "/listNameExam", label: t("navigation.final") },
      { value: "/userManage", label: t("navigation.manageUser") },
      { value: "/roleManage", label: t("navigation.manageRole") },
      { value: "/auditLog", label: t("navigation.auditLog") },
      { value: "/profile", label: t("navigation.profile") },
    ],
    [t]
  );

  const navigateBySearch = (path) => {
    const target = String(path || "").trim().toLowerCase();
    const found = globalPages.find(
      (page) =>
        page.value.toLowerCase() === target ||
        page.label.toLowerCase() === target
    );

    if (found) {
      navigate(found.value);
      setSearchValue("");
    }
  };

  // Define menu items inside or outside; if they need to navigate, 
  // we handle the logic in the onClick handler.
  const userMenuItems = [
    { 
      label: t("header.profileSettings"), 
      key: "profile", 
      icon: <SettingOutlined /> 
    },
    { 
      label: t("header.logout"), 
      key: "logout", 
      icon: <LogoutOutlined />, 
      danger: true 
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token"); 
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  return (
    <AntHeader
      className="header"
      style={{
        background: colorBgContainer,
      }}
    >
      <div className="header-left-group">
        <Button
          type="text"
          className="mobile-sidebar-toggle"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        />

        <AutoComplete
          className="header-global-search"
          value={searchValue}
          options={globalPages}
          onSelect={(value) => navigateBySearch(value)}
          onSearch={(value) => setSearchValue(value)}
          filterOption={(inputValue, option) =>
            String(option?.label || "").toLowerCase().includes(inputValue.toLowerCase()) ||
            String(option?.value || "").toLowerCase().includes(inputValue.toLowerCase())
          }
        >
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
            placeholder={t("header.searchPlaceholder")}
            onPressEnter={(e) => navigateBySearch(e.target.value)}
          />
        </AutoComplete>
      </div>

      <Space size={25} className="header-actions">
        <Space size={6} className="header-language-switch">
          <Button
            size="small"
            type="default"
            className={`lang-switch-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </Button>
          <Button
            size="small"
            type="default"
            className={`lang-switch-btn ${lang === "km" ? "active" : ""}`}
            onClick={() => setLanguage("km")}
          >
            ខ្មែរ
          </Button>
        </Space>

        <Space size={8}>
          <span className={fontClass("body")} style={{ color: isDark ? "#fff" : "#000" }}>
            {isDark ? t("header.darkMode") : t("header.lightMode")}
          </span>
          <Switch
            checked={isDark}
            onChange={(val) => setIsDark(val)}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </Space>

        <Dropdown 
          menu={{ 
            items: userMenuItems, 
            onClick: handleMenuClick 
          }} 
          trigger={['click']}
          placement="bottomRight" 
          arrow
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              size="large"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              icon={<UserOutlined />}
              style={{
                border: `1px solid ${isDark ? "#444" : "#d9d9d9"}`,
                backgroundColor: isDark ? "#141414" : "#fff",
              }}
            />
            <DownOutlined style={{ fontSize: "12px", color: "#8c8c8c" }} />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
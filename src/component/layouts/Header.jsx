import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Space, Switch, Dropdown, Avatar, theme as antdTheme, Button, Badge, Empty, Input } from "antd";
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";
import { markNotificationRead, readNotifications } from "../../utils/notifications";

const { Header: AntHeader } = Layout;

const Header = ({ isDark, setIsDark, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = antdTheme.useToken();
  const { lang, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(() => readNotifications());
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const sync = () => setNotifications(readNotifications());
    window.addEventListener("storage", sync);
    window.addEventListener("app-notifications-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("app-notifications-updated", sync);
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const notificationMenuItems = notifications.length
    ? notifications.slice(0, 6).map((item) => ({
        key: item.id,
        label: (
          <div className="header-notification-item">
            <div className="header-notification-title">{item.title}</div>
            <div className="header-notification-message">{item.message}</div>
          </div>
        ),
      }))
    : [
        {
          key: "empty",
          disabled: true,
          label: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("header.noNotifications")} />,
        },
      ];

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

  const handleNotificationClick = ({ key }) => {
    if (key === "empty") return;
    const found = notifications.find((item) => item.id === key);
    if (!found) return;
    markNotificationRead(found.id);
    navigate(found.route || "/enrollmentForm");
  };

  const handleGlobalSearch = (value) => {
    const keyword = String(value || "").trim();
    navigate("/searchForm", { state: { keyword } });
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
        <Input
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={(e) => handleGlobalSearch(e.target.value)}
          placeholder={t("header.searchPlaceholder")}
          className="header-global-search"
          suffix={<SearchOutlined onClick={() => handleGlobalSearch(searchText)} style={{ cursor: "pointer" }} />}
        />
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
          <Switch
            className="theme-mode-switch"
            checked={isDark}
            onChange={(val) => setIsDark(val)}
            checkedChildren={<MoonFilled className="theme-mode-icon" />}
            unCheckedChildren={<SunOutlined className="theme-mode-icon" />}
          />
        </Space>

        <Dropdown
          menu={{ items: notificationMenuItems, onClick: handleNotificationClick }}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="header-notification-dropdown"
        >
          <Badge count={unreadCount} size="small" offset={[-1, 3]}>
            <Button type="text" className="header-notification-btn" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

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
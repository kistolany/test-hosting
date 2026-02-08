import React from "react";
import { Layout, Space, Switch, Dropdown, Avatar, theme as antdTheme } from "antd";
import { UserOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
const { Header: AntHeader } = Layout;

const userMenuItems = [
  { label: "Profile Settings", key: "profile", icon: <UserOutlined /> },
  { label: "Logout", key: "logout", icon: <LogoutOutlined />, danger: true },
];

const Header = ({ isDark, setIsDark }) => {
  const { token: { colorBgContainer } } = antdTheme.useToken();

  return (
    <AntHeader
      className="header"
      style={{
        "--header-bg": colorBgContainer,
        "--header-border": isDark ? "#303030" : "#f0f0f0",
        background: colorBgContainer,
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 24px'
      }}
    >
      <Space size={25}>
        <Switch
          checked={isDark}
          onChange={(val) => setIsDark(val)}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
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
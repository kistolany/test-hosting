import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Space, Switch, Dropdown, Avatar, theme as antdTheme} from "antd";
import { UserOutlined, DownOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

const Header = ({ isDark, setIsDark }) => {
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = antdTheme.useToken();

  // Define menu items inside or outside; if they need to navigate, 
  // we handle the logic in the onClick handler.
  const userMenuItems = [
    { 
      label: "Profile Settings", 
      key: "profile", 
      icon: <SettingOutlined /> 
    },
    { 
      label: "Logout", 
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
      <Space size={25}>
        <Space size={8}>
          <span style={{ color: isDark ? "#fff" : "#000" }}>
            {isDark ? "Dark Mode" : "Light Mode"}
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
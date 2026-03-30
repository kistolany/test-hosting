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

const { Header: AntHeader } = Layout;

const Header = ({ isDark, setIsDark, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { token: { colorBgContainer } } = antdTheme.useToken();
  const [searchValue, setSearchValue] = useState("");

  const globalPages = useMemo(
    () => [
      { value: "/dashboard", label: "Dashboard" },
      { value: "/student", label: "Student" },
      { value: "/academic", label: "Academic" },
      { value: "/scholarshipForm", label: "Scholarship Form" },
      { value: "/enrollmentForm", label: "Enrollment Form" },
      { value: "/attendant", label: "Attendant" },
      { value: "/listNameExam", label: "Final" },
      { value: "/userManage", label: "Manage User" },
      { value: "/roleManage", label: "Manage Role" },
      { value: "/auditLog", label: "Audit Log" },
      { value: "/profile", label: "Profile" },
    ],
    []
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
            placeholder="Search"
            onPressEnter={(e) => navigateBySearch(e.target.value)}
          />
        </AutoComplete>
      </div>

      <Space size={25} className="header-actions">
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
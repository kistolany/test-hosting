import React from "react";
import { Layout, Menu, Button } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
const { Sider } = Layout;
const menuItems = [
  { key: "/student", icon: <UsergroupAddOutlined />, label: "Student" },
  { key: "/academic", icon: <ReadOutlined />, label: "Academic" },
  // { key: "/scholarshipForm", icon: <ReadOutlined />, label: "ScholarshipForm" },
  {
    key: "sub2",
    label: "Scholarship",
    icon: <AppstoreOutlined />,
    children: [
      { key: "/ScholarshipForm", label: "Form" },
      { key: "/receipt", label: "Receipt" },
      { key: "/cover", label: "Cover" },
    ],
  }, 
  {
    key: "sub3",
    label: "Enrollment",
    icon: <AppstoreOutlined />,
    children: [
      { key: "/enrollmentForm", label: "Form" },
      { key: "/enrollmentReciept", label: "Receipt" },
    ],
  },
  { key: "/attendant", icon: <ReadOutlined />, label: "Attendant" },

];

const Sidebar = ({ collapsed, setCollapsed, isDark }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme={isDark ? "dark" : "light"}
      style={{
        background: isDark ? "#001529" : "#ffffff",
        transition: "all 0.2s",
      }}
    >
      <Button
        style={{
          justifyContent: collapsed ? "center" : "flex-end",
          paddingRight: collapsed ? "0" : "16px",
          color: isDark ? "#fff" : "#000",
          
        }}
        className="btnMenu"
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      
      <div className="logo-container" style={{ height: collapsed ? 64 : 150, filter: isDark ? "brightness(0) invert(1)" : "none" }}>
        <img src="/asset/image/logo.png" alt="logo" style={{ width: collapsed ? "32px" : "80px", height: collapsed ? "32px" : "80px" }} />
        {!collapsed && (
          <span className="span1">
            CAMBODIA UNIVERSITY OF <br />
            <span className="span2">MANAGEMENT AND TECHNOLOGY</span>
          </span>
        )}
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => `dashboard ${collapsed ? "collapsed" : ""} ${isActive ? "active" : ""}`}>
        Dashboard
      </NavLink>
      
      <Menu
        theme={isDark ? "dark" : "light"}
        onClick={(e) => navigate(e.key)}
        selectedKeys={[location.pathname]}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
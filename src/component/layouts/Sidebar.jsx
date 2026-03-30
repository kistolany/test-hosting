import React from "react";
import { Layout, Menu, Dropdown } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ReadOutlined,
  GiftOutlined,
  FormOutlined,
  CheckSquareOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  {
    key: "sub1",
    label: "Student",
    icon: <GiftOutlined />,
    children: [
      { key: "/student", label: "List Student" },
      { key: "/scholarExam", label: "Scholarship Exam" },
      { key: "/sortingpage", label: "Sort Student" },
    ],
  },
  { key: "/academic", icon: <ReadOutlined />, label: "Academic" },
  {
    key: "sub2",
    label: "Scholarship",
    icon: <GiftOutlined />,
    children: [
      { key: "/ScholarshipForm", label: "Form" },
      { key: "/receipt", label: "Receipt" },
      { key: "/cover", label: "Cover" },
    ],
  },
  {
    key: "sub3",
    label: "Enrollment",
    icon: <FormOutlined />,
    children: [
      { key: "/enrollmentForm", label: "Form" },
      { key: "/enrollmentReciept", label: "Receipt" },
    ],
  },
  { key: "/attendant", icon: <CheckSquareOutlined />, label: "Attendant" },
  { key: "/listNameExam", icon: <ReadOutlined />, label: "Final" },
];

const Sidebar = ({ collapsed, setCollapsed, isDark, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSettingActive = ["/userManage", "/roleManage", "/auditLog"].includes(location.pathname);

  const settingMenuItems = [
    {
      key: "/userManage",
      icon: <SettingOutlined />,
      label: "Manage User",
    },
    {
      key: "/roleManage",
      icon: <SafetyCertificateOutlined />,
      label: "Manage Role",
    },
    {
      key: "/auditLog",
      icon: <FileSearchOutlined />,
      label: "Audit Log",
    },
  ];

  const handleSettingClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <Sider
      className="app-sider"
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 80}
      width={260}
      theme={isDark ? "dark" : "light"}
      style={{
        background: isDark ? "#001529" : "#ffffff",
        transition: "all 0.2s",
        position: isMobile ? "fixed" : "sticky",
        insetInlineStart: 0,
        top: 0,
        height: "100vh",
        zIndex: isMobile ? 1200 : 1000,
        overflow: "hidden",
      }}
    >
      <div className="sidebar-fixed-section">
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
      </div>

      <div className="sidebar-menu-scroll">
        <Menu
          theme={isDark ? "dark" : "light"}
          onClick={(e) => {
            navigate(e.key);
            if (isMobile) {
              setCollapsed(true);
            }
          }}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
        />
      </div>

      <div className="sidebar-bottom-user">
        <div className="sidebar-bottom-divider" />
        <Dropdown
          menu={{ items: settingMenuItems, onClick: handleSettingClick }}
          trigger={["click"]}
          placement="topRight"
          overlayClassName="setting-popup-menu"
        >
          <button
            type="button"
            className={`sidebar-bottom-link sidebar-setting-toggle ${isSettingActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
            aria-label="Open setting menu"
          >
            <SettingOutlined />
            {!collapsed && (
              <>
                <span>Setting</span>
                <span className="setting-toggle-icon"><DownOutlined /></span>
              </>
            )}
          </button>
        </Dropdown>

        <button
          type="button"
          className={`sidebar-bottom-link sidebar-bottom-action ${collapsed ? "collapsed" : ""}`}
          onClick={handleLogout}
        >
          <LogoutOutlined />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
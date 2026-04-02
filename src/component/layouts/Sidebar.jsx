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
import { useLanguage } from "../../i18n/LanguageContext";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed, isDark, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, fontClass, lang } = useLanguage();
  const isSettingActive = ["/userManage", "/roleManage", "/auditLog"].includes(location.pathname);

  const menuItems = [
    {
      key: "sub1",
      label: <span className={fontClass("body")}>{t("navigation.student")}</span>,
      icon: <GiftOutlined />,
      children: [
        { key: "/student", label: <span className={fontClass("body")}>{t("navigation.listStudent")}</span> },
        { key: "/createStudent", label: <span className={fontClass("body")}>{t("navigation.registerStudent")}</span> },
        { key: "/scholarExam", label: <span className={fontClass("body")}>{t("navigation.scholarshipExam")}</span> },
        { key: "/sortingpage", label: <span className={fontClass("body")}>{t("navigation.sortStudent")}</span> },
      ],
    },
    { key: "/academic", icon: <ReadOutlined />, label: <span className={fontClass("body")}>{t("navigation.academic")}</span> },
    {
      key: "sub2",
      label: <span className={fontClass("body")}>{t("navigation.scholarship")}</span>,
      icon: <GiftOutlined />,
      children: [
        { key: "/scholarshipForm", label: <span className={fontClass("body")}>{t("navigation.form")}</span> },
        { key: "/receipt", label: <span className={fontClass("body")}>{t("navigation.receipt")}</span> },
        { key: "/cover", label: <span className={fontClass("body")}>{t("navigation.cover")}</span> },
      ],
    },
    {
      key: "sub3",
      label: <span className={fontClass("body")}>{t("navigation.enrollment")}</span>,
      icon: <FormOutlined />,
      children: [
        { key: "/enrollmentForm", label: <span className={fontClass("body")}>{t("navigation.form")}</span> },
        { key: "/enrollmentReciept", label: <span className={fontClass("body")}>{t("navigation.receipt")}</span> },
      ],
    },
    {
      key: "sub4",
      label: <span className={fontClass("body")}>{t("navigation.final")}</span>,
      icon: <FormOutlined />,
      children: [
        { key: "/listNameExam", label: <span className={fontClass("body")}>{t("navigation.listName")}</span> },
        { key: "/score", label: <span className={fontClass("body")}>{t("navigation.score")}</span> },
        { key: "/scoreTeacher", label: <span className={fontClass("body")}>{t("navigation.scoreByTeacher")}</span> },
      ],
    },
    { key: "/attendant", icon: <CheckSquareOutlined />, label: <span className={fontClass("body")}>{t("navigation.attendant")}</span> },
  ];

  const settingMenuItems = [
    {
      key: "/userManage",
      icon: <SettingOutlined />,
      label: <span className={fontClass("body")}>{t("navigation.manageUser")}</span>,
    },
    {
      key: "/roleManage",
      icon: <SafetyCertificateOutlined />,
      label: <span className={fontClass("body")}>{t("navigation.manageRole")}</span>,
    },
    {
      key: "/auditLog",
      icon: <FileSearchOutlined />,
      label: <span className={fontClass("body")}>{t("navigation.auditLog")}</span>,
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
          {!collapsed && <span className="logo-title-single">{t("university.nameKh")}</span>}
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => `dashboard ${collapsed ? "collapsed" : ""} ${isActive ? "active" : ""}`}>
          <span className={fontClass("title")}>{t("navigation.dashboard")}</span>
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
          overlayClassName={`setting-popup-menu setting-popup-menu-${lang} ${isDark ? "setting-popup-menu-dark" : ""}`}
        >
          <button
            type="button"
            className={`sidebar-bottom-link sidebar-setting-toggle ${isSettingActive ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
            aria-label="Open setting menu"
          >
            <SettingOutlined />
            {!collapsed && (
              <>
                <span className={fontClass("body")}>{t("navigation.setting")}</span>
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
          {!collapsed && <span className={fontClass("body")}>{t("header.logout")}</span>}
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
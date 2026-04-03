import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Space, Dropdown, Avatar, Button, Badge, Empty, Input, Checkbox, AutoComplete } from "antd";
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  SunOutlined,
  MoonFilled,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";
import { clearCurrentUser, markNotificationRead, readCurrentUser, readNotifications, writeVisibleNotifications } from "../../utils/notifications";
import { pushAuditLog } from "../../utils/auditLogs";

const { Header: AntHeader } = Layout;

const Header = ({ isDark, setIsDark, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { lang, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(() => readNotifications());
  const [searchText, setSearchText] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

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

  const visibleNotifications = useMemo(() => {
    const list = notifications.slice(0, 20);
    if (!selectMode || !selectedIds.length) return list;
    const selectedSet = new Set(selectedIds);
    return [...list].sort((a, b) => {
      const aSel = selectedSet.has(a.id) ? 1 : 0;
      const bSel = selectedSet.has(b.id) ? 1 : 0;
      return bSel - aSel;
    });
  }, [notifications, selectMode, selectedIds]);

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
      const currentUser = readCurrentUser();
      pushAuditLog({
        action: "Logout",
        module: "Auth",
        description: `${currentUser?.username || "User"} logged out.`,
        before: JSON.stringify({
          username: currentUser?.username || "",
          role: currentUser?.role || "",
        }),
      });
      localStorage.removeItem("token"); 
      clearCurrentUser();
      navigate("/");
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  const handleNotificationClick = (item) => {
    if (!item) return;
    markNotificationRead(item.id);
    setNotificationOpen(false);
    navigate(item.route || "/enrollmentForm");
  };

  const handleClearAll = () => {
    const total = notifications.length;
    writeVisibleNotifications([]);
    pushAuditLog({
      action: "Delete",
      module: "Notifications",
      description: `Cleared all notifications (${total}).`,
      before: JSON.stringify({ total }),
      after: JSON.stringify({ total: 0 }),
    });
    setSelectedIds([]);
  };

  const handleClearOne = (id) => {
    const target = notifications.find((item) => item.id === id);
    const next = notifications.filter((item) => item.id !== id);
    writeVisibleNotifications(next);
    pushAuditLog({
      action: "Delete",
      module: "Notifications",
      description: `Cleared notification: ${target?.title || id}.`,
      before: target ? JSON.stringify({ id: target.id, title: target.title }) : null,
      after: null,
    });
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleToggleSelectMode = () => {
    setSelectMode((prev) => {
      const nextMode = !prev;
      pushAuditLog({
        action: "Select",
        module: "Notifications",
        description: `${nextMode ? "Enabled" : "Disabled"} notification select mode.`,
        after: JSON.stringify({ selectMode: nextMode }),
      });
      if (prev) setSelectedIds([]);
      return nextMode;
    });
  };

  const handleToggleSelected = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleClearSelected = () => {
    if (!selectedIds.length) return;
    const count = selectedIds.length;
    const selectedSet = new Set(selectedIds);
    const next = notifications.filter((item) => !selectedSet.has(item.id));
    writeVisibleNotifications(next);
    pushAuditLog({
      action: "Delete",
      module: "Notifications",
      description: `Cleared selected notifications (${count}).`,
      before: JSON.stringify({ count }),
      after: JSON.stringify({ count: 0 }),
    });
    setSelectedIds([]);
    setSelectMode(false);
  };

  const handleGlobalSearch = (value) => {
    const keyword = String(value || "").trim();
    navigate("/searchForm", { state: { keyword } });
  };

  const searchTargets = useMemo(() => ([
    { label: t("navigation.dashboard"), route: "/dashboard" },
    { label: t("navigation.listStudent"), route: "/student" },
    { label: t("navigation.registerStudent"), route: "/createStudent" },
    { label: t("navigation.scholarshipExam"), route: "/scholarExam" },
    { label: t("navigation.sortStudent"), route: "/sortingpage" },
    { label: t("navigation.academic"), route: "/academic" },
    { label: t("navigation.scholarship"), route: "/scholarshipForm" },
    { label: t("navigation.enrollment"), route: "/enrollmentForm" },
    { label: t("navigation.final"), route: "/listNameExam" },
    { label: t("navigation.attendant"), route: "/attendant" },
    { label: t("navigation.manageUser"), route: "/userManage" },
    { label: t("navigation.manageRole"), route: "/roleManage" },
    { label: t("navigation.auditLog"), route: "/auditLog" },
    { label: t("navigation.searchForm"), route: "/searchForm" },
  ]), [t]);

  const searchOptions = useMemo(() => {
    const keyword = String(searchText || "").trim().toLowerCase();
    const filtered = keyword
      ? searchTargets.filter((item) => String(item.label).toLowerCase().includes(keyword))
      : searchTargets;
    return filtered.slice(0, 8).map((item) => ({ value: item.label, label: item.label, route: item.route }));
  }, [searchText, searchTargets]);

  const handleSearchSelect = (value, option) => {
    setSearchText(value);
    if (option?.route) {
      navigate(option.route);
      return;
    }
    handleGlobalSearch(value);
  };

  return (
    <AntHeader
      className="header"
      style={{
        background: isDark ? "#001529" : "#ffffff",
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
          className="header-global-search-autocomplete"
          value={searchText}
          options={searchOptions}
          onSearch={setSearchText}
          onSelect={handleSearchSelect}
          onChange={setSearchText}
          filterOption={false}
        >
          <Input
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={(e) => handleGlobalSearch(e.target.value)}
            placeholder={`${t("header.searchPlaceholder")}...`}
            className="header-global-search"
            prefix={<SearchOutlined className="header-global-search-icon" />}
          />
        </AutoComplete>
      </div>

      <Space size={8} className="header-actions">
        <Button
          type="text"
          className="header-language-compact"
          onClick={() => setLanguage(lang === "en" ? "km" : "en")}
          icon={<GlobalOutlined />}
        >
          {lang === "km" ? "KM" : "EN"}
        </Button>

        <Button
          type="text"
          className="header-theme-btn"
          onClick={() => setIsDark(!isDark)}
          icon={isDark ? <MoonFilled /> : <SunOutlined />}
          aria-label={isDark ? t("header.darkMode") : t("header.lightMode")}
        />

        <Dropdown
          open={notificationOpen}
          onOpenChange={setNotificationOpen}
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="header-notification-dropdown"
          dropdownRender={() => (
            <div className="header-notification-panel">
              <div className="header-notification-toolbar">
                <Button size="small" type="text" onClick={handleClearAll} disabled={!notifications.length}>
                  {t("header.clearAll")}
                </Button>
                <Button size="small" type="text" onClick={handleToggleSelectMode} disabled={!notifications.length}>
                  {selectMode ? t("header.cancelSelect") : t("header.select")}
                </Button>
                {selectMode && (
                  <Button size="small" type="text" danger onClick={handleClearSelected} disabled={!selectedIds.length}>
                    {t("header.clearSelected")}
                  </Button>
                )}
              </div>

              {visibleNotifications.length ? (
                <div className="header-notification-list">
                  {visibleNotifications.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                    <div className={`header-notification-row ${isSelected ? "selected" : ""} ${item.read ? "read" : "unread"}`} key={item.id}>
                      {selectMode && (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleSelected(item.id)}
                        />
                      )}
                      <button
                        type="button"
                        className={`header-notification-item ${isSelected ? "selected" : ""} ${item.read ? "read" : "unread"}`}
                        onClick={() => handleNotificationClick(item)}
                      >
                        <div className="header-notification-title-row">
                          <div className="header-notification-title">{item.title}</div>
                          <span
                            className={`header-notification-status ${item.read ? "previewed" : "new"}`}
                          >
                            {item.read ? t("header.previewedLabel") : t("header.newLabel")}
                          </span>
                        </div>
                        <div className="header-notification-message">{item.message}</div>
                      </button>
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        className="header-notification-clear-btn"
                        onClick={() => handleClearOne(item.id)}
                        aria-label="Clear notification"
                      />
                    </div>
                  )})}
                </div>
              ) : (
                <div className="header-notification-empty">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("header.noNotifications")} />
                </div>
              )}
            </div>
          )}
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
          <Space className="header-user-trigger" style={{ cursor: "pointer" }}>
            <Avatar
              size={32}
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              icon={<UserOutlined />}
              className="header-user-avatar"
            />
            <DownOutlined className="header-user-caret" />
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
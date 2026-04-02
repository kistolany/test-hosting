import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, Card, Typography, Upload, Row, Col, Popconfirm } from "antd";
import {
  UserAddOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  UserDeleteOutlined,
  SafetyOutlined,
  SearchOutlined,
  CameraOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";
import { pushAuditLog } from "../../utils/auditLogs";

const { Title, Text } = Typography;

const UserManagement = () => {
  const { isDark } = useOutletContext();
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [tempImage, setTempImage] = useState(null);

  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@backsey.com", phone: "+855 12 000 001", role: "Admin", status: "active", lastLogin: "Mar 17, 2026 3:00 PM", joined: "Jan 1, 2025", color: "#3b82f6" },
    { id: 2, name: "Dara Sok", email: "dara@backsey.com", phone: "+855 12 000 002", role: "Cashier", status: "active", lastLogin: "Mar 16, 2026 9:30 PM", joined: "Mar 15, 2025", color: "#10b981" },
    { id: 3, name: "Chantrea Meng", email: "chantrea@backsey.com", phone: "+855 12 000 003", role: "Order Manager", status: "active", lastLogin: "Mar 17, 2026 2:00 PM", joined: "Apr 1, 2025", color: "#8b5cf6" },
    { id: 4, name: "Veasna Kosal", email: "veasna@backsey.com", phone: "+855 12 000 004", role: "Cashier", status: "active", lastLogin: "Mar 15, 2026 4:00 PM", joined: "Jun 1, 2025", color: "#f59e0b" },
    { id: 5, name: "Sreypov Lim", email: "sreypov@backsey.com", phone: "+855 12 000 005", role: "Supervisor", status: "active", lastLogin: "Mar 14, 2026 10:20 AM", joined: "Jul 18, 2025", color: "#ef4444" },
    { id: 6, name: "Rithy Chan", email: "rithy@backsey.com", phone: "+855 12 000 006", role: "Finance", status: "inactive", lastLogin: "Mar 01, 2026 8:10 AM", joined: "Oct 2, 2025", color: "#06b6d4" },
    { id: 7, name: "Piseth Heng", email: "piseth@backsey.com", phone: "+855 12 000 007", role: "Admin", status: "active", lastLogin: "Mar 17, 2026 11:50 AM", joined: "Dec 20, 2025", color: "#6366f1" },
  ]);

  const showModal = (record = null) => {
    if (record) {
      setEditingKey(record.id);
      form.setFieldsValue({ ...record, password: "" }); // Don't show old password for security
      setTempImage(record.image || null);
      pushAuditLog({
        action: "View",
        module: "Users",
        description: `Opened edit modal for user ${record.name}.`,
        after: JSON.stringify({
          id: record.id,
          name: record.name,
          email: record.email,
        }),
      });
    } else {
      setEditingKey(null);
      form.resetFields();
      setTempImage(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = (values) => {
    const userData = {
      ...values,
      status: values.status || "active",
      lastLogin: values.lastLogin || "-",
      joined: values.joined || "-",
      color: values.color || "#3b82f6",
      image: tempImage,
    };

    if (editingKey) {
      const beforeUser = users.find((u) => u.id === editingKey);
      setUsers(users.map(u => u.id === editingKey ? { ...u, ...userData } : u));
      pushAuditLog({
        action: "Update",
        module: "Users",
        description: `Updated user ${userData.name}.`,
        before: beforeUser ? JSON.stringify({
          name: beforeUser.name,
          email: beforeUser.email,
          role: beforeUser.role,
          status: beforeUser.status,
        }) : null,
        after: JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        }),
      });
      message.success(t("userManage.messages.userUpdated"));
    } else {
      setUsers([...users, { ...userData, id: Date.now() }]);
      pushAuditLog({
        action: "Create",
        module: "Users",
        description: `Created user ${userData.name}.`,
        after: JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        }),
      });
      message.success(t("userManage.messages.userCreated"));
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (info) => {
    const file = info.file?.originFileObj;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setTempImage(e.target?.result || null);
    reader.readAsDataURL(file);
  };

  const handleDelete = (userId) => {
    const beforeUser = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    pushAuditLog({
      action: "Delete",
      module: "Users",
      description: `Deleted user ${beforeUser?.name || userId}.`,
      before: beforeUser ? JSON.stringify({
        name: beforeUser.name,
        email: beforeUser.email,
        role: beforeUser.role,
        status: beforeUser.status,
      }) : null,
      after: null,
    });
    message.success(t("userManage.messages.userDeleted"));
  };

  const handleView = (record) => {
    setDetailRecord(record);
    setIsDetailOpen(true);
    pushAuditLog({
      action: "View",
      module: "Users",
      description: `Viewed user details for ${record.name}.`,
      after: JSON.stringify({
        id: record.id,
        name: record.name,
        role: record.role,
      }),
    });
  };

  const filteredUsers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return users;
    return users.filter((item) =>
      [item.name, item.email, item.phone, item.role, item.status]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [users, searchText]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const inactive = users.filter((u) => u.status !== "active").length;
    const rolesCount = new Set(users.map((u) => u.role)).size;
    return { total, active, inactive, rolesCount };
  }, [users]);

  const columns = [
    {
      title: <span className="staff-table-sort">↕</span>,
      dataIndex: "name",
      key: "avatar",
      width: 80,
      render: (_, record) => (
        record.image ? (
          <img src={record.image} alt={record.name} className="staff-avatar staff-avatar-img" />
        ) : (
          <div className="staff-avatar" style={{ backgroundColor: record.color || "#3b82f6" }}>
            {record.name?.charAt(0) || "U"}
          </div>
        )
      ),
    },
    {
      title: t("userManage.columns.name").toUpperCase(),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("userManage.columns.email").toUpperCase(),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: t("userManage.columns.phone").toUpperCase(),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("userManage.columns.role").toUpperCase(),
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: t("userManage.columns.status").toUpperCase(),
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag className={`staff-status-pill ${status === "active" ? "active" : "inactive"}`}>
          {status === "active" ? t("userManage.active") : t("userManage.inactive")}
        </Tag>
      ),
    },
    {
      title: t("userManage.columns.lastLogin").toUpperCase(),
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: t("userManage.columns.joined").toUpperCase(),
      dataIndex: "joined",
      key: "joined",
    },
    {
      title: t("userManage.columns.action").toUpperCase(),
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm
            title={t("userManage.modal.deleteTitle")}
            okText={t("actions.submit")}
            cancelText={t("actions.cancel")}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-container staff-users-page">
      <div className="user-wrapper">
        <div className="user-header-section">
          <div>
            <Title level={2} style={{ margin: 0 }}>{t("userManage.title")}</Title>
          </div>
          <Button className="staff-add-btn" size="large" icon={<UserAddOutlined />} onClick={() => showModal()}>
            {t("userManage.addUser")}
          </Button>
        </div>

        <div className="staff-stat-grid">
          <Card className="staff-stat-card" bordered>
            <div className="staff-stat-head">
              <Text className="staff-stat-label">{t("userManage.totalStaff")}</Text>
              <span className="staff-stat-icon"><TeamOutlined /></span>
            </div>
            <Title level={2} className="staff-stat-value">{stats.total}</Title>
          </Card>
          <Card className="staff-stat-card" bordered>
            <div className="staff-stat-head">
              <Text className="staff-stat-label">{t("userManage.active")}</Text>
              <span className="staff-stat-icon"><UserSwitchOutlined /></span>
            </div>
            <Title level={2} className="staff-stat-value">{stats.active}</Title>
          </Card>
          <Card className="staff-stat-card" bordered>
            <div className="staff-stat-head">
              <Text className="staff-stat-label">{t("userManage.inactive")}</Text>
              <span className="staff-stat-icon"><UserDeleteOutlined /></span>
            </div>
            <Title level={2} className="staff-stat-value">{stats.inactive}</Title>
          </Card>
          <Card className="staff-stat-card" bordered>
            <div className="staff-stat-head">
              <Text className="staff-stat-label">{t("userManage.roles")}</Text>
              <span className="staff-stat-icon"><SafetyOutlined /></span>
            </div>
            <Title level={2} className="staff-stat-value">{stats.rolesCount}</Title>
          </Card>
        </div>

        <div className="staff-table-tools-wrap">
          <div className="staff-table-tools">
            <Input
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              placeholder={t("userManage.searchPlaceholder")}
              className="staff-search-input"
            />
            <Select
              value={pageSize}
              onChange={setPageSize}
              className="staff-rows-select"
              options={[
                { value: 5, label: `${t("userManage.rows")} 5` },
                { value: 10, label: `${t("userManage.rows")} 10` },
                { value: 20, label: `${t("userManage.rows")} 20` },
              ]}
            />
          </div>
        </div>

        <Card className="user-card-main staff-table-card" bordered>

          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            className="staff-user-table"
            pagination={{ pageSize }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Modal
        title={editingKey ? t("userManage.modal.updateUser") : t("userManage.modal.addUser")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={640}
        centered
        okText={editingKey ? t("userManage.modal.saveChanges") : t("userManage.modal.createUser")}
        okButtonProps={{ className: "user-modal-ok-btn" }}
        cancelButtonProps={{ className: "user-modal-cancel-btn" }}
        wrapClassName={`user-manage-modal ${isDark ? "user-manage-modal-dark" : ""}${lang === "km" ? " user-manage-modal-km" : ""}`}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: "20px" }} className="user-manage-form-grid">
          <div className="user-upload-group">
            <Upload
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              {tempImage ? (
                <img src={tempImage} alt="avatar" className="user-avatar-img" />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <CameraOutlined style={{ fontSize: 18 }} />
                  <div style={{ marginTop: 4 }}>{t("userManage.form.photo")}</div>
                </div>
              )}
            </Upload>
            <Text type="secondary">{t("userManage.form.uploadPhoto")}</Text>
          </div>

          <Row gutter={[12, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label={t("userManage.form.fullName")} rules={[{ required: true, message: t("userManage.form.required") }]}>
                <Input prefix={<UserOutlined />} placeholder={t("userManage.form.fullNamePlaceholder")} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="email" label={t("userManage.form.emailUsername")} rules={[{ required: true, type: "email", message: t("userManage.form.validEmail") }]}>
                <Input prefix={<MailOutlined />} placeholder={t("userManage.form.emailPlaceholder")} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="phone" label={t("userManage.form.phone")} rules={[{ required: true, message: t("userManage.form.required") }]}>
                <Input placeholder={t("userManage.form.phonePlaceholder")} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label={t("userManage.form.password")}
                rules={[{ required: !editingKey, message: t("userManage.form.setPassword") }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>
            </Col>

            {editingKey && (
              <Col span={24}>
                <Text className="user-form-password-note">{t("userManage.form.keepPassword")}</Text>
              </Col>
            )}

            <Col xs={24} md={12}>
              <Form.Item name="role" label={t("userManage.form.role")} initialValue="Support" style={{ marginTop: 6 }}>
                <Select size="large">
                  <Select.Option value="Admin">{t("userManage.roleOptions.admin")}</Select.Option>
                  <Select.Option value="Cashier">{t("userManage.roleOptions.cashier")}</Select.Option>
                  <Select.Option value="Order Manager">{t("userManage.roleOptions.orderManager")}</Select.Option>
                  <Select.Option value="Finance">{t("userManage.roleOptions.finance")}</Select.Option>
                  <Select.Option value="Support">{t("userManage.roleOptions.support")}</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="status" label={t("userManage.form.status")} initialValue="active" style={{ marginTop: 6 }}>
                <Select size="large">
                  <Select.Option value="active">{t("userManage.active")}</Select.Option>
                  <Select.Option value="inactive">{t("userManage.inactive")}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title={t("userManage.modal.viewUser")}
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailOpen(false)}>
            {t("actions.cancel")}
          </Button>,
        ]}
        width={640}
        centered
        wrapClassName={`user-manage-modal ${isDark ? "user-manage-modal-dark" : ""}${lang === "km" ? " user-manage-modal-km" : ""}`}
      >
        {detailRecord && (
          <Form layout="vertical" className="user-manage-form-grid" style={{ marginTop: "12px" }}>
            <div className="user-upload-group">
              {detailRecord.image ? (
                <img src={detailRecord.image} alt={detailRecord.name} className="user-avatar-img" />
              ) : (
                <div className="staff-avatar" style={{ backgroundColor: detailRecord.color || "#3b82f6", width: 72, height: 72, fontSize: 30 }}>
                  {detailRecord.name?.charAt(0) || "U"}
                </div>
              )}
              <Text type="secondary">{t("userManage.modal.profileInfo")}</Text>
            </div>

            <Row gutter={[12, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.name")}>
                  <Input value={detailRecord.name} readOnly size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.email")}>
                  <Input value={detailRecord.email} readOnly size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.phone")}>
                  <Input value={detailRecord.phone} readOnly size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.role")}>
                  <Input value={detailRecord.role} readOnly size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.status")}>
                  <Input value={detailRecord.status === "active" ? t("userManage.active") : t("userManage.inactive")} readOnly size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label={t("userManage.columns.lastLogin")}>
                  <Input value={detailRecord.lastLogin || "-"} readOnly size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
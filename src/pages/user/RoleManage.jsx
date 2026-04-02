import React, { useMemo, useState } from "react";
import { Card, Typography, Space, Button, Modal, Form, Input, Checkbox, message } from "antd";
import {
  PlusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  UserAddOutlined,
  IdcardOutlined,
  CalendarOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const permissionCatalog = [
  { key: "student.view", label: "View Student", icon: <EyeOutlined /> },
  { key: "student.create", label: "Create Student", icon: <UserAddOutlined /> },
  { key: "student.edit", label: "Edit Student", icon: <EditOutlined /> },
  { key: "attendance.list", label: "List Attendance", icon: <UnorderedListOutlined /> },
  { key: "attendance.manage", label: "Manage Attendance", icon: <CalendarOutlined /> },
  { key: "academic.view", label: "View Academic", icon: <FileTextOutlined /> },
  { key: "scholarship.list", label: "List Scholarship", icon: <SolutionOutlined /> },
  { key: "enrollment.view", label: "View Enrollment", icon: <IdcardOutlined /> },
  { key: "role.manage", label: "Manage Role", icon: <TeamOutlined /> },
];

const RoleManage = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      key: "admin",
      permissions: [
        "student.view",
        "student.create",
        "student.edit",
        "attendance.list",
        "attendance.manage",
        "academic.view",
        "scholarship.list",
        "enrollment.view",
        "role.manage",
      ],
    },
    {
      id: 2,
      name: "Manager",
      key: "manager",
      permissions: [
        "student.view",
        "student.create",
        "attendance.list",
        "academic.view",
        "enrollment.view",
      ],
    },
    {
      id: 3,
      name: "Editor",
      key: "editor",
      permissions: ["student.view", "student.edit", "attendance.list", "academic.view"],
    },
    {
      id: 4,
      name: "Viewer",
      key: "viewer",
      permissions: ["student.view", "attendance.list", "academic.view"],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => {
    form.resetFields();
    form.setFieldsValue({ permissions: [] });
    setModalOpen(true);
  };

  const handleSave = (values) => {
    const payload = {
      ...values,
      key: String(values.key || "").trim().toLowerCase(),
      permissions: values.permissions || [],
    };

    setRoles((prev) => [...prev, { id: Date.now(), ...payload }]);
    message.success("Role created");
    setModalOpen(false);
  };

  const permissionOptions = useMemo(
    () =>
      permissionCatalog.map((item) => ({
        value: item.key,
        label: (
          <span className="role-perm-option-label">
            {item.icon}
            <span>{item.label}</span>
          </span>
        ),
      })),
    []
  );

  const permissionLabelMap = useMemo(
    () => Object.fromEntries(permissionCatalog.map((item) => [item.key, item.label])),
    []
  );

  const updateRolePermissions = (roleId, permissions) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === roleId ? { ...role, permissions: permissions || [] } : role))
    );
  };

  return (
    <div className="user-container role-manage-page">
      <div className="user-wrapper">
        <div className="role-header-bar">
          <Title level={2} className="role-title">Roles</Title>
          <Button
            type="text"
            className="role-add-btn"
            icon={<PlusCircleOutlined />}
            onClick={() => openModal()}
            aria-label="Add role"
          />
        </div>

        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {roles.map((role) => (
            <Card key={role.id} className="user-card-main role-manage-card role-card-item" bordered={false}>
              <div className="role-card-head">
                <div>
                  <Text className="role-name-text">{role.name}</Text>
                  <Text type="secondary" className="role-key-text">@{role.key}</Text>
                </div>
                <Text className="role-permission-count">{role.permissions.length} permissions</Text>
              </div>

              <Form layout="vertical" className="role-inline-form">
                <Form.Item label="Permission Set" style={{ marginBottom: 0 }}>
                  <Checkbox.Group
                    options={permissionOptions}
                    value={role.permissions}
                    onChange={(vals) => updateRolePermissions(role.id, vals)}
                    className="role-permission-grid"
                  />
                </Form.Item>
                <div className="role-permission-summary">
                  Enabled: {role.permissions.map((key) => permissionLabelMap[key]).filter(Boolean).join(", ") || "No permissions selected"}
                </div>
              </Form>
            </Card>
          ))}
        </Space>
      </div>

      <Modal
        title="Create Role"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        centered
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Role name is required" }]}> 
            <Input placeholder="e.g. Registrar" />
          </Form.Item>

          <Form.Item
            name="key"
            label="Role Key"
            rules={[{ required: true, message: "Role key is required" }]}
            extra="Use lowercase key for internal role mapping"
          >
            <Input placeholder="e.g. registrar" />
          </Form.Item>

          <Form.Item name="permissions" label="Permissions" rules={[{ required: true, message: "Select at least one permission" }]}> 
            <Checkbox.Group className="role-permission-list">
              <Space direction="vertical" style={{ width: "100%" }}>
                {permissionCatalog.map((permission) => (
                  <Checkbox key={permission.key} value={permission.key}>
                    {permission.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManage;

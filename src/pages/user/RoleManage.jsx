import React, { useMemo, useState } from "react";
import { Card, Typography, Table, Tag, Space, Button, Modal, Form, Input, Checkbox, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const permissionList = [
  "student.view",
  "student.create",
  "student.edit",
  "academic.view",
  "scholarship.manage",
  "enrollment.manage",
  "attendant.manage",
  "user.manage",
  "role.manage",
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
        "academic.view",
        "scholarship.manage",
        "enrollment.manage",
        "attendant.manage",
        "user.manage",
        "role.manage",
      ],
    },
    {
      id: 2,
      name: "Assistant",
      key: "assistant",
      permissions: [
        "student.view",
        "student.create",
        "academic.view",
        "scholarship.manage",
        "enrollment.manage",
        "attendant.manage",
      ],
    },
    {
      id: 3,
      name: "Viewer",
      key: "viewer",
      permissions: ["student.view", "academic.view"],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        name: record.name,
        key: record.key,
        permissions: record.permissions,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ permissions: [] });
    }
    setModalOpen(true);
  };

  const handleSave = (values) => {
    if (editingId) {
      setRoles((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...values } : r)));
      message.success("Role updated");
    } else {
      setRoles((prev) => [...prev, { id: Date.now(), ...values }]);
      message.success("Role created");
    }
    setModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        title: "Role Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Role Key",
        dataIndex: "key",
        key: "key",
        render: (value) => <Tag color="blue">{value.toUpperCase()}</Tag>,
      },
      {
        title: "Permissions",
        dataIndex: "permissions",
        key: "permissions",
        render: (permissions) => `${permissions.length} permissions`,
      },
      {
        title: "Action",
        key: "action",
        align: "right",
        render: (_, record) => (
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="user-container">
      <div className="user-wrapper">
        <div className="user-header-section">
          <div>
            <Title level={4} style={{ margin: 0 }}>Role Management</Title>
            <Text type="secondary">Create roles and assign page/action permissions.</Text>
          </div>
          <Button style={{ backgroundColor: "#070f7a", color: "white" }} size="large" icon={<PlusOutlined />} onClick={() => openModal()}>
            Add Role
          </Button>
        </div>

        <Card className="user-card-main" bordered={false}>
          <Table dataSource={roles} columns={columns} rowKey="id" pagination={{ pageSize: 6 }} />
        </Card>
      </div>

      <Modal
        title={editingId ? "Update Role" : "Create Role"}
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
            <Checkbox.Group>
              <Space direction="vertical" style={{ width: "100%" }}>
                {permissionList.map((permission) => (
                  <Checkbox key={permission} value={permission}>
                    {permission}
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

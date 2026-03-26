import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, Card } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);

  // Initial Data
  const [users, setUsers] = useState([
    { id: 1, name: "Sok Rathana", email: "rathana@cumt.edu.kh", role: "assistant", status: "active" },
    { id: 2, name: "Kiri Vannak", email: "vannak@cumt.edu.kh", role: "admin", status: "active" },
  ]);

  const showModal = (record = null) => {
    if (record) {
      setEditingKey(record.id);
      form.setFieldsValue(record); 
    } else {
      setEditingKey(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = (values) => {
    if (editingKey) {
      setUsers(users.map(u => u.id === editingKey ? { ...u, ...values } : u));
      message.success("User updated successfully");
    } else {
      const newUser = { ...values, id: Date.now(), status: "active" };
      setUsers([...users, newUser]);
      message.success("User account created successfully.");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      onOk: () => {
        setUsers(users.filter(u => u.id !== id));
        message.error("User removed");
      },
    });
  };

  const columns = [
    { 
      title: "Full Name", 
      dataIndex: "name", // Fixed from dataKey to dataIndex
      key: "name", 
      render: (text) => <b>{text}</b> 
    },
    { 
      title: "Email / Username", 
      dataIndex: "email", 
      key: "email" 
    },
    { 
      title: "Role", 
      dataIndex: "role", 
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "gold" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ) 
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => showModal(record)} 
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />} 
            onClick={() => handleDelete(record.id)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card 
        title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>User Management</span>} 
        extra={
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={() => showModal()}
            style={{ borderRadius: '6px' }}
          >
            Add New User
          </Button>
        }
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(17, 13, 237, 0.05)' }}
      >
        <Table 
          dataSource={users} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 10}}
        />
      </Card>

      <Modal
        title={editingKey ? "Edit User Information" : "Create New User Account"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Save Changes"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: '16px' }}>
          <Form.Item 
            name="name" 
            label="Full Name" 
            rules={[{ required: true, message: 'Please enter the full name' }]}
          >
            <Input placeholder="e.g. Sok Rathana" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email / Username" 
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
          >
            <Input placeholder="example@cumt.edu.kh" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label={editingKey ? "New Password (Optional)" : "Temporary Password"} 
            rules={[{ required: !editingKey, message: 'Please set a password' }]}
          >
            <Input.Password placeholder="Min. 6 characters" />
          </Form.Item>

          <Form.Item name="role" label="Role" initialValue="assistant">
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="assistant">Assistant</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
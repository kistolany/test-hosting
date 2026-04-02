import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Space, Tag, message, Card, Typography, Divider, Upload } from "antd";
import { UserAddOutlined, EditFilled, DeleteFilled, UserOutlined, MailOutlined, LockOutlined, PlusOutlined, CameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  const [users, setUsers] = useState([
    { id: 1, name: "Sok Rathana", email: "rathana@cumt.edu.kh", role: "assistant", image: null, password: "hashed_password" },
    { id: 2, name: "Kiri Vannak", email: "vannak@cumt.edu.kh", role: "admin", image: null, password: "hashed_password" },
  ]);

  const showModal = (record = null) => {
    if (record) {
      setEditingKey(record.id);
      setTempImage(record.image);
      form.setFieldsValue({ ...record, password: "" }); // Don't show old password for security
    } else {
      setEditingKey(null);
      setTempImage(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = (values) => {
    const userData = { 
      ...values, 
      image: tempImage, // Base64 or Blob URL
      status: "active" 
    };

    if (editingKey) {
      setUsers(users.map(u => u.id === editingKey ? { ...u, ...userData } : u));
      message.success("User updated successfully");
    } else {
      setUsers([...users, { ...userData, id: Date.now() }]);
      message.success("New user account created");
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setTempImage(e.target.result);
      reader.readAsDataURL(file); // Converts to Base64 for static display
    }
  };

  const columns = [
    {
      title: "User Profile",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size="middle">
          <div className="user-avatar-wrapper">
            {record.image ? (
              <img src={record.image} className="user-avatar-img" alt="profile" />
            ) : (
              <UserOutlined style={{ fontSize: '18px', color: '#060ea4' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      )
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag className="user-role-tag" color={role === "admin" ? "gold" : "cyan"}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditFilled />} onClick={() => showModal(record)}>Edit</Button>
          <Divider type="vertical" />
          <Button type="link" danger icon={<DeleteFilled />} onClick={() => {}}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-container">
      <div className="user-wrapper">
        <div className="user-header-section">
          <div>
            <Title level={4} style={{ margin: 0 }}>Staff Accounts</Title>
            <Text type="secondary">Create and manage login credentials for CUMT staff.</Text>
          </div>
          <Button style={{ backgroundColor:'#070f7a',color:'white' }} size="large" icon={<UserAddOutlined />} onClick={() => showModal()}>
            Add User
          </Button>
        </div>

        <Card className="user-card-main" bordered={false}>
          <Table dataSource={users} columns={columns} rowKey="id" pagination={{ pageSize: 6 }} />
        </Card>
      </div>

      <Modal
        title={editingKey ? "Update User Account" : "Register New Admin/Assistant"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={450}
        centered
        okText={editingKey ? "Save Changes" : "Create Account"}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: '20px' }}>
          
          {/* Static Image Upload Preview */}
          <div className="user-upload-group">
            <Upload
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => false} 
              onChange={handleImageChange}
            >
              {tempImage ? (
                <img src={tempImage} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <CameraOutlined style={{ fontSize: '20px' }} />
                  <div style={{ marginTop: 4 }}>Photo</div>
                </div>
              )}
            </Upload>
            <Text type="secondary">Upload Profile Picture</Text>
          </div>

          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Required' }]}>
            <Input prefix={<UserOutlined />} placeholder="e.g., Chan Sopheak" size="large" />
          </Form.Item>
          
          <Form.Item name="email" label="Email / Username" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="username@cumt.edu.kh" size="large" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: !editingKey, message: 'Please set a password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>
          {editingKey && <Text className="user-form-password-note">Leave blank to keep current password.</Text>}

          <Form.Item name="role" label="Role" initialValue="assistant" style={{ marginTop: 16 }}>
            <Select size="large">
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
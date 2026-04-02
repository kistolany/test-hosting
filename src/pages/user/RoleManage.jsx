import React, { useMemo, useState } from "react";
import { Card, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { CheckOutlined, CloseOutlined, SafetyOutlined, TeamOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { pushAuditLog } from "../../utils/auditLogs";

const permissionColumns = ["VIEW", "CREATE", "EDIT", "DELETE", "APPROVE", "EXPORT"];
const defaultModules = ["Dashboard", "Products", "Orders", "Customers", "Inventory", "Reports", "Users", "Settings"];

const initialRoleCards = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all modules and settings.",
    users: 1,
    modules: [
      { name: "Dashboard", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Products", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Orders", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Customers", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Inventory", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Reports", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Users", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Settings", permissions: [1, 1, 1, 1, 1, 1] },
    ],
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description: "Manage products, categories, and brands.",
    users: 1,
    modules: [
      { name: "Dashboard", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Products", permissions: [1, 1, 1, 1, 0, 1] },
      { name: "Orders", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Customers", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Inventory", permissions: [1, 1, 1, 0, 0, 1] },
      { name: "Reports", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Users", permissions: [0, 0, 0, 0, 0, 0] },
      { name: "Settings", permissions: [0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "sales-manager",
    name: "Sales Manager",
    description: "Oversee orders, customers, and sales reporting.",
    users: 2,
    modules: [
      { name: "Dashboard", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Products", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Orders", permissions: [1, 1, 1, 1, 1, 1] },
      { name: "Customers", permissions: [1, 1, 1, 0, 0, 1] },
      { name: "Inventory", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Reports", permissions: [1, 0, 0, 0, 1, 1] },
      { name: "Users", permissions: [0, 0, 0, 0, 0, 0] },
      { name: "Settings", permissions: [0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "support",
    name: "Support",
    description: "Handle customer issues and monitor order status.",
    users: 3,
    modules: [
      { name: "Dashboard", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Products", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Orders", permissions: [1, 0, 1, 0, 0, 0] },
      { name: "Customers", permissions: [1, 0, 1, 0, 0, 0] },
      { name: "Inventory", permissions: [0, 0, 0, 0, 0, 0] },
      { name: "Reports", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Users", permissions: [0, 0, 0, 0, 0, 0] },
      { name: "Settings", permissions: [0, 0, 0, 0, 0, 0] },
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to dashboard and reports.",
    users: 4,
    modules: [
      { name: "Dashboard", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Products", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Orders", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Customers", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Inventory", permissions: [1, 0, 0, 0, 0, 0] },
      { name: "Reports", permissions: [1, 0, 0, 0, 0, 1] },
      { name: "Users", permissions: [0, 0, 0, 0, 0, 0] },
      { name: "Settings", permissions: [0, 0, 0, 0, 0, 0] },
    ],
  },
];

const RoleManage = () => {
  const [roles, setRoles] = useState(initialRoleCards);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleForm] = Form.useForm();

  const editingRole = useMemo(() => roles.find((role) => role.id === editingRoleId) || null, [roles, editingRoleId]);

  const openCreateRole = () => {
    setEditingRoleId(null);
    roleForm.resetFields();
    roleForm.setFieldsValue({ users: 1 });
    setRoleModalOpen(true);
  };

  const openEditRole = (role) => {
    setEditingRoleId(role.id);
    roleForm.setFieldsValue({
      name: role.name,
      description: role.description,
      users: role.users,
    });
    setRoleModalOpen(true);
  };

  const handleSaveRole = async () => {
    try {
      const values = await roleForm.validateFields();

      if (!editingRoleId) {
        const newRole = {
          id: `role-${Date.now()}`,
          name: values.name,
          description: values.description,
          users: values.users,
          modules: defaultModules.map((name) => ({
            name,
            permissions: [0, 0, 0, 0, 0, 0],
          })),
        };
        setRoles((prev) => [...prev, newRole]);
        pushAuditLog({
          action: "Create",
          module: "Roles",
          description: `Created role ${values.name}.`,
          after: JSON.stringify({
            role: values.name,
            users: values.users,
          }),
        });
        message.success("Role created successfully");
      } else {
        const previous = editingRole
          ? {
              name: editingRole.name,
              description: editingRole.description,
              users: editingRole.users,
            }
          : null;

        setRoles((prev) =>
          prev.map((role) =>
            role.id === editingRoleId
              ? {
                  ...role,
                  name: values.name,
                  description: values.description,
                  users: values.users,
                }
              : role
          )
        );
        pushAuditLog({
          action: "Update",
          module: "Roles",
          description: `Updated role ${values.name}.`,
          before: previous ? JSON.stringify(previous) : null,
          after: JSON.stringify({
            name: values.name,
            description: values.description,
            users: values.users,
          }),
        });
        message.success("Role updated successfully");
      }

      setRoleModalOpen(false);
      roleForm.resetFields();
      setEditingRoleId(null);
    } catch (error) {
      // Form validation handles message display.
    }
  };

  const togglePermission = (roleId, moduleName, permissionIndex) => {
    const targetRole = roles.find((role) => role.id === roleId);
    const targetModule = targetRole?.modules.find((module) => module.name === moduleName);
    const previousValue = targetModule?.permissions?.[permissionIndex] ? 1 : 0;

    setRoles((prev) =>
      prev.map((role) => {
        if (role.id !== roleId) return role;
        return {
          ...role,
          modules: role.modules.map((module) => {
            if (module.name !== moduleName) return module;
            const next = [...module.permissions];
            next[permissionIndex] = next[permissionIndex] ? 0 : 1;
            return { ...module, permissions: next };
          }),
        };
      })
    );

    pushAuditLog({
      action: "Update",
      module: "Roles",
      description: `Updated ${permissionColumns[permissionIndex]} permission for ${moduleName} in role ${targetRole?.name || "Unknown"}.`,
      before: JSON.stringify({
        module: moduleName,
        permission: permissionColumns[permissionIndex],
        enabled: Boolean(previousValue),
      }),
      after: JSON.stringify({
        module: moduleName,
        permission: permissionColumns[permissionIndex],
        enabled: !Boolean(previousValue),
      }),
    });
  };

  return (
    <div className="user-container role-manage-page rolev2-page">
      <div className="user-wrapper">
        <div className="rolev2-toolbar">
          <Button type="primary" className="rolev2-add-btn" icon={<PlusOutlined />} onClick={openCreateRole}>
            Create Role
          </Button>
        </div>

        <div className="rolev2-stack">
          {roles.map((role) => (
            <Card key={role.id} className="rolev2-card" bordered={false}>
              <div className="rolev2-head">
                <div className="rolev2-head-main">
                  <span className="rolev2-shield"><SafetyOutlined /></span>
                  <div>
                    <h3 className="rolev2-title">{role.name}</h3>
                    <p className="rolev2-subtitle">{role.description}</p>
                  </div>
                </div>
                <div className="rolev2-head-actions">
                  <span className="rolev2-user-badge">
                    <TeamOutlined /> {role.users} {role.users > 1 ? "users" : "user"}
                  </span>
                  <Button type="text" className="rolev2-edit-btn" icon={<EditOutlined />} onClick={() => openEditRole(role)}>
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rolev2-table-wrap">
                <table className="rolev2-table">
                  <thead>
                    <tr>
                      <th>MODULE</th>
                      {permissionColumns.map((column) => (
                        <th key={`${role.id}-${column}`}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {role.modules.map((module) => (
                      <tr key={`${role.id}-${module.name}`}>
                        <td>{module.name}</td>
                        {module.permissions.map((canAccess, index) => (
                          <td key={`${role.id}-${module.name}-${permissionColumns[index]}`}>
                            <button
                              type="button"
                              className={`rolev2-perm-btn ${canAccess ? "is-on" : "is-off"}`}
                              onClick={() => togglePermission(role.id, module.name, index)}
                              aria-label={`${permissionColumns[index]} ${module.name}`}
                            >
                              {canAccess ? (
                                <CheckOutlined className="rolev2-check" />
                              ) : (
                                <CloseOutlined className="rolev2-cross" />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title={editingRole ? "Update Role" : "Create Role"}
        open={roleModalOpen}
        onCancel={() => {
          setRoleModalOpen(false);
          setEditingRoleId(null);
          roleForm.resetFields();
        }}
        onOk={handleSaveRole}
        okText={editingRole ? "Update" : "Create"}
      >
        <Form form={roleForm} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Please input role name" }]}> 
            <Input placeholder="Example: Sales Manager" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input role description" }]}> 
            <Input placeholder="Example: Manage sales operations" />
          </Form.Item>

          <Form.Item name="users" label="Users" rules={[{ required: true, message: "Please input total users" }]}> 
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManage;

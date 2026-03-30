import React from "react";
import { Card, Table, Tag, Typography } from "antd";

const { Title, Text } = Typography;

const columns = [
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    width: 220,
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    width: 180,
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 120,
    render: (value) => {
      const color = value === "security" ? "red" : value === "update" ? "blue" : "gold";
      return <Tag color={color}>{String(value).toUpperCase()}</Tag>;
    },
  },
];

const data = [
  {
    key: 1,
    time: "2026-03-30 08:15",
    user: "admin",
    action: "Updated role permissions for Assistant",
    type: "update",
  },
  {
    key: 2,
    time: "2026-03-30 08:30",
    user: "admin",
    action: "Created new user account for registrar",
    type: "create",
  },
  {
    key: 3,
    time: "2026-03-30 08:41",
    user: "system",
    action: "User logout from unknown device",
    type: "security",
  },
];

const AuditLog = () => {
  return (
    <div className="user-container">
      <div className="user-wrapper">
        <div className="user-header-section">
          <div>
            <Title level={4} style={{ margin: 0 }}>Audit Log</Title>
            <Text type="secondary">Track account, role, and security events.</Text>
          </div>
        </div>

        <Card className="user-card-main" bordered={false}>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} rowKey="key" />
        </Card>
      </div>
    </div>
  );
};

export default AuditLog;

import React from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const ProfileSettings = () => {
  return (
    <Card bordered={false}>
      <Title level={4} style={{ marginTop: 0 }}>Settings</Title>
      <Text type="secondary">
        Configure account and profile settings here.
      </Text>
    </Card>
  );
};

export default ProfileSettings;

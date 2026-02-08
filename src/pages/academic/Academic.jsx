import React, { useState } from 'react';
import { Button, Flex, Table, Tag, Card, Modal, Form, Input, Select, Row, Col, ConfigProvider } from 'antd';
import { UserOutlined, BookOutlined, ReadOutlined, SaveOutlined } from '@ant-design/icons';

const PRIMARY_COLOR = '#070f7a';

const Academic = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setActiveModal(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log(`Submitted ${activeModal}:`, values);
    handleCancel();
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: PRIMARY_COLOR } }}>
      <Flex justify="center" align="flex-start" style={{  padding: '50px 20px' }}>
        <Card 
          bordered={false}
          style={{ width: '100%', maxWidth: 1000, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginTop: '50px' }}
        >
          <Flex gap="middle" wrap="wrap" style={{ marginBottom: 30 }}>
            <Button type="primary" ghost icon={<UserOutlined />} block size="large" style={{ flex: '1 1 150px' }} onClick={() => setActiveModal('faculty')}>Faculty</Button>
            <Button type="primary" ghost icon={<BookOutlined />} block size="large" style={{ flex: '1 1 150px' }} onClick={() => setActiveModal('major')}>Major</Button>
            <Button type="primary" ghost icon={<ReadOutlined />} block size="large" style={{ flex: '1 1 150px' }} onClick={() => setActiveModal('subject')}>Subject</Button>
          </Flex>

          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false} 
            expandable={{ defaultExpandAllRows: true, indentSize: 20 }} 
            bordered 
            size="middle"
          />
          <Modal
            title={<span style={{ color: PRIMARY_COLOR }}>Add New {activeModal?.toUpperCase()}</span>}
            open={activeModal !== null}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
          >
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '20px' }}>
              
              {(activeModal === 'major' || activeModal === 'subject') && (
                <Form.Item name="faculty" label="Select Faculty" rules={[{ required: true }]}>
                  <Select placeholder="Choose Faculty">
                    <Select.Option value="science">Science</Select.Option>
                    <Select.Option value="business">Business</Select.Option>
                  </Select>
                </Form.Item>
              )}

              {activeModal === 'subject' && (
                <Form.Item name="major" label="Select Major" rules={[{ required: true }]}>
                  <Select placeholder="Choose Major">
                    <Select.Option value="cs">Computer Science</Select.Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item 
                name="name" 
                label={`${activeModal?.charAt(0).toUpperCase() + activeModal?.slice(1)} Name`} 
                rules={[{ required: true }]}
              >
                <Input placeholder={`Enter ${activeModal} name`} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Button onClick={handleCancel} style={{ marginRight: '8px' }}>Cancel</Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: PRIMARY_COLOR }}>
                  Save {activeModal}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

// Static columns and data from your previous snippet
const columns = [
  {
    title: 'Academic Structure',
    dataIndex: 'name',
    key: 'name',
    render: (text, { level }) => (
      <span style={{ fontWeight: level === 'faculty' ? '700' : '500', fontSize: level === 'faculty' ? '15px' : '14px' }}>{text}</span>
    ),
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    width: 120,
    align: 'center',
    render: (tag) => {
      const colors = { faculty: 'blue', major: 'geekblue', subject: 'green' };
      return <Tag color={colors[tag]} style={{ width: '85px', textAlign: 'center', fontWeight: '600' }}>{tag.toUpperCase()}</Tag>;
    },
  },
];

const data = [
  {
    key: '1', name: 'Faculty of Science', level: 'faculty',
    children: [{
      key: '1-1', name: 'Computer Science', level: 'major',
      children: [{ key: '1-1-1', name: 'React Development', level: 'subject' }]
    }]
  }
];

export default Academic;
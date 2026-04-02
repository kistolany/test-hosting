import React, { useState } from 'react';
import { 
  Button, Flex, Table, Tag, Card, Modal, Form, 
  Input, Select, ConfigProvider, Space, Popconfirm, Typography
} from 'antd';
import { 
  UserOutlined, BookOutlined, ReadOutlined, 
  TeamOutlined, SaveOutlined, EditFilled, DeleteFilled 
} from '@ant-design/icons';
import { pushAuditLog } from '../../utils/auditLogs';

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const Academic = () => {
  const [activeModal, setActiveModal] = useState(null); 
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'Faculty of Science',
      level: 'faculty',
      children: [
        {
          key: '1-1',
          name: 'Computer Science',
          level: 'major',
          children: [
            { 
              key: '1-1-1', 
              name: 'Web Dev', 
              level: 'subject', 
              year: 1, 
              semester: 2
            }
          ]
        }
      ]
    },
  ]);

  const handleCancel = () => {
    setActiveModal(null);
    setEditingRecord(null);
    form.resetFields();
  };

  const onEdit = (record) => {
    setEditingRecord(record);
    setActiveModal(record.level);
    form.setFieldsValue(record); 
  };

  const onDelete = (key) => {
    const target = dataSource.find((item) => item.key === key) || null;
    const deleteRecursive = (data) => data
      .filter(item => item.key !== key)
      .map(item => item.children ? { ...item, children: deleteRecursive(item.children) } : item);
    setDataSource(deleteRecursive(dataSource));
    pushAuditLog({
      action: "Delete",
      module: "Academic",
      description: `Deleted academic record ${target?.name || key}.`,
      before: target ? JSON.stringify(target) : JSON.stringify({ key }),
      after: null,
    });
  };

  const onFinish = (values) => {
    if (editingRecord) {
      const before = editingRecord;
      const updateRecursive = (data) => data.map(item => {
        if (item.key === editingRecord.key) return { ...item, ...values, name: activeModal === 'class' ? values.room : values.name };
        if (item.children) return { ...item, children: updateRecursive(item.children) };
        return item;
      });
      setDataSource(updateRecursive(dataSource));
      pushAuditLog({
        action: "Update",
        module: "Academic",
        description: `Updated academic record ${before?.name || editingRecord.key}.`,
        before: JSON.stringify(before),
        after: JSON.stringify({ ...before, ...values, name: activeModal === 'class' ? values.room : values.name }),
      });
    } else {
      const newKey = Date.now().toString();
      const finalName = activeModal === 'class' ? values.room : values.name;
      setDataSource([...dataSource, { ...values, name: finalName, key: newKey, level: activeModal }]);
    }
    handleCancel();
  };

  const columns = [
    { 
      title: 'Academic Name',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      render: (text, record) => <Text strong={record.level === 'faculty'}>{text}</Text>
    },
    { 
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level) => {
        const colors = { faculty: 'blue', major: 'geekblue', subject: 'green', class: 'purple' };
        return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 120,
      filters: [1, 2, 3, 4].map(y => ({ text: `Year ${y}`, value: y })),
      onFilter: (value, record) => {
        if (record.level === 'subject') {
          return record.year === value;
        }
        return true; // Keep Faculty/Major visible when filtering
      },
      render: (year, record) => (record.level === 'subject') ? (year ? `Year ${year}` : '-') : '-'
    },
    { 
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      width: 120,
      filters: [
        { text: 'Sem 1', value: 1 },
        { text: 'Sem 2', value: 2 },
      ],
      onFilter: (value, record) => {
        if (record.level === 'subject') {
          return record.semester === value;
        }
        return true; // Keep Faculty/Major visible when filtering
      },
      render: (sem, record) => (record.level === 'subject') ? (sem ? `Sem ${sem}` : '-') : '-'
    },
    { 
      title: 'Action',
      key: 'operation',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="text" icon={<EditFilled />} onClick={() => onEdit(record)} />
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.key)}>
            <Button size="small" type="text" danger icon={<DeleteFilled />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: PRIMARY_COLOR } }}>
      <Flex justify="center" align="flex-start" style={{ padding: '30px 10px' }}>
        <Card bordered={false} style={{ width: '100%', maxWidth: 1100, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <Flex gap="small" wrap="wrap" style={{ marginBottom: 20 }}>
            <Button className='ant-btn-head' type="primary" ghost icon={<UserOutlined />} onClick={() => setActiveModal('faculty')}>+ Faculty</Button>
            <Button className='ant-btn-head' type="primary" ghost icon={<BookOutlined />} onClick={() => setActiveModal('major')}>+ Major</Button>
            <Button className='ant-btn-head' type="primary" ghost icon={<ReadOutlined />} onClick={() => setActiveModal('subject')}>+ Subject</Button>
            <Button className='ant-btn-head' type="primary" ghost icon={<TeamOutlined />} onClick={() => setActiveModal('class')}>+ Class</Button>
          </Flex>

          <Table 
            size="large" 
            columns={columns} 
            dataSource={dataSource} 
            bordered 
            expandable={{ defaultExpandAllRows: true }} 
            pagination={false} 
            scroll={{ x: 'max-content' }} 
          />

          <Modal 
            title={`${editingRecord ? 'Edit' : 'Add New'} ${activeModal?.toUpperCase()}`} 
            open={activeModal !== null} 
            onCancel={handleCancel} 
            footer={null} 
            destroyOnClose
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>
              {activeModal === 'major' && (
                <Form.Item name="faculty" label="Faculty" rules={[{ required: true }]}>
                  <Select placeholder="Choose Faculty">
                    <Select.Option value="science">Science</Select.Option>
                  </Select>
                </Form.Item>
              )}

              {activeModal === 'subject' && (
                <>
                  <Form.Item name="faculty" label="Faculty" rules={[{ required: true }]}>
                    <Select placeholder="Choose Faculty">
                      <Select.Option value="science">Science</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="major" label="Major" rules={[{ required: true }]}>
                    <Select placeholder="Choose Major">
                      <Select.Option value="cs">Computer Science</Select.Option>
                    </Select>
                  </Form.Item>
                  <Flex gap={10}>
                    <Form.Item name="year" label="Year" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select placeholder="Select Year" options={[1, 2, 3, 4].map(y => ({ label: `Year ${y}`, value: y }))} />
                    </Form.Item>
                    <Form.Item name="semester" label="Semester" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select placeholder="Select Sem" options={[{ label: 'Sem 1', value: 1 }, { label: 'Sem 2', value: 2 }]} />
                    </Form.Item>
                  </Flex>
                </>
              )}

              {activeModal === 'class' ? (
                <>
                  <Flex gap={10}>
                  </Flex>
                  <Form.Item name="room" label="Room" rules={[{ required: true }]}>
                    <Input placeholder="Enter Room (e.g. Room 302)" />
                  </Form.Item>
                </>
              ) : (
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input placeholder={`Enter ${activeModal} name`} />
                </Form.Item>
              )}

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </Flex>
    </ConfigProvider>
  );
};

export default Academic;
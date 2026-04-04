import React, { useMemo, useState } from 'react';
import { 
  Button, Flex, Table, Tag, Card, Modal, Form, 
  Input, Select, ConfigProvider, Space, Popconfirm, Typography
} from 'antd';
import { 
  UserOutlined, BookOutlined, ReadOutlined, 
  SaveOutlined, EditFilled, DeleteFilled 
} from '@ant-design/icons';
import { pushAuditLog } from '../../utils/auditLogs';

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';
const YEAR_OPTIONS = [1, 2, 3, 4].map((year) => ({ label: `Year ${year}`, value: year }));
const SHIFT_OPTIONS = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Evening', value: 'Evening' },
  { label: 'Sunday-Saturday', value: 'Sunday-Saturday' },
];
const SEMESTER_OPTIONS = [
  { label: 'Sem 1', value: 1 },
  { label: 'Sem 2', value: 2 },
];

const SELECT_WITH_SEARCH_PROPS = {
  showSearch: true,
  optionFilterProp: 'label',
  filterOption: (input, option) => `${option?.label ?? ''}`.toLowerCase().includes(input.toLowerCase()),
};

const buildHierarchyOptions = (items) => {
  const facultiesMap = new Map();
  const majorsMap = new Map();

  const walk = (nodes, activeFaculty = null) => {
    nodes.forEach((node) => {
      const nodeName = node.name?.trim();
      const nextFaculty = node.level === 'faculty' ? nodeName : activeFaculty;

      if (node.level === 'faculty' && nodeName) {
        facultiesMap.set(nodeName, { label: nodeName, value: nodeName });
      }

      if (node.level === 'major' && nodeName) {
        majorsMap.set(nodeName, {
          label: nodeName,
          value: nodeName,
          faculty: node.faculty || nextFaculty || null,
        });
      }

      if (Array.isArray(node.children) && node.children.length > 0) {
        walk(node.children, nextFaculty);
      }
    });
  };

  walk(items);

  return {
    faculties: Array.from(facultiesMap.values()),
    majors: Array.from(majorsMap.values()),
  };
};

const Academic = () => {
  const [activeModal, setActiveModal] = useState(null); 
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const selectedFaculty = Form.useWatch('faculty', form);

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
          year: 1,
          shift: 'Morning',
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

  const { faculties, majors } = useMemo(() => buildHierarchyOptions(dataSource), [dataSource]);

  const facultyOptions = useMemo(
    () => (faculties.length > 0 ? faculties : [{ label: 'Faculty of Science', value: 'Faculty of Science' }]),
    [faculties]
  );

  const subjectMajorOptions = useMemo(() => {
    const allMajors = majors.map(({ faculty, ...majorOption }) => majorOption);

    if (!selectedFaculty) {
      return allMajors;
    }

    const filteredByFaculty = majors
      .filter((major) => !major.faculty || major.faculty === selectedFaculty)
      .map(({ faculty, ...majorOption }) => majorOption);

    return filteredByFaculty.length > 0 ? filteredByFaculty : allMajors;
  }, [majors, selectedFaculty]);

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
        if (item.key === editingRecord.key) return { ...item, ...values, name: values.name };
        if (item.children) return { ...item, children: updateRecursive(item.children) };
        return item;
      });
      setDataSource(updateRecursive(dataSource));
      pushAuditLog({
        action: "Update",
        module: "Academic",
        description: `Updated academic record ${before?.name || editingRecord.key}.`,
        before: JSON.stringify(before),
        after: JSON.stringify({ ...before, ...values, name: values.name }),
      });
    } else {
      const newKey = Date.now().toString();
      const finalName = values.name;
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
        const colors = { faculty: 'blue', major: 'geekblue', subject: 'green' };
        return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
      }
    },
    { 
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 120,
      filters: YEAR_OPTIONS.map(({ label, value }) => ({ text: label, value })),
      onFilter: (value, record) => {
        if (record.level === 'major' || record.level === 'subject') {
          return record.year === value;
        }
        return true; // Keep Faculty/Major visible when filtering
      },
      render: (year, record) => (record.level === 'major' || record.level === 'subject') ? (year ? `Year ${year}` : '-') : '-'
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width: 150,
      filters: [
        { text: 'Morning', value: 'Morning' },
        { text: 'Evening', value: 'Evening' },
        { text: 'Sunday-Saturday', value: 'Sunday-Saturday' },
      ],
      onFilter: (value, record) => {
        if (record.level === 'major') {
          return record.shift === value;
        }
        return true;
      },
      render: (shift, record) => (record.level === 'major') ? (shift || '-') : '-'
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
          <Button
            size="small"
            type="text"
            className="academic-edit-btn"
            icon={<EditFilled />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.key)}>
            <Button size="small" type="text" danger icon={<DeleteFilled />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: PRIMARY_COLOR } }}>
      <div style={{ width: '100%', padding: 0, boxSizing: 'border-box' }}>
        <Card
          bordered={false}
          styles={{ body: { padding: 0 } }}
          style={{
            width: '100%',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}
        >
          <Flex gap="small" wrap="wrap" style={{ marginBottom: 20 }}>
            <Button className='ant-btn-head' type="primary" ghost icon={<UserOutlined />} onClick={() => setActiveModal('faculty')}>+ Faculty</Button>
            <Button className='ant-btn-head' type="primary" ghost icon={<BookOutlined />} onClick={() => setActiveModal('major')}>+ Major</Button>
            <Button className='ant-btn-head' type="primary" ghost icon={<ReadOutlined />} onClick={() => setActiveModal('subject')}>+ Subject</Button>
          </Flex>

          <Table 
            className="academic-table"
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
                <>
                  <Form.Item name="faculty" label="Faculty" rules={[{ required: true }]}>
                    <Select
                      placeholder="Choose Faculty"
                      options={facultyOptions}
                      {...SELECT_WITH_SEARCH_PROPS}
                    />
                  </Form.Item>
                  <Flex gap={10}>
                    <Form.Item name="year" label="Year" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select placeholder="Select Year" options={YEAR_OPTIONS} {...SELECT_WITH_SEARCH_PROPS} />
                    </Form.Item>
                    <Form.Item name="shift" label="Shift" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select
                        placeholder="Select Shift"
                        options={SHIFT_OPTIONS}
                        {...SELECT_WITH_SEARCH_PROPS}
                      />
                    </Form.Item>
                  </Flex>
                </>
              )}

              {activeModal === 'subject' && (
                <>
                  <Form.Item name="faculty" label="Faculty" rules={[{ required: true }]}>
                    <Select
                      placeholder="Choose Faculty"
                      options={facultyOptions}
                      {...SELECT_WITH_SEARCH_PROPS}
                    />
                  </Form.Item>
                  <Form.Item name="major" label="Major" rules={[{ required: true }]}>
                    <Select
                      placeholder="Choose Major"
                      options={subjectMajorOptions}
                      disabled={subjectMajorOptions.length === 0}
                      {...SELECT_WITH_SEARCH_PROPS}
                    />
                  </Form.Item>
                  <Flex gap={10}>
                    <Form.Item name="year" label="Year" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select placeholder="Select Year" options={YEAR_OPTIONS} {...SELECT_WITH_SEARCH_PROPS} />
                    </Form.Item>
                    <Form.Item name="semester" label="Semester" rules={[{ required: true }]} style={{ flex: 1 }}>
                      <Select placeholder="Select Sem" options={SEMESTER_OPTIONS} {...SELECT_WITH_SEARCH_PROPS} />
                    </Form.Item>
                  </Flex>
                </>
              )}

              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder={`Enter ${activeModal} name`} />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Academic;
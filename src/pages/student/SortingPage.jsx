import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Tooltip,
  message,
  Statistic,
  Modal,
  Descriptions,
  Input,
  Popconfirm,
} from "antd";
import {
  SwapLeftOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SortingPage = () => {
  const navigate = useNavigate();
  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const initialStudents = [
    { 
      key: "1", id: "STU-001", nameKh: "ហេង សុវណ្ណ", nameEn: "Heng Sovann", 
      gender: "M", dob: "2002-05-20", phone: "012 345 678", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1"
    },
    { 
      key: "2", id: "STU-002", nameKh: "លី ម៉ារីណា", nameEn: "Ly Marina", 
      gender: "F", dob: "2003-11-12", phone: "098 765 432", faculty: "law", major: "ba", batch: "21", year: "2", class: "B1"
    },
    { 
      key: "3", id: "STU-003", nameKh: "កែវ វិសាល", nameEn: "Keo Visal", 
      gender: "M", dob: "2001-01-30", phone: "010 111 222", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1"
    },
  ];

  const [waitingStudents, setWaitingStudents] = useState(initialStudents); 
  const [enrolledStudents, setEnrolledStudents] = useState([]); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  // --- UPDATED ENROLL LOGIC WITH VALIDATION ---
  const onEnroll = () => {
    // 1. Check if students are selected
    if (selectedRowKeys.length === 0) {
      message.warning({ content: "សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!", className: "sort-khmer-text" });
      return;
    }

    // 2. Get values from the filter form
    const formValues = filterForm.getFieldsValue();

    // 3. VALIDATION: Check if ALL fields are selected
    if (!formValues.faculty || !formValues.major || !formValues.batch || !formValues.year || !formValues.class) {
      message.error({ 
        content: "សូមជ្រើសរើសព័ត៌មានឱ្យបានគ្រប់គ្រាន់ (មហាវិទ្យាល័យ, ជំនាញ, ជំនាន់, ឆ្នាំ, ថ្នាក់)!", 
        className: "sort-khmer-text",
        style: { marginTop: '10vh' }
      });
      return; // Stop right here
    }

    // 4. If validation passes, move the students
    const moving = waitingStudents
      .filter(s => selectedRowKeys.includes(s.key))
      .map(student => ({
        ...student,
        faculty: formValues.faculty,
        major: formValues.major,
        batch: formValues.batch,
        year: formValues.year,
        class: formValues.class,
      }));

    setEnrolledStudents([...enrolledStudents, ...moving]);
    setWaitingStudents(waitingStudents.filter(s => !selectedRowKeys.includes(s.key)));
    setSelectedRowKeys([]); 
    
    message.success({
      content: `បានបែងចែកនិស្សិត ${moving.length} នាក់រួចរាល់!`,
      className: "sort-khmer-text"
    });
  };

  const handleSearch = (values) => {
    const allKnownStudents = [...initialStudents, ...enrolledStudents];
    const filteredData = allKnownStudents.filter((student) => {
      return (
        (!values.faculty || student.faculty === values.faculty) &&
        (!values.major || student.major === values.major) &&
        (!values.batch || student.batch === values.batch) &&
        (!values.year || student.year === values.year) &&
        (!values.class || student.class === values.class)
      );
    });

    setWaitingStudents(filteredData);
    setEnrolledStudents(prev => prev.filter(e => !filteredData.some(f => f.key === e.key)));
  };

  const handleClear = () => {
    filterForm.resetFields();
    setWaitingStudents(initialStudents.filter(s => !enrolledStudents.some(e => e.key === s.key)));
  };

  const columnTextStyle = { fontSize: '16px', fontWeight: '500' };

  const columns = [
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">អត្តលេខ</Text>,
      dataIndex: "id", key: "id", width: 100,
      render: (text) => <Text style={columnTextStyle}>{text}</Text>
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឈ្មោះខ្មែរ</Text>,
      dataIndex: "nameKh", key: "nameKh",
      render: (text) => <Text style={{ ...columnTextStyle, color: '#070f7a' }}>{text}</Text>
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឈ្មោះឡាតាំង</Text>,
      dataIndex: "nameEn", key: "nameEn",
      render: (text) => <Text style={columnTextStyle}>{text}</Text>
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ភេទ</Text>,
      dataIndex: "gender", key: "gender", width: 80, align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: '14px', padding: '2px 10px' }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ថ្ងៃខែឆ្នាំកំណើត</Text>,
      dataIndex: "dob", key: "dob",
      render: (text) => <Text style={columnTextStyle}>{text}</Text>
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">លេខទូរស័ព្ទ</Text>,
      dataIndex: "phone", key: "phone",
      render: (text) => <Text style={columnTextStyle}>{text}</Text>
    },
    {
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">សកម្មភាព</Text>,
      key: "action", width: 130, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="មើលលម្អិត"><Button type="text" shape="circle" icon={<EyeOutlined style={{ fontSize: '18px' }} />} onClick={() => { setActiveStudent(record); setIsModalOpen(true); }} /></Tooltip>
          <Tooltip title="កែប្រែ"><Button type="text" shape="circle" icon={<EditOutlined style={{ fontSize: '18px' }} />} onClick={() => { setActiveStudent(record); editForm.setFieldsValue(record); setIsEditOpen(true); }} /></Tooltip>
          <Tooltip title="លុប"><Button type="text" shape="circle" danger icon={<DeleteOutlined style={{ fontSize: '18px' }} />} /></Tooltip>
        </Space>
      ),
    },
  ];

  const enrolledColumns = [
    ...columns.slice(0, 4),
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">មហាវិទ្យាល័យ</Text>, dataIndex: "faculty", render: (t) => <Text style={{textTransform: 'uppercase'}}>{t}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ជំនាញ</Text>, dataIndex: "major", render: (t) => <Text style={{textTransform: 'uppercase'}}>{t}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ជំនាន់</Text>, dataIndex: "batch", render: (t) => <Text>{t}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឆ្នាំសិក្សា</Text>, dataIndex: "year", render: (t) => <Text>{t}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ថ្នាក់</Text>, dataIndex: "class", render: (t) => <Text>{t}</Text> },
    columns[6],
  ];

  return (
    <div className="sort-container">
      <div className="sort-header-wrapper">
        <Space size="large">
          <Button type="default" icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <Title className="sort-header-title" level={3}>បញ្ជីឈ្មោះនិស្សិតទាំងអស់</Title>
            <Text type="secondary" className="sort-khmer-text">គ្រប់គ្រង និងចាត់ចែងនិស្សិតចូលតាមផ្នែកនីមួយៗ</Text>
          </div>
        </Space>
        <Statistic title={<span className="sort-khmer-text">Pending Students</span>} value={waitingStudents.length} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322', fontSize: '20px' }} className="sort-statistic-pending" />
      </div>

      <Card bordered={false} className="sort-card">
  <Form form={filterForm} layout="vertical" onFinish={handleSearch}>
    <Row gutter={[16, 16]} align="bottom" className="sort-filter-row">
      {/* Faculty */}
      <Col xs={24} sm={12} lg={5}>
        <Form.Item 
          label={<Text strong className="sort-khmer-text">Faculty</Text>} 
          name="faculty"
        >
          <Select placeholder="Select Faculty" size="large" allowClear>
            <Select.Option value="it">Information Technology</Select.Option>
            <Select.Option value="law">Law & Arts</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* Major */}
      <Col xs={24} sm={12} lg={5}>
        <Form.Item 
          label={<Text strong className="sort-khmer-text">Major</Text>} 
          name="major"
        >
          <Select placeholder="Select Major" size="large" allowClear>
            <Select.Option value="cs">Computer Science</Select.Option>
            <Select.Option value="ba">Business Admin</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* Batch */}
      <Col xs={12} sm={4} lg={2}>
        <Form.Item 
          label={<Text strong className="sort-khmer-text">Batch</Text>} 
          name="batch"
        >
          <Select placeholder="Batch" size="large" allowClear>
            <Select.Option value="20">Gen 20</Select.Option>
            <Select.Option value="21">Gen 21</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* Academic Year */}
      <Col xs={12} sm={8} lg={2}>
        <Form.Item 
          label={<Text strong className="sort-khmer-text">Year</Text>} 
          name="year"
        >
          <Select placeholder="Year" size="large" allowClear>
            <Select.Option value="1">Year 1</Select.Option>
            <Select.Option value="2">Year 2</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* Class */}
      <Col xs={24} sm={8} lg={2}>
        <Form.Item 
          label={<Text strong className="sort-khmer-text">Class</Text>} 
          name="class"
        >
          <Select placeholder="Class" size="large" allowClear>
            <Select.Option value="A1">A1</Select.Option>
            <Select.Option value="B1">B1</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      {/* Action Buttons */}
      <Col xs={24} lg={8}>
        <Form.Item>
          <Space size="middle" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />} 
              size="large" 
              className="sort-btn-search" 
              style={{ backgroundColor: '#070f7a', minWidth: '100px' }}
            >
              Search
            </Button>
            
            <Tooltip title="Clear Filters">
              <Button 
                className="sort-btn-clear" 
                size="large" 
                icon={<ClearOutlined />} 
                onClick={handleClear} 
              />
            </Tooltip>

            <Button 
              type="primary" 
              size="large" 
              icon={<CheckCircleOutlined />} 
              onClick={onEnroll} 
              className="sort-btn-enroll" 
              style={{ backgroundColor: '#070f7a',marginBottom:'0px',marginTop:'30px' }}
            >
              Enroll ({selectedRowKeys.length})
            </Button>
          </Space>
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Card>

      <Card bordered={false} className="sort-card" style={{ marginBottom: '20px' }} title={<Space className="sort-khmer-text"><TeamOutlined style={{ color: '#faad14' }} /><span>បញ្ជីរងចាំ (Waiting to Enroll)</span></Space>}>
        <Table rowSelection={{ type: 'checkbox', selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }} columns={columns} dataSource={waitingStudents} pagination={{ pageSize: 5 }} scroll={{ x: 1200 }} />
      </Card>

      <Card bordered={false} className="sort-card" title={<Space className="sort-khmer-text"><CheckCircleOutlined style={{ color: '#52c41a' }} /><span>បែងចែករួច (Already Enrolled)</span></Space>}>
        <Table columns={enrolledColumns} dataSource={enrolledStudents} pagination={{ pageSize: 5 }} scroll={{ x: 1300 }} locale={{ emptyText: 'មិនទាន់មាននិស្សិតបែងចែកនៅឡើយទេ' }} />
      </Card>

      <Modal title="កែប្រែព័ត៌មាន" open={isEditOpen} onCancel={() => setIsEditOpen(false)} onOk={() => editForm.submit()}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="nameKh" label="ឈ្មោះខ្មែរ"><Input /></Form.Item>
          <Form.Item name="nameEn" label="ឈ្មោះឡាតាំង"><Input /></Form.Item>
          <Form.Item name="faculty" label="មហាវិទ្យាល័យ"><Input /></Form.Item>
          <Form.Item name="major" label="ជំនាញ"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SortingPage;
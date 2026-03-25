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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // This is your Master Data
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

  // State for the data currently visible in the table
  const [students, setStudents] = useState(initialStudents);

  // --- Search Logic ---
  const handleSearch = (values) => {
    const filteredData = initialStudents.filter((student) => {
      return (
        (!values.faculty || student.faculty === values.faculty) &&
        (!values.major || student.major === values.major) &&
        (!values.batch || student.batch === values.batch) &&
        (!values.year || student.year === values.year) &&
        (!values.class || student.class === values.class)
      );
    });
    setStudents(filteredData);
    message.info(`រកឃើញនិស្សិតចំនួន ${filteredData.length} នាក់`);
  };

  // --- Reset/Clear Logic (Back to All) ---
  const handleClear = () => {
    filterForm.resetFields();
    setStudents(initialStudents); // Reset table to full list
  };

  const onEnroll = () => {
    if (selectedRowKeys.length === 0) {
      message.warning({ content: "សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!", className: "sort-khmer-text" });
      return;
    }
    message.success({
      content: `បានចាត់តាំងនិស្សិត ${selectedRowKeys.length} នាក់ដោយជោគជ័យ!`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      className: "sort-khmer-text"
    });
    // Update both master and visible list if you want them removed after enrollment
    const remaining = students.filter(s => !selectedRowKeys.includes(s.key));
    setStudents(remaining);
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: <Text strong className="sort-khmer-text">អត្តលេខ</Text>,
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (text) => <Text className="sort-student-number">{text}</Text>
    },
    {
      title: <Text strong className="sort-khmer-text">ឈ្មោះខ្មែរ</Text>,
      dataIndex: "nameKh",
      key: "nameKh",
      render: (text) => <Text className="sort-student-name-kh">{text}</Text>
    },
    {
      title: <Text strong className="sort-khmer-text">ឈ្មោះឡាតាំង</Text>,
      dataIndex: "nameEn",
      key: "nameEn",
      render: (text) => <Text className="sort-student-name-en">{text}</Text>
    },
    {
      title: <Text strong className="sort-khmer-text">ភេទ</Text>,
      dataIndex: "gender",
      key: "gender",
      width: 80,
      align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} className="sort-gender-tag">
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    {
      title: <Text strong className="sort-khmer-text">ថ្ងៃខែឆ្នាំកំណើត</Text>,
      dataIndex: "dob",
      key: "dob",
      render: (text) => <Text className="sort-student-number">{text}</Text>
    },
    {
      title: <Text strong className="sort-khmer-text">លេខទូរស័ព្ទ</Text>,
      dataIndex: "phone",
      key: "phone",
      render: (text) => <Text className="sort-student-number">{text}</Text>
    },
    {
      title: <Text strong className="sort-khmer-text">សកម្មភាព</Text>,
      key: "action",
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="មើលលម្អិត"><Button type="text" shape="circle" icon={<EyeOutlined />} /></Tooltip>
          <Tooltip title="កែប្រែ"><Button type="text" shape="circle" icon={<EditOutlined />} className="sort-action-edit"/></Tooltip>
          <Tooltip title="លុប"><Button type="text" shape="circle" danger icon={<DeleteOutlined />} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="sort-container">
      <div className="sort-header-wrapper">
        <Space size="large">
          <Button type="default" icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>
            Back
          </Button>
          <div>
            <Title className="sort-header-title" level={3}>បញ្ជីឈ្មោះនិស្សិតទាំងអស់</Title>
            <Text type="secondary" className="sort-khmer-text">គ្រប់គ្រង និងចាត់ចែងនិស្សិតចូលតាមផ្នែកនីមួយៗ</Text>
          </div>
        </Space>
        
        <Space>
           <Statistic 
             title={<span className="sort-khmer-text">Pending Students</span>} 
             value={students.length} 
             prefix={<UserOutlined />} 
             valueStyle={{ color: '#cf1322', fontSize: '20px' }}
             className="sort-statistic-pending"
           />
           <Button 
             type="primary" 
             size="large"
             icon={<CheckCircleOutlined />} 
             onClick={onEnroll}
             className="sort-btn-enroll"
             style={{ backgroundColor: '#070f7a' }}
           >
             Enroll Selected ({selectedRowKeys.length})
           </Button>
        </Space>
      </div>

      <Card bordered={false} className="sort-card">
        {/* Added onFinish to trigger Search */}
        <Form form={filterForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[16, 16]} className="sort-filter-row">
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label={<Text strong className="sort-khmer-text">មហាវិទ្យាល័យ</Text>} name="faculty" className="sort-form-item">
                <Select placeholder="ជ្រើសរើសមហាវិទ្យាល័យ" size="large" allowClear>
                  <Select.Option value="it">Information Technology</Select.Option>
                  <Select.Option value="law">Law & Arts</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label={<Text strong className="sort-khmer-text">ជំនាញ</Text>} name="major" className="sort-form-item">
                <Select placeholder="ជ្រើសរើសជំនាញ" size="large" allowClear>
                  <Select.Option value="cs">Computer Science</Select.Option>
                  <Select.Option value="ba">Business Admin</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} lg={3}>
              <Form.Item label={<Text strong className="sort-khmer-text">ជំនាន់</Text>} name="batch" className="sort-form-item">
                <Select placeholder="ជំនាន់" size="large" allowClear>
                  <Select.Option value="20">Gen 20</Select.Option>
                  <Select.Option value="21">Gen 21</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} lg={3}>
              <Form.Item label={<Text strong className="sort-khmer-text">ឆ្នាំសិក្សា</Text>} name="year" className="sort-form-item">
                <Select placeholder="ឆ្នាំ" size="large" allowClear>
                  <Select.Option value="1">Year 1</Select.Option>
                  <Select.Option value="2">Year 2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} lg={3}>
              <Form.Item label={<Text strong className="sort-khmer-text">ថ្នាក់</Text>} name="class" className="sort-form-item">
                <Select placeholder="ថ្នាក់" size="large" allowClear>
                  <Select.Option value="A1">A1</Select.Option>
                  <Select.Option value="B1">B1</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={5}>
              <Space style={{ width: '100%', marginTop: '0px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" // Trigger handleSearch
                  icon={<SearchOutlined />} 
                  size="large" 
                  className="sort-btn-search"
                  style={{ backgroundColor: '#070f7a' }}
                >
                  ស្វែងរក
                </Button>
                <Button 
                  className="sort-btn-clear"
                  size="large" 
                  icon={<ClearOutlined />} 
                  onClick={handleClear} // Trigger handleClear
                />
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card 
        bordered={false} 
        className="sort-card"
        title={
          <Space className="sort-khmer-text">
            <TeamOutlined />
            <span>បញ្ជីរាយនាមនិស្សិត</span>
          </Space>
        }
      >
        <Table 
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }} 
          columns={columns} 
          dataSource={students} 
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => <span className="sort-khmer-text">{`សរុបនិស្សិត: ${total} នាក់`}</span>
          }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
};

export default SortingPage;
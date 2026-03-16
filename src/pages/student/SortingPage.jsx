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

  // Mock Data
  const [students, setStudents] = useState([
    { 
      key: "1", 
      id: "STU-001", 
      nameKh: "ហេង សុវណ្ណ", 
      nameEn: "Heng Sovann", 
      gender: "M", 
      dob: "2002-05-20", 
      phone: "012 345 678" 
    },
    { 
      key: "2", 
      id: "STU-002", 
      nameKh: "លី ម៉ារីណា", 
      nameEn: "Ly Marina", 
      gender: "F", 
      dob: "2003-11-12", 
      phone: "098 765 432" 
    },
    { 
      key: "3", 
      id: "STU-003", 
      nameKh: "កែវ វិសាល", 
      nameEn: "Keo Visal", 
      gender: "M", 
      dob: "2001-01-30", 
      phone: "010 111 222" 
    },
  ]);

  const onEnroll = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!");
      return;
    }
    message.success({
      content: `បានចាត់តាំងនិស្សិត ${selectedRowKeys.length} នាក់ដោយជោគជ័យ!`,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    });
    setStudents(students.filter(s => !selectedRowKeys.includes(s.key)));
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: <Text strong>អត្តលេខ</Text>,
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: <Text strong>ឈ្មោះខ្មែរ</Text>,
      dataIndex: "nameKh",
      key: "nameKh",
      render: (text) => <Text style={{ color: "#160579", fontWeight: 600 }}>{text}</Text>
    },
    {
      title: <Text strong>ឈ្មោះឡាតាំង</Text>,
      dataIndex: "nameEn",
      key: "nameEn",
      render: (text) => <Text style={{ textTransform: 'uppercase', fontSize: '12px' }}>{text}</Text>
    },
    {
      title: <Text strong>ភេទ</Text>,
      dataIndex: "gender",
      key: "gender",
      width: 80,
      align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ borderRadius: '10px', padding: '0 10px' }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    {
      title: <Text strong>ថ្ងៃខែឆ្នាំកំណើត</Text>,
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: <Text strong>លេខទូរស័ព្ទ</Text>,
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: <Text strong>សកម្មភាព</Text>,
      key: "action",
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="មើលលម្អិត"><Button type="text" shape="circle" icon={<EyeOutlined />} /></Tooltip>
          <Tooltip title="កែប្រែ"><Button type="text" shape="circle" icon={<EditOutlined />} style={{color: '#faad14'}}/></Tooltip>
          <Tooltip title="លុប"><Button type="text" shape="circle" danger icon={<DeleteOutlined />} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px", minHeight: "100vh" }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space size="large">
          <Button 
            type="default" 
            icon={<SwapLeftOutlined />} 
            onClick={() => navigate(-1)} 
          >
            Back
          </Button>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1a3353" }}>ការចុះឈ្មោះចូលរៀន</Title>
            <Text type="secondary">គ្រប់គ្រង និងចាត់ចែងនិស្សិតចូលតាមផ្នែកនីមួយៗ</Text>
          </div>
        </Space>
        
        <Space>
           <Statistic 
             title="Pending Students" 
             value={students.length} 
             prefix={<UserOutlined />} 
             valueStyle={{ color: '#cf1322', fontSize: '20px' }}
             style={{ marginRight: 40 }}
           />
           <Button 
             type="primary" 
             size="large"
             icon={<CheckCircleOutlined />} 
             onClick={onEnroll}
             style={{ background: "#160579", borderRadius: '8px', height: '45px', fontWeight: 'bold' }}
           >
             Enroll Selected ({selectedRowKeys.length})
           </Button>
        </Space>
      </div>

      <Card 
        bordered={false} 
        style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
      >
        <Form form={filterForm} layout="vertical">
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label={<Text strong>មហាវិទ្យាល័យ</Text>} name="faculty" style={{ marginBottom: 0 }}>
                <Select placeholder="ជ្រើសរើសមហាវិទ្យាល័យ" size="large" allowClear>
                  <Select.Option value="it">Information Technology</Select.Option>
                  <Select.Option value="law">Law & Arts</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={5}>
              <Form.Item label={<Text strong>ជំនាញ</Text>} name="major" style={{ marginBottom: 0 }}>
                <Select placeholder="ជ្រើសរើសជំនាញ" size="large" allowClear>
                  <Select.Option value="cs">Computer Science</Select.Option>
                  <Select.Option value="ba">Business Admin</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} lg={3}>
              <Form.Item label={<Text strong>ជំនាន់</Text>} name="batch" style={{ marginBottom: 0 }}>
                <Select placeholder="ជំនាន់" size="large">
                  <Select.Option value="20">Gen 20</Select.Option>
                  <Select.Option value="21">Gen 21</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} lg={3}>
              <Form.Item label={<Text strong>ឆ្នាំសិក្សា</Text>} name="year" style={{ marginBottom: 0 }}>
                <Select placeholder="ឆ្នាំ" size="large">
                  <Select.Option value="1">Year 1</Select.Option>
                  <Select.Option value="2">Year 2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} lg={3}>
              <Form.Item label={<Text strong>ថ្នាក់</Text>} name="class" style={{ marginBottom: 0 }}>
                <Select placeholder="ថ្នាក់" size="large">
                  <Select.Option value="A1">A1</Select.Option>
                  <Select.Option value="B1">B1</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={5}>
              <Space style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  size="large" 
                  style={{ background: '#4e73df', flex: 1 }}
                >
                  ស្វែងរក
                </Button>
                <Button 
                  size="large" 
                  icon={<ClearOutlined />} 
                  onClick={() => filterForm.resetFields()}
                />
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card 
        bordered={false} 
        style={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        title={
          <Space>
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
            showTotal: (total) => `សរុបនិស្សិត: ${total} នាក់`
          }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
};

export default SortingPage;
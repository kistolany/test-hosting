import React, { useState } from "react";
import { 
  Table, Button, Checkbox, Tag, Space, Typography, Card, 
  Form, Row, Col, Select, DatePicker, theme 
} from "antd";
import { 
  ArrowRightOutlined, 
  SaveOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  PrinterOutlined, 
  SwapLeftOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const EnrollmentConfirmation = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  // --- STATIC TEST DATA ---
  const [masterData] = useState([
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", studyYear: "២០២៥-២០២៦", Result: "ជាប់" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", studyYear: "២០Check២៥-២០២៦", Result: "ធ្លាក់" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", major: "បង្រៀនភាសាអង់គ្លេស", studyYear: "២០២៦-២០២៧", Result: "ជាប់" },
    { key: "4", ID: "B260040", nameKhmer: "ចៅ សុភ័ក្ត្រ", name: "CHAO SOPHEAK", gender: "M", major: "គ្រប់គ្រង", studyYear: "២០២៥-២០២៦", Result: "ធ្លាក់" },
    { key: "5", ID: "B260055", nameKhmer: "លី ស្រីនុច", name: "LY SREYNUCH", gender: "F", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", studyYear: "២០២៥-២០២៦", Result: "ជាប់" }
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Helper to convert numbers to Khmer
  const toKhmerNum = (num) => {
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  const handleSearch = (values) => {
    const results = masterData.filter(item => {
      const matchYear = !values.studyYear || item.studyYear === values.studyYear;
      const matchResult = !values.resultStatus || item.Result === values.resultStatus;
      return matchYear && matchResult;
    });
    setFilteredData(results);
  };

  const finalData = filteredData !== null ? filteredData : masterData;

  const columns = [
    {
      title: "ជ្រើសរើស",
      key: "select",
      width: "80px",
      align: "center",
      render: (_, record) => (
        <Checkbox 
          checked={selectedStudents.some(s => s.key === record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudents([...selectedStudents, record]);
            } else {
              setSelectedStudents(selectedStudents.filter(s => s.key !== record.key));
            }
          }}
        />
      )
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: "100px", align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "200px" },
    { 
      title: "លទ្ធផលប្រឡង", 
      dataIndex: "Result",
      align: "center",
      render: (result) => (
        <Tag color={result === "ធ្លាក់" ? "red" : "green"} style={{ fontWeight: 'bold' }}>
          {result}
        </Tag>
      )
    },
    {
      title: "លក្ខខណ្ឌការសិក្សា",
      key: "condition",
      align: "center",
      render: (_, record) => (
        <Text strong style={{ color: record.Result === "ធ្លាក់" ? "#f5222d" : "#52c41a" }}>
          {record.Result === "ធ្លាក់" ? "បង់ថ្លៃ (Pay)" : "Scholarship 100%"}
        </Text>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Search Header Section */}
      <div className=" sticky-search no-print" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 0]} style={{ marginBottom: 10 }}>
          <Col span={24}>
            <Button onClick={() => navigate("/scholarExam")} icon={<SwapLeftOutlined />}>
              Back
            </Button>
          </Col>
        </Row>

        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSearch} 
          style={{ background: token.colorFillAlter, padding: 20, borderRadius: 8 }}
        >
          <Row gutter={16} align="bottom">
            <Col xs={24} md={6}>
              <Form.Item name="studyYear" label="Study Year">
                <Select allowClear placeholder="Select Year">
                  <Select.Option value="២០២៥-២០២៦">២០២៥-២០២៦</Select.Option>
                  <Select.Option value="២០២៦-២០២៧">២០២៦-២០២៧</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="examDate" label="Exam Date">
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="resultStatus" label="Result Status">
                <Select allowClear placeholder="All Results">
                  <Select.Option value="ជាប់">ជាប់ (Pass)</Select.Option>
                  <Select.Option value="ធ្លាក់">ធ្លាក់ (Fail)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#070f7a' }}>
                  Search
                </Button>
                <Button icon={<ClearOutlined />} onClick={() => { form.resetFields(); setFilteredData(null); }} />
                <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: 'white' }}>
                  Print
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Main Table Card */}
      <Card className="" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={3} className="khmer-moul">បញ្ជីបញ្ជាក់ការចូលរៀន</Title>
          <Text>សូមគ្រីសយកនិស្សិតដែលយល់ព្រមចូលរៀនបន្ត</Text>
        </div>

        <Table 
          dataSource={finalData} 
          columns={columns} 
          pagination={false} 
          bordered 
          size="small"
          footer={() => (
            <div style={{ fontWeight: 'bold' }}>
              ចំនួននិស្សិតជ្រើសរើសសរុប៖ {toKhmerNum(selectedStudents.length)} នាក់
            </div>
          )}
        />

        <div style={{ marginTop: 20, textAlign: 'right' }} className="no-print">
          <Space>
            <Button icon={<SaveOutlined />}>រក្សាទុកបណ្ដោះអាសន្ន</Button>
            <Button 
              type="primary" 
              icon={<ArrowRightOutlined />} 
              disabled={selectedStudents.length === 0}
              onClick={() => navigate("/final-enrollment-form", { state: { students: selectedStudents } })}
              style={{ backgroundColor: '#070f7a' }}
            >
              បន្តទៅការចុះឈ្មោះ (Continue to Enroll)
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default EnrollmentConfirmation;
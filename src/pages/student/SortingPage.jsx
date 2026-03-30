import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Form, Row, Col, Select, Card, Table, Tag, Space, 
  Typography, Tooltip, message, Statistic, Modal, Input,
} from "antd";
import {
  SwapLeftOutlined, SearchOutlined, DeleteOutlined, 
  CheckCircleOutlined, ClearOutlined, UserOutlined, TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SortingPage = () => {
  const navigate = useNavigate();
  const [filterForm] = Form.useForm();
  const [enrollForm] = Form.useForm(); 

  const initialStudents = [
    { key: "1", id: "STU-001", nameKh: "ហេង សុវណ្ណ", nameEn: "Heng Sovann", gender: "M", dob: "2002-05-20", phone: "012 345 678", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "Full Scholarship" },
    { key: "2", id: "STU-002", nameKh: "លី ម៉ារីណា", nameEn: "Ly Marina", gender: "F", dob: "2003-11-12", phone: "098 765 432", faculty: "law", major: "ba", batch: "21", year: "2", class: "B1", type: "Pay", note: "" },
    { key: "3", id: "STU-003", nameKh: "កែវ វិសាល", nameEn: "Keo Visal", gender: "M", dob: "2001-01-30", phone: "010 111 222", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "50% Discount" },
  ];

  const [waitingStudents, setWaitingStudents] = useState(initialStudents); 
  const [enrolledStudents, setEnrolledStudents] = useState([]); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Helper for Khmer Numbers
  // const toKhmerNum = (num) => {
  //   const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  //   return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  // };

  const handleOpenEnrollModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning({ content: "សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!", className: "sort-khmer-text" });
      return;
    }
    setIsEnrollModalOpen(true);
  };

  const onConfirmEnroll = () => {
    enrollForm.validateFields().then((values) => {
      const moving = waitingStudents
        .filter(s => selectedRowKeys.includes(s.key))
        .map(student => ({
          ...student,
          batch: values.batch,
          year: values.year,
          class: values.class,
        }));

      setEnrolledStudents(prev => [...prev, ...moving]);
      setWaitingStudents(prev => prev.filter(s => !selectedRowKeys.includes(s.key)));
      
      setSelectedRowKeys([]);
      setIsEnrollModalOpen(false);
      enrollForm.resetFields();
      message.success({ content: `បានបែងចែកនិស្សិត ${moving.length} នាក់រួចរាល់!`, className: "sort-khmer-text" });
    });
  };

  const handleSearch = (values) => {
    const { searchText, faculty, major, batch, year, class: className } = values;
    const allData = [...initialStudents, ...enrolledStudents, ...waitingStudents];
    const uniqueData = Array.from(new Map(allData.map(item => [item.key, item])).values());

    const filteredData = uniqueData.filter((s) => {
      const matchSearch = !searchText || 
        s.id.toLowerCase().includes(searchText.toLowerCase()) || 
        s.nameKh.includes(searchText) || 
        s.nameEn.toLowerCase().includes(searchText.toLowerCase());

      return (
        matchSearch &&
        (!faculty || s.faculty === faculty) &&
        (!major || s.major === major) &&
        (!batch || s.batch === batch) &&
        (!year || s.year === year) &&
        (!className || s.class === className)
      );
    });

    setWaitingStudents(filteredData);
    setEnrolledStudents(prev => prev.filter(e => !filteredData.some(f => f.key === e.key)));
    setSelectedRowKeys([]);
  };

  const handleClear = () => {
    filterForm.resetFields();
  };

  const columnTextStyle = { fontSize: '16px', fontWeight: '500' };

  const commonColumns = [
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">អត្តលេខ</Text>, dataIndex: "id", key: "id", width: 100, render: (text) => <Text style={columnTextStyle}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឈ្មោះខ្មែរ</Text>, dataIndex: "nameKh", key: "nameKh", render: (text) => <Text style={{ ...columnTextStyle, color: '#070f7a' }}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឈ្មោះឡាតាំង</Text>, dataIndex: "nameEn", key: "nameEn", render: (text) => <Text style={columnTextStyle}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ភេទ</Text>, dataIndex: "gender", key: "gender", width: 80, align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: '14px', padding: '2px 10px' }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ថ្ងៃខែឆ្នាំកំណើត</Text>, dataIndex: "dob", key: "dob", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ជំនាញ</Text>, dataIndex: "major", key: "major", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">លេខទូរស័ព្ទ</Text>, dataIndex: "phone", key: "phone", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ប្រភេទនិស្សិត</Text>, dataIndex: "type", key: "type", width: 140,
      render: (type) => (
        <Tag color={type === "Scholarship" ? "gold" : "cyan"} style={{ fontSize: '14px' }}>
          {type === "Scholarship" ? "Scholarship" : "Pay"}
        </Tag>
      )
    },
  ];

  const waitingColumns = [
    ...commonColumns,
    { key: "action", width: 100, fixed: 'right', align: 'center' }
  ];

  const enrolledColumns = [
    ...commonColumns,
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ជំនាន់</Text>, dataIndex: "batch" },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឆ្នាំសិក្សា</Text>, dataIndex: "year" },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ថ្នាក់</Text>, dataIndex: "class" },
  ];

  return (
    <div className="sort-container" style={{ paddingBottom: selectedRowKeys.length > 0 ? 120 : 20 }}>
      {/* Print CSS */}
      <style>{`
        @media print {
          .no-print, .ant-table-selection-column { display: none !important; }
        }
      `}</style>

      <div className="sort-header-wrapper">
        <Space size="large">
          <Button type="default" icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <Title className="sort-header-title" level={3}>បញ្ជីឈ្មោះនិស្សិតទាំងអស់</Title>
            <Text type="secondary" className="sort-khmer-text">គ្រប់គ្រង និងចាត់ចែងនិស្សិតចូលតាមផ្នែកនីមួយៗ</Text>
          </div>
        </Space>
        <Statistic title={<span className="sort-khmer-text">Pending Students</span>} value={waitingStudents.length} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322', fontSize: '20px' }} />
      </div>

      <Card bordered={false} className="sort-card">
        <Form form={filterForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} lg={5}>
              <Form.Item label={<Text strong className="sort-khmer-text">Search Name / ID</Text>} name="searchText">
                <Input placeholder="Search name or student ID..." size="large" prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={12} lg={3}><Form.Item label={<Text strong className="sort-khmer-text">Faculty</Text>} name="faculty"><Select placeholder="Faculty" size="large" allowClear><Select.Option value="it">IT</Select.Option><Select.Option value="law">Law</Select.Option></Select></Form.Item></Col>
            <Col xs={12} lg={3}><Form.Item label={<Text strong className="sort-khmer-text">Major</Text>} name="major"><Select placeholder="Major" size="large" allowClear><Select.Option value="cs">CS</Select.Option><Select.Option value="ba">BA</Select.Option></Select></Form.Item></Col>
            <Col xs={8} lg={2}><Form.Item label={<Text strong className="sort-khmer-text">Batch</Text>} name="batch"><Select placeholder="Batch" size="large" allowClear><Select.Option value="20">20</Select.Option></Select></Form.Item></Col>
            <Col xs={8} lg={2}><Form.Item label={<Text strong className="sort-khmer-text">Year</Text>} name="year"><Select placeholder="Year" size="large" allowClear><Select.Option value="1">1</Select.Option></Select></Form.Item></Col>
            <Col xs={8} lg={2}><Form.Item label={<Text strong className="sort-khmer-text">Class</Text>} name="class"><Select placeholder="Class" size="large" allowClear><Select.Option value="A1">A1</Select.Option></Select></Form.Item></Col>
            <Col xs={24} lg={7}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} size="large" style={{ backgroundColor: '#070f7a', minWidth: '100px' }}>Search</Button>
                  <Button size="large" icon={<ClearOutlined />} onClick={handleClear}>Clear</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal 
        title={<span className="sort-khmer-text">បែងចែកនិស្សិតចូលរៀន (Student Enrollment)</span>} 
        open={isEnrollModalOpen} onOk={onConfirmEnroll} onCancel={() => setIsEnrollModalOpen(false)}
        okText="Confirm Enrollment" cancelText="Cancel" width={600}
      >
        <Form form={enrollForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item label="Batch" name="batch" rules={[{ required: true }]}><Select placeholder="Batch"><Select.Option value="20">20</Select.Option><Select.Option value="21">21</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Year" name="year" rules={[{ required: true }]}><Select placeholder="Year"><Select.Option value="1">1</Select.Option><Select.Option value="2">2</Select.Option></Select></Form.Item></Col>
            <Col span={8}><Form.Item label="Class" name="class" rules={[{ required: true }]}><Select placeholder="Class"><Select.Option value="A1">A1</Select.Option><Select.Option value="B1">B1</Select.Option></Select></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      <Card bordered={false} style={{ marginBottom: '20px' }} title={<Space className="sort-khmer-text"><TeamOutlined style={{ color: '#faad14' }} /><span>បញ្ជីរងចាំ (Waiting to Enroll)</span></Space>}>
        <Table 
          rowSelection={{ 
            selectedRowKeys, 
            onChange: setSelectedRowKeys,
            columnClassName: "no-print" 
          }} 
          columns={waitingColumns} 
          dataSource={waitingStudents} 
          pagination={{ pageSize: 5 }} 
          scroll={{ x: 1500 }} 
        />
      </Card>

      <Card bordered={false} title={<Space className="sort-khmer-text"><CheckCircleOutlined style={{ color: '#52c41a' }} /><span>បែងចែករួច (Already Enrolled)</span></Space>}>
        <Table columns={enrolledColumns} dataSource={enrolledStudents} pagination={{ pageSize: 5 }} scroll={{ x: 1600 }} locale={{ emptyText: 'មិនទាន់មាននិស្សិតបែងចែកនៅឡើយទេ' }} />
      </Card>

      {/* FLOATING ACTION BAR: Matches your Result page pop-up */}
      {selectedRowKeys.length > 0 && (
        <div className="no-print" style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          zIndex: 1000
        }}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '1.5px solid #070f7a',
              padding: '4px 0'
            }}
          >
            <Row align="middle" justify="space-between">
              <Col span={10}>
                <Text strong style={{ fontSize: '18px', marginLeft: '20px' }} className="sort-khmer-text">
                  បានជ្រើសរើស: <span style={{ color: '#070f7a' }}>{(selectedRowKeys.length)} នាក់</span>
                </Text>
              </Col>
              <Col>
                <Space size="middle" style={{ marginRight: '20px' }}>
                  <Button size="large" onClick={() => setSelectedRowKeys([])}>Cancel</Button>
                  <Button 
                    size="large"
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    style={{ backgroundColor: '#070f7a', minWidth: '220px' }}
                    onClick={handleOpenEnrollModal}
                  >
                    Enrollment
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SortingPage;
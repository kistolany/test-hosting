import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SearchOutlined, 
  ClearOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, Typography, Card, Tag, ConfigProvider, Popconfirm, Tooltip
} from "antd";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const AdminScorePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const masterData = [
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 9.5, teacherTotal: 85, isDisqualified: false },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 2.0, teacherTotal: 40, isDisqualified: true },
  ];

  const initialProcessedData = masterData.map(s => ({
    ...s,
    finalTotal: s.isDisqualified ? 0 : (s.attScore + s.teacherTotal)
  })).sort((a, b) => b.finalTotal - a.finalTotal).map((s, index) => ({ ...s, rank: index + 1 }));

  const [data, setData] = useState(initialProcessedData);

  const handleSearch = (values) => {
    setLoading(true);
    let results = masterData.filter(item => 
      (!values.yearLevel || item.yearLevel === values.yearLevel) &&
      (!values.batch || item.batch === values.batch) &&
      (!values.semester || item.semester === values.semester) &&
      (!values.studyYear || item.studyYear === values.studyYear) &&
      (!values.faculty || item.faculty === values.faculty) &&
      (!values.major || item.major === values.major) &&
      (!values.shift || item.shift === values.shift)
    );

    results = results.map(s => ({
      ...s,
      finalTotal: s.isDisqualified ? 0 : (s.attScore + s.teacherTotal)
    })).sort((a, b) => b.finalTotal - a.finalTotal);

    results = results.map((s, index) => ({ ...s, rank: index + 1 }));

    setTimeout(() => { 
      setData(results); 
      setLoading(false); 
    }, 400);
  };

  const columns = [
    { title: "ល.រ", width: 70, align: "center", fixed: "left", render: (_, __, i) => i + 1 },
    { title: "អត្តលេខ", dataIndex: "ID", width: 110, align: "center", fixed: "left" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 200, fixed: "left" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 180 },
    {
      title: "ភេទ",
      dataIndex: "gender",
      width: 90,
      align: "center",
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: "12px", border: "none" }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 140, align: "center" },
    { title: "វត្តមាន", align: 'center', width: 110, render: (_, r) => <Text type={r.isDisqualified ? "danger" : ""}>{r.attScore}</Text> },
    { title: "ពិន្ទុ", dataIndex: "teacherTotal", width: 110, align: 'center' },
    { 
      title: "សម្គាល់ (Note)", 
      width: 130, 
      align: 'center',
      render: (_, r) => r.isDisqualified ? <Tag color="error" style={{ border: 'none' }}>ដកសិទ្ធិ</Tag> : "-"
    },
    {
      title: "សកម្មភាព",
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, r) => (
        <Flex gap="small" justify="center">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit student:", r.ID)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm 
              title="Delete this record?" 
              onConfirm={() => setData(data.filter(item => item.key !== r.key))}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 10]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="yearLevel" label="Year" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Year" options={[{ value: '១', label: 'ឆ្នាំទី១' }, { value: '២', label: 'ឆ្នាំទី២' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="batch" label="Batch" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Batch" options={[{ value: '4', label: '4' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="semester" label="Semester" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Sem" options={[{ value: '1', label: '1' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="studyYear" label="Study Year" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Study Year" options={[{ value: '២០២៨-២០២៩', label: '២០២៨-២០២៩' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="faculty" label="Faculty" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Faculty" options={[{ value: 'សិល្បៈ មនុស្សសាស្ត្រ និងភាសា', label: 'សិល្បៈ...' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="major" label="Major" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Major" options={[{ value: 'បង្រៀនភាសាអង់គ្លេស', label: 'បង្រៀន...' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="shift" label="Shift" style={{ marginBottom: 12 }}>
                <Select allowClear placeholder="Select Shift" options={[{ value: 'ព្រឹក', label: 'ព្រឹក' }, { value: 'រសៀល', label: 'រសៀល' }]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 10]}>
            <Col span={24}>
              <Form.Item style={{ marginBottom: 6 }}>
                <Flex className="student-search-actions" justify="flex-start" gap="small">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>Search</Button>
                  <Button icon={<ClearOutlined />} onClick={() => { form.resetFields(); setData(initialProcessedData); }} />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/ResultScholar")}
                    style={{ backgroundColor: PRIMARY_COLOR, minWidth: 120 }}
                  >
                    Result
                  </Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: PRIMARY_COLOR,
              headerColor: '#ffffff',
              headerBorderRadius: 0,
            },
          },
        }}
      >
        <Card className="user-card-main student-table-card" bordered={false} style={{ width: '100%', maxWidth: '1400px' }}>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 1700, y: "calc(100vh - 430px)" }}
            pagination={false}
            bordered={false}
          />
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default AdminScorePage;
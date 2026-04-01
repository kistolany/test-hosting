import React, { useState } from "react";
import { SaveOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, InputNumber, Card, Typography, ConfigProvider, Tag, message 
} from "antd";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const TeacherScorePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // MOCK DATA: attScore comes from Admin, others start at 0 for Teacher to fill
  const initialStudents = [
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", attScore: 9.5, classScore: 0, assignment: 0, midterm: 0, final: 0 },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", attScore: 2.0, classScore: 0, assignment: 0, midterm: 0, final: 0 },
  ];

  const [dataSource, setDataSource] = useState(initialStudents);

  const handleScoreChange = (value, key, field) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][field] = value || 0;
      setDataSource(newData);
    }
  };

  const columns = [
    { title: "ល.រ", width: 60, align: "center", fixed: "left", render: (_, __, i) => i + 1 },
    { title: "អត្តលេខ", dataIndex: "ID", width: 100, align: "center", fixed: "left" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 180, fixed: "left" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 180 },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 140, align: "center" },

    {
      title: "ភេទ",
      dataIndex: "gender",
      width: 80,
      align: "center",
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ border: "none" }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    
    // // --- ATTENDANCE (Read-Only from Admin) ---
    // { 
    //   title: "Att (10%)", 
    //   dataIndex: "attScore",
    //   width: 90, 
    //   align: "center",
    //   render: (score) => <Text strong color="#555">{score}</Text>
    // },

    // --- TEACHER INPUTS (Total 90%) ---
    { 
      title: "Class", 
      width: 90, 
      align: "center",
      render: (_, r) => <InputNumber min={0} max={10} value={r.classScore} onChange={(v) => handleScoreChange(v, r.key, 'classScore')} />
    },
    { 
      title: "Assign", 
      width: 90, 
      align: "center",
      render: (_, r) => <InputNumber min={0} max={10} value={r.assignment} onChange={(v) => handleScoreChange(v, r.key, 'assignment')} />
    },
    { 
      title: "Mid", 
      width: 90, 
      align: "center",
      render: (_, r) => <InputNumber min={0} max={20} value={r.midterm} onChange={(v) => handleScoreChange(v, r.key, 'midterm')} />
    },
    { 
      title: "Final", 
      width: 90, 
      align: "center",
      render: (_, r) => <InputNumber min={0} max={50} value={r.final} onChange={(v) => handleScoreChange(v, r.key, 'final')} />
    },

    // --- FINAL TOTAL (Calculation) ---
    { 
      title: "Total", 
      width: 100, 
      align: "center",
      fixed: "right",
      render: (_, r) => {
        const total = (r.classScore || 0) + (r.assignment || 0) + (r.midterm || 0) + (r.final || 0);
        return <Text strong style={{ color: total >= 50 ? PRIMARY_COLOR : 'red' }}>{total.toFixed(1)}</Text>
      }
    },
    { 
          title: "សម្គាល់ (Note)", 
          width: 130, 
          align: 'center',
          render: (_, r) => r.isDisqualified ? <Tag color="error" style={{ border: 'none' }}>ដកសិទ្ធិ</Tag> : "-"
        },
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical">
          <Row gutter={[10, 10]}>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="batch" label="Batch"><Select placeholder="Batch" options={[{value:'4', label:'4'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="year" label="Year"><Select placeholder="Year" options={[{value:'៤', label:'៤'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="semester" label="Semester"><Select placeholder="Sem" options={[{value:'1', label:'1'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={5}><Form.Item name="major" label="Major"><Select placeholder="Select Major" /></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Form.Item name="subject" label="Subject"><Select placeholder="Select Subject" /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="studyDay" label="Day"><Select placeholder="Mon-Fri" options={[{value:'Mon-Fri', label:'Mon-Fri'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="shift" label="Shift"><Select placeholder="Morning" options={[{value:'ព្រឹក', label:'ព្រឹក'}]} /></Form.Item></Col>
          </Row>

          <Row>
            <Col span={24}>
              <Flex gap="small" justify="flex-start" style={{ marginBottom: 10 }}>
                <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>Search</Button>
                <Button icon={<ClearOutlined />} onClick={() => form.resetFields()}>Clear</Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  style={{ backgroundColor: PRIMARY_COLOR, marginLeft: 'auto' }}
                  onClick={() => message.success("Scores saved and calculated with Admin Attendance!")}
                >
                  Save Scores
                </Button>
              </Flex>
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
        <Card className="user-card-main student-table-card" bordered={false}>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            scroll={{ x: 1400, y: "calc(100vh - 450px)" }}
            pagination={false}
            bordered
          />
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default TeacherScorePage;
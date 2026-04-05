import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SaveOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  PlusOutlined,
  EditOutlined,
  CheckOutlined 
} from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, InputNumber, Card, Typography, ConfigProvider, Tag, message, Pagination 
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const TeacherScorePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // MOCK DATA with isEditing property
  const initialStudents = [
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", attScore: 9.5, classScore: 0, assignment: 0, midterm: 0, final: 0, isEditing: false },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", attScore: 2.0, classScore: 0, assignment: 0, midterm: 0, final: 0, isEditing: false },
  ];

  const [dataSource, setDataSource] = useState(initialStudents);
  const totalPages = Math.max(1, Math.ceil(dataSource.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = dataSource.slice(startIndex, startIndex + PAGE_SIZE);

  // Control row editing
  const toggleEdit = (key) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index].isEditing = !newData[index].isEditing;
      setDataSource(newData);
      if (!newData[index].isEditing) {
        message.success("ទិន្នន័យត្រូវបានរក្សាទុកបណ្ដោះអាសន្ន");
      }
    }
  };

  const handleScoreChange = (value, key, field) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][field] = value || 0;
      setDataSource(newData);
    }
  };

  const columns = [
    { title: "ល.រ", width: 60, align: "center", fixed: "left", render: (_, __, i) => startIndex + i + 1 },
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
    { 
      title: "Class", 
      width: 90, 
      align: "center",
      render: (_, r) => (
        <InputNumber
          min={0} max={10}
          disabled={!r.isEditing}
          value={r.classScore}
          onChange={(v) => handleScoreChange(v, r.key, 'classScore')}
          style={{ width: "100%" }}
        />
      )
    },
    { 
      title: "Assign", 
      width: 90, 
      align: "center",
      render: (_, r) => (
        <InputNumber
          min={0} max={10}
          disabled={!r.isEditing}
          value={r.assignment}
          onChange={(v) => handleScoreChange(v, r.key, 'assignment')}
          style={{ width: "100%" }}
        />
      )
    },
    { 
      title: "Mid", 
      width: 90, 
      align: "center",
      render: (_, r) => (
        <InputNumber
          min={0} max={20}
          disabled={!r.isEditing}
          value={r.midterm}
          onChange={(v) => handleScoreChange(v, r.key, 'midterm')}
          style={{ width: "100%" }}
        />
      )
    },
    { 
      title: "Final", 
      width: 90, 
      align: "center",
      render: (_, r) => (
        <InputNumber
          min={0} max={50}
          disabled={!r.isEditing}
          value={r.final}
          onChange={(v) => handleScoreChange(v, r.key, 'final')}
          style={{ width: "100%" }}
        />
      )
    },
    { 
      title: "Total", 
      width: 100, 
      align: "center",
      render: (_, r) => {
        const total = (r.classScore || 0) + (r.assignment || 0) + (r.midterm || 0) + (r.final || 0);
        return <Text strong style={{ color: total >= 50 ? PRIMARY_COLOR : 'red' }}>{total.toFixed(1)}</Text>
      }
    },
    { 
      title: "សកម្មភាព", 
      width: 120, 
      align: 'center',
      fixed: 'right',
      render: (_, r) => (
        <Button 
          type={r.isEditing ? "primary" : "default"}
          icon={r.isEditing ? <CheckOutlined /> : <EditOutlined />}
          onClick={() => toggleEdit(r.key)}
          style={r.isEditing ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
          size="small"
        >
          {r.isEditing ? "save" : "edit"}
        </Button>
      )
    },
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper student-list-auto-bg score-teacher-page">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical">
          <Row gutter={[10, 5]}>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="batch" label={t("filters.batch")}><Select placeholder={t("filters.selectBatch")} options={[{value:'4', label:'4'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="year" label={t("filters.year")}><Select placeholder={t("filters.selectYear")} options={[{value:'៤', label:'៤'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="semester" label={t("filters.semester")}><Select placeholder={t("filters.selectSemester")} options={[{value:'1', label:'1'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={5}><Form.Item name="major" label={t("filters.major")}><Select placeholder={t("filters.selectMajor")} /></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={4}><Form.Item name="subject" label={t("filters.subject")}><Select placeholder={t("filters.selectSubject")} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="studyDay" label={t("filters.day")}><Select placeholder={t("filters.day")} options={[{value:'Mon-Fri', label:'Mon-Fri'}]} /></Form.Item></Col>
            <Col xs={24} sm={12} md={4} lg={3}><Form.Item name="shift" label={t("filters.shift")}><Select placeholder={t("filters.selectShift")} options={[{value:'ព្រឹក', label:'ព្រឹក'}]} /></Form.Item></Col>
          </Row>

          <Row gutter={[12, 5]}>
            <Col span={24}>
              <Form.Item style={{ marginBottom: 6 }}>
                <Flex className="student-search-actions" gap="small" justify="flex-start" wrap="wrap">
                  <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>{t("actions.search")}</Button>
                  <Button icon={<ClearOutlined />} onClick={() => form.resetFields()}>{t("actions.clear")}</Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />} 
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    onClick={() => message.success("Scores saved successfully!")}
                  >
                    {t("actions.saveScores")}
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/resultFinal")}
                    style={{ backgroundColor: PRIMARY_COLOR, minWidth: 120 }}
                  >
                    {t("Result") || "លទ្ធផល"} 
                  </Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <ConfigProvider theme={{ components: { Table: { headerBg: PRIMARY_COLOR, headerColor: '#ffffff', headerBorderRadius: 0 } } }}>
        <Card className="user-card-main student-table-card score-teacher-card" bordered={false}>
          <div className="student-table-overflow-x">
            <Table
              className="score-teacher-table"
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              scroll={{ x: 1500, y: 420 }}
              pagination={false}
              bordered
            />
          </div>
          <div className="student-table-pagination no-print">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={dataSource.length}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(Math.min(page, totalPages))}
            />
          </div>
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default TeacherScorePage;
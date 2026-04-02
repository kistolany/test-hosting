import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SearchOutlined, 
  ClearOutlined, 
  PlusOutlined, 
  EditFilled, 
  DeleteFilled 
} from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, Typography, Card, Tag, ConfigProvider, Popconfirm, Tooltip, Pagination
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";
import { pushAuditLog } from "../../utils/auditLogs";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const AdminScorePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const masterData = [
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 9.5, teacherTotal: 85, isDisqualified: false },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 2.0, teacherTotal: 40, isDisqualified: true },
  ];

  const initialProcessedData = masterData.map(s => ({
    ...s,
    finalTotal: s.isDisqualified ? 0 : (s.attScore + s.teacherTotal)
  })).sort((a, b) => b.finalTotal - a.finalTotal).map((s, index) => ({ ...s, rank: index + 1 }));

  const [data, setData] = useState(initialProcessedData);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = data.slice(startIndex, startIndex + PAGE_SIZE);

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
      setCurrentPage(1);
      setLoading(false); 
    }, 400);
  };

  const columns = [
    { title: "ល.រ", width: 70, align: "center", fixed: "left", render: (_, __, i) => startIndex + i + 1 },
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
      className: "score-action-column",
      render: (_, r) => (
        <Flex gap="small" justify="center">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditFilled />} onClick={() => console.log("Edit student:", r.ID)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm 
              title="Delete this record?" 
              onConfirm={() => {
                setData(data.filter(item => item.key !== r.key));
                pushAuditLog({
                  action: "Delete",
                  module: "Final Score",
                  description: `Deleted score row for ${r.nameKhmer || r.name || r.ID || r.key}.`,
                  before: JSON.stringify({ id: r.ID, key: r.key, nameKhmer: r.nameKhmer, name: r.name }),
                  after: null,
                });
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteFilled />} />
            </Popconfirm>
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper student-list-auto-bg">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 5]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="yearLevel" label={t("filters.year")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectYear")} options={[{ value: '១', label: 'ឆ្នាំទី១' }, { value: '២', label: 'ឆ្នាំទី២' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="batch" label={t("filters.batch")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectBatch")} options={[{ value: '4', label: '4' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="semester" label={t("filters.semester")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectSemester")} options={[{ value: '1', label: '1' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="studyYear" label={t("filters.studyYear")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectStudyYear")} options={[{ value: '២០២៨-២០២៩', label: '២០២៨-២០២៩' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="faculty" label={t("filters.faculty")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectFaculty")} options={[{ value: 'សិល្បៈ មនុស្សសាស្ត្រ និងភាសា', label: 'សិល្បៈ...' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="major" label={t("filters.major")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectMajor")} options={[{ value: 'បង្រៀនភាសាអង់គ្លេស', label: 'បង្រៀន...' }]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="shift" label={t("filters.shift")} style={{ marginBottom: 12 }}>
                <Select allowClear placeholder={t("filters.selectShift")} options={[{ value: 'ព្រឹក', label: 'ព្រឹក' }, { value: 'រសៀល', label: 'រសៀល' }]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 5]}>
            <Col span={24}>
              <Form.Item style={{ marginBottom: 6 }}>
                <Flex className="student-search-actions" justify="flex-start" gap="small" wrap="wrap">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>{t("actions.search")}</Button>
                  <Button icon={<ClearOutlined />} onClick={() => { form.resetFields(); setData(initialProcessedData); setCurrentPage(1); }} />
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/ResultScholar")}
                    style={{ backgroundColor: PRIMARY_COLOR, minWidth: 120 }}
                  >
                    {t("actions.result")}
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
          <div className="student-table-overflow-x">
            <Table
              className="score-admin-table"
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              scroll={{ x: 1450, y: 420 }}
              pagination={false}
              bordered={false}
              style={{ minWidth: 1450 }}
            />
          </div>
          <div className="student-table-pagination no-print">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={data.length}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(Math.min(page, totalPages))}
            />
          </div>
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default AdminScorePage;
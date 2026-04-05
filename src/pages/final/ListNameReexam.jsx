import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SearchOutlined, 
  ClearOutlined, 
  PrinterOutlined,
  WarningOutlined,
  StopOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, Typography, Card, Tag, ConfigProvider, Pagination, Divider 
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const ListNameReexam = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Helper to convert numbers to Khmer script
  const toKhmerNum = (num) => {
    if (num === null || num === undefined) return "";
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  // --- MOCK DATA ---
  const masterData = [
    { key: "1", ID: "B260011", nameKhmer: "សៅ រតនា", name: "SAO RATANA", gender: "M", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "ព្រឹក", attScore: 10, s1: 10, s2: 5, s3: 8, s4: 5, s5: 10, isDisqualified: false, dob: "01-Jan-2005" },
    { key: "2", ID: "B260012", nameKhmer: "លី ម៉ារីណា", name: "LY MARINA", gender: "F", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "ព្រឹក", attScore: 2.0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, isDisqualified: true, dob: "12-Feb-2005" },
    { key: "3", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 5, s1: 10, s2: 12, s3: 5, s4: 8, s5: 4, isDisqualified: false, dob: "20-Mar-2005" },
    { key: "4", ID: "B260014", nameKhmer: "ចាន់ តុលា", name: "CHAN TOLA", gender: "M", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 8.0, s1: 5, s2: 5, s3: 10, s4: 5, s5: 2, isDisqualified: false, dob: "15-May-2005" },
    { key: "5", ID: "B260015", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 1.0, s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, isDisqualified: true, dob: "10-Jun-2005" },
  ];

  const processReexamData = (list) => {
    return list.filter(s => {
      const total = s.isDisqualified ? 0 : (s.attScore || 0) + (s.s1 || 0) + (s.s2 || 0) + (s.s3 || 0) + (s.s4 || 0) + (s.s5 || 0);
      return total < 50 || s.isDisqualified;
    }).map(s => {
      const total = s.isDisqualified ? 0 : (s.attScore || 0) + (s.s1 || 0) + (s.s2 || 0) + (s.s3 || 0) + (s.s4 || 0) + (s.s5 || 0);
      return { ...s, finalTotal: total };
    });
  };

  const [filteredData, setFilteredData] = useState(processReexamData(masterData));

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

    setTimeout(() => {
      setFilteredData(processReexamData(results));
      setCurrentPage(1);
      setLoading(false);
    }, 400);
  };

  // Function to navigate to your Print Form page
  const handleGoToPrint = () => {
    const values = form.getFieldsValue();
    const femaleCount = filteredData.filter(s => s.gender === "F" || s.gender === "ស្រី").length;

    const printState = {
      data: filteredData,
      headerData: {
        faculty: values.faculty || ".....",
        major: values.major || ".....",
        year: values.yearLevel || ".....",
        semester: values.semester || ".....",
        generation: values.batch || ".....",
        shift: values.shift || ".....",
        startDate: ".....", 
        endDate: ".....",
        startTime: ".....",
        endTime: "....."
      },
      totalCount: toKhmerNum(filteredData.length),
      femaleCount: toKhmerNum(femaleCount)
    };

    navigate("/ReexamPrint", { state: printState });
  };

  const columns = [
    { title: "ល.រ", width: 70, align: "center", render: (_, __, i) => toKhmerNum(((currentPage - 1) * PAGE_SIZE) + i + 1) },
    { title: "អត្តលេខ", dataIndex: "ID", width: 110, align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 220, className: "khmer-font" },
    { 
      title: "ភេទ", 
      dataIndex: "gender", 
      width: 90, 
      align: "center",
      render: (g) => <Tag color={g === "M" ? "geekblue" : "volcano"} style={{border:'none'}}>{g === "M" ? "ប្រុស" : "ស្រី"}</Tag>
    },
    { 
      title: "ពិន្ទុសរុប", 
      dataIndex: "finalTotal", 
      width: 110, 
      align: "center",
      render: (val, r) => <Text strong style={{ color: 'red' }}>{r.isDisqualified ? "0" : val}</Text>
    },
    { 
      title: "មូលហេតុ", 
      width: 160, 
      align: "center",
      render: (_, r) => (
        r.isDisqualified ? 
        <Tag color="error" icon={<StopOutlined />}>ដកសិទ្ធិ</Tag> : 
        <Tag color="warning" icon={<WarningOutlined />}>ពិន្ទុទាប (ធ្លាក់)</Tag>
      )
    }
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper score-admin-page">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 5]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="yearLevel" label={t("filters.year")}><Select allowClear placeholder="Year" options={[{ value: '១', label: 'ឆ្នាំទី១' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="batch" label={t("filters.batch")}><Select allowClear placeholder="Batch" options={[{ value: '4', label: '4' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="semester" label={t("filters.semester")}><Select allowClear placeholder="Semester" options={[{ value: '1', label: '1' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="studyYear" label={t("filters.studyYear")}><Select allowClear placeholder="Study Year" options={[{ value: '២០២៨-២០២៩', label: '២០២៨-២០២៩' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="faculty" label={t("filters.faculty")}><Select allowClear placeholder="Faculty" options={[{ value: 'សិល្បៈ មនុស្សសាស្ត្រ និងភាសា', label: 'សិល្បៈ...' }, { value: 'វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា', label: 'វិទ្យាសាស្ត្រ...' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="major" label={t("filters.major")}><Select allowClear placeholder="Major" options={[{ value: 'បង្រៀនភាសាអង់គ្លេស', label: 'បង្រៀន...' }, { value: 'ព័ត៌មានវិទ្យា', label: 'ព័ត៌មានវិទ្យា' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="shift" label={t("filters.shift")}><Select allowClear placeholder="Shift" options={[{ value: 'ព្រឹក', label: 'ព្រឹក' }, { value: 'រសៀល', label: 'រសៀល' }]} /></Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 5]}>
            <Col span={24}>
              <Form.Item style={{ marginBottom: 6 }}>
                <Flex className="student-search-actions" justify="flex-start" gap="small" wrap="wrap">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>{t("actions.search")}</Button>
                  <Button icon={<ClearOutlined />} onClick={() => { form.resetFields(); setFilteredData(processReexamData(masterData)); }} />
                  <Button 
                    type="primary" 
                    icon={<PrinterOutlined />} 
                    onClick={handleGoToPrint} 
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    Print
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/scoreTeacher")} style={{ backgroundColor: PRIMARY_COLOR }}>Add Score</Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <ConfigProvider theme={{ components: { Table: { headerBg: PRIMARY_COLOR, headerColor: '#ffffff', headerBorderRadius: 0 } } }}>
        <Card className="user-card-main student-table-card score-admin-card" bordered={false}>
          <div className="student-table-overflow-x">
            <Table
              className="score-admin-table"
              columns={columns}
              dataSource={filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
              loading={loading}
              pagination={false}
              bordered={false}
              rowKey="key"
            />
          </div>
          <div className="student-table-pagination no-print">
            <Pagination current={currentPage} total={filteredData.length} pageSize={PAGE_SIZE} onChange={(p) => setCurrentPage(p)} />
          </div>
          <Divider />
          <div style={{ padding: '0 20px 20px' }}>
             <Text type="danger" strong className="khmer-font">
                * សរុបនិស្សិតត្រូវប្រឡងឡើងវិញ៖ {toKhmerNum(filteredData.length)} នាក់ (រួមទាំងអ្នកធ្លាក់ និងអ្នកដកសិទ្ធិ)
             </Text>
          </div>
        </Card>
      </ConfigProvider>

      <style>{`
        .khmer-font { font-family: 'Khmer OS Battambang', sans-serif !important; }
        .score-admin-card { border-radius: 8px !important; margin-bottom: 20px; }
        .sticky-search { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      `}</style>
    </div>
  );
};

export default ListNameReexam;
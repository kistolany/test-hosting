import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SearchOutlined, 
  ClearOutlined, 
  PlusOutlined, 
  EditFilled, 
  DeleteFilled,
  PrinterOutlined
} from '@ant-design/icons';
import { 
  Table, Button, Flex, Form, Row, Col, Select, Typography, Card, Tag, ConfigProvider, Popconfirm, Tooltip, Pagination
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";
import { pushAuditLog } from "../../utils/auditLogs";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const ResultFinal = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrintClick = () => {
    const filterValues = form.getFieldsValue();
    navigate("/finalResultPrint", {
      state: {
        printData: data, 
        params: {
          semester: filterValues.semester || "...",
          year: filterValues.yearLevel || "...",
          batch: filterValues.batch || "...",
          faculty: filterValues.faculty,
          major: filterValues.major,
          subjectNames: subjectNames 
        }
      }
    });
  };

  const [subjectNames, setSubjectNames] = useState(["មុខវិជ្ជា ១", "មុខវិជ្ជា ២", "មុខវិជ្ជា ៣", "មុខវិជ្ជា ៤", "មុខវិជ្ជា ៥"]);

  const masterData = [
    { key: "1", ID: "B260011", nameKhmer: "សៅ រតនា", name: "SAO ROTHANA", gender: "M", dob: "12-May-05", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "ព្រឹក", attScore: 10, s1: 90, s2: 85, s3: 88, s4: 92, s5: 80, isDisqualified: false },
    { key: "2", ID: "B260012", nameKhmer: "លី ម៉ារីណា", name: "LY MARINA", gender: "F", dob: "20-Jun-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "ព្រឹក", attScore: 9.5, s1: 75, s2: 80, s3: 70, s4: 85, s5: 78, isDisqualified: false },
    { key: "3", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 10, s1: 85, s2: 78, s3: 90, s4: 82, s5: 88, isDisqualified: false },
    { key: "4", ID: "B260014", nameKhmer: "ចាន់ តុលា", name: "CHAN TOLA", gender: "M", dob: "05-Oct-05", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 8.0, s1: 65, s2: 70, s3: 60, s4: 75, s5: 68, isDisqualified: false },
    { key: "5", ID: "B260015", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 2.0, s1: 40, s2: 35, s3: 45, s4: 30, s5: 38, isDisqualified: true },
    { key: "6", ID: "B260016", nameKhmer: "ស៊ឹម សុភ័ក្រ", name: "SIM SOPHEAK", gender: "M", dob: "15-Feb-05", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "រសៀល", attScore: 9.0, s1: 82, s2: 77, s3: 85, s4: 80, s5: 84, isDisqualified: false },
    { key: "7", ID: "B260017", nameKhmer: "មាស សុខា", name: "MEAS SOKHA", gender: "F", dob: "30-Mar-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "រសៀល", attScore: 10, s1: 95, s2: 90, s3: 92, s4: 88, s5: 91, isDisqualified: false },
    { key: "8", ID: "B260018", nameKhmer: "កែវ វិច្ឆិកា", name: "KEO VICCHIKA", gender: "F", dob: "12-Nov-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "រសៀល", attScore: 7.5, s1: 60, s2: 55, s3: 65, s4: 58, s5: 62, isDisqualified: false },
    { key: "9", ID: "B260019", nameKhmer: "ហេង វីរៈ", name: "HENG VIRAK", gender: "M", dob: "22-Jul-05", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "ព័ត៌មានវិទ្យា", shift: "ព្រឹក", attScore: 9.8, s1: 88, s2: 84, s3: 86, s4: 89, s5: 87, isDisqualified: false },
    { key: "10", ID: "B260020", nameKhmer: "ស៊ន ស្រីនិច", name: "SORN SREYNICH", gender: "F", dob: "09-Sep-06", yearLevel: "១", batch: "4", semester: "1", studyYear: "២០២៨-២០២៩", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", shift: "ព្រឹក", attScore: 10, s1: 72, s2: 75, s3: 78, s4: 70, s5: 74, isDisqualified: false },
  ];

  const calculateTotal = (s) => {
    if (s.isDisqualified) return 0;
    return (s.attScore || 0) + (s.s1 || 0) + (s.s2 || 0) + (s.s3 || 0) + (s.s4 || 0) + (s.s5 || 0);
  };

  const initialProcessedData = masterData.map(s => ({
    ...s,
    finalTotal: calculateTotal(s)
  })).sort((a, b) => b.finalTotal - a.finalTotal).map((s, index) => ({ ...s, rank: index + 1 }));

  const [data, setData] = useState(initialProcessedData);
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedData = data.slice(startIndex, startIndex + PAGE_SIZE);

  const handleSearch = (values) => {
    setLoading(true);
    if (values.major === "បង្រៀនភាសាអង់គ្លេស") {
      setSubjectNames(["Grammar", "Writing", "Speaking", "Listening", "Reading"]);
    } else if (values.major === "ព័ត៌មានវិទ្យា") {
      setSubjectNames(["Java", "Network", "Database", "React JS", "Laravel"]);
    } else {
      setSubjectNames(["មុខវិជ្ជា ១", "មុខវិជ្ជា ២", "មុខវិជ្ជា ៣", "មុខវិជ្ជា ៤", "មុខវិជ្ជា ៥"]);
    }

    let results = masterData.filter(item => 
      (!values.yearLevel || item.yearLevel === values.yearLevel) &&
      (!values.batch || item.batch === values.batch) &&
      (!values.semester || item.semester === values.semester) &&
      (!values.studyYear || item.studyYear === values.studyYear) &&
      (!values.faculty || item.faculty === values.faculty) &&
      (!values.major || item.major === values.major) &&
      (!values.shift || item.shift === values.shift)
    );

    results = results.map(s => ({ ...s, finalTotal: calculateTotal(s) })).sort((a, b) => b.finalTotal - a.finalTotal);
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
    { title: "វត្តមាន", align: 'center', width: 110, render: (_, r) => <Text type={r.isDisqualified ? "danger" : ""}>{r.attScore}</Text> },
    { title: subjectNames[0], dataIndex: "s1", width: 110, align: 'center' },
    { title: subjectNames[1], dataIndex: "s2", width: 110, align: 'center' },
    { title: subjectNames[2], dataIndex: "s3", width: 110, align: 'center' },
    { title: subjectNames[3], dataIndex: "s4", width: 110, align: 'center' },
    { title: subjectNames[4], dataIndex: "s5", width: 110, align: 'center' },
    { 
      title: "សរុប", 
      dataIndex: "finalTotal", 
      width: 110, 
      align: 'center',
      render: (val) => <Text strong style={{ color: PRIMARY_COLOR }}>{val}</Text>
    },
    { 
      title: "សម្គាល់", 
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
            <Button type="text" icon={<EditFilled />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete?" onConfirm={() => setData(data.filter(item => item.key !== r.key))}>
              <Button type="text" danger icon={<DeleteFilled />} />
            </Popconfirm>
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper student-list-auto-bg score-admin-page">
      <div className="search-inner-container sticky-search no-print">
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 5]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="yearLevel" label={t("filters.year")}><Select allowClear placeholder="Select Year" options={[{ value: '១', label: 'ឆ្នាំទី១' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="batch" label={t("filters.batch")}><Select allowClear placeholder="Select Batch" options={[{ value: '4', label: '4' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="semester" label={t("filters.semester")}><Select allowClear placeholder="Select Semester" options={[{ value: '1', label: '1' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="studyYear" label={t("filters.studyYear")}><Select allowClear placeholder="Select Study Year" options={[{ value: '២០២៨-២០២៩', label: '២០២៨-២០២៩' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="faculty" label={t("filters.faculty")}><Select allowClear placeholder="Select Faculty" options={[{ value: 'សិល្បៈ មនុស្សសាស្ត្រ និងភាសា', label: 'សិល្បៈ...' }, { value: 'វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា', label: 'វិទ្យាសាស្ត្រ...' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item name="major" label={t("filters.major")}><Select allowClear placeholder="Select Major" options={[{ value: 'បង្រៀនភាសាអង់គ្លេស', label: 'បង្រៀន...' }, { value: 'ព័ត៌មានវិទ្យា', label: 'ព័ត៌មានវិទ្យា' }]} /></Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}>
              <Form.Item name="shift" label={t("filters.shift")}><Select allowClear placeholder="Select Shift" options={[{ value: 'ព្រឹក', label: 'ព្រឹក' }, { value: 'រសៀល', label: 'រសៀល' }]} /></Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 5]}>
            <Col span={24}>
              <Form.Item style={{ marginBottom: 6 }}>
                <Flex className="student-search-actions" justify="flex-start" gap="small" wrap="wrap">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: PRIMARY_COLOR }}>{t("actions.search")}</Button>
                  <Button icon={<ClearOutlined />} onClick={() => { form.resetFields(); setData(initialProcessedData); setSubjectNames(["មុខវិជ្ជា ១", "មុខវិជ្ជា ២", "មុខវិជ្ជា ៣", "មុខវិជ្ជា ៤", "មុខវិជ្ជា ៥"]); setCurrentPage(1); }} />
                  <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrintClick} style={{ backgroundColor: PRIMARY_COLOR }}>Print</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/scoreTeacher")} style={{ backgroundColor: PRIMARY_COLOR }}>Add Score</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/ListNameReexam")} style={{ backgroundColor: PRIMARY_COLOR }}>Re Exam</Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <ConfigProvider theme={{ components: { Table: { headerBg: PRIMARY_COLOR, headerColor: '#ffffff', headerBorderRadius: 0 } } }}>
        <Card className="user-card-main student-table-card score-admin-card smooth-table-container" bordered={false}>
          <div className="student-table-overflow-x">
            <Table
              className="score-admin-table smooth-scroll"
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              scroll={{ x: 1650, y: 420 }}
              pagination={false}
              bordered={false}
            />
          </div>
          <div className="student-table-pagination no-print">
            <Pagination current={currentPage} pageSize={PAGE_SIZE} total={data.length} onChange={(page) => setCurrentPage(page)} />
          </div>
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default ResultFinal;
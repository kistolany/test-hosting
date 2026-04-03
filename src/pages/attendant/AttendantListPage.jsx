import React, { useState, useEffect } from "react";
import { 
  SearchOutlined, EyeOutlined, 
  PrinterOutlined, ClearOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Table, Button, Space, Skeleton, 
  Form, Row, Col, Select, Typography,
  Flex // <--- ADD THIS IMPORT
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const PRIMARY_COLOR = '#070f7a';

const academicSetup = [
  { subject: "Web Development", teacher: "លោកគ្រូ សុផល" },
  { subject: "Network Administration", teacher: "អ្នកគ្រូ សុភា" },
  { subject: "Database Management", teacher: "លោកគ្រូ រតនៈ" },
  { subject: "Cyber Security", teacher: "លោកគ្រូ ចាន់ត្រា" },
  { subject: "English for IT", teacher: "អ្នកគ្រូ ម៉ារី" },
];

const AttendanceListPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDark } = useOutletContext();
  const { t } = useLanguage();

  const [searchSummary, setSearchSummary] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMajorReport, setShowMajorReport] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("attendanceRecords");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllData(parsed);
        setFilteredData(parsed);
      } catch (e) {
        console.error("Data Parse Error", e);
      }
    }
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    const values = form.getFieldsValue(); 
    const result = allData.filter((item) => (
      (!values.batch || item.batch === values.batch) &&
      (!values.studyYear || item.studyYear === values.studyYear) &&
      (!values.semester || item.semester === values.semester) &&
      (!values.faculty || item.faculty === values.faculty) &&
      (!values.major || item.major === values.major) &&
      (!values.studyDay || item.studyDay === values.studyDay) &&
      (!values.shift || item.shift === values.shift) &&
      (!values.subject || item.subject === values.subject)
    ));

    setTimeout(() => {
      setFilteredData(result);
      setSearchSummary(Object.values(values).some(v => v) ? { ...values } : null);
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    form.resetFields();
    setFilteredData(allData);
    setSearchSummary(null);
  };

  const renderAttStatus = (val) => {
    if (val === 'A') return <b style={{ color: '#ff4d4f' }}>A</b>;
    if (val === 'P') return <b style={{ color: '#fa8c16' }}>P</b>;
    if (val === 'Att') return <span style={{ color: '#52c41a' }}>✔</span>;
    return "-";
  };

  const attendanceColumns = Array.from({ length: 15 }, (_, weekIdx) => ({
    title: `W${weekIdx + 1}`,
    children: [1, 2].map(sNum => {
      const idx = (weekIdx * 2) + (sNum - 1);
      return {
        title: `S${sNum}`,
        width: 55,
        align: 'center',
        render: (_, record) => renderAttStatus(record.attendance?.[idx])
      };
    }),
  }));

  const columns = [
    { title: "ល.រ", dataIndex: "No", width: 50, align: "center", fixed: 'left' },
    { title: "អត្តលេខ", dataIndex: "ID", width: 90, align: "center", fixed: 'left' },
    { title: "ឈ្មោះនិស្សិត", dataIndex: "nameKhmer", width: 160, fixed: 'left' },
    ...attendanceColumns,
    { 
        title: "ពិន្ទុ (10)", 
        width: 85, 
        align: 'center', 
        render: (_, record) => {
            const att = record.attendance || [];
            const score = ((att.filter(v => v === 'Att').length / (att.length || 1)) * 10).toFixed(2);
            return <strong style={{ color: PRIMARY_COLOR }}>{score}</strong>;
        } 
    },
    {
      title: "Action",
      width: 70,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined style={{ color: PRIMARY_COLOR }} />} onClick={() => navigate(`/attendant/take?id=${record.ID}`)} />
      )
    },
  ];

  return (
    <div className="att-page-wrapper">
      <div className="att-search-inner-container">
        <Form form={form} layout="vertical" className="att-search-form">
          <Row gutter={[16, 8]}>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="batch" label={t("filters.batch")}>
                <Select allowClear placeholder="Batch" options={[{value: '26', label: 'B26'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="studyYear" label={t("filters.year")}>
                <Select allowClear placeholder="Year" options={[{value: '1', label: 'Year 1'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="semester" label={t("filters.semester")}>
                <Select allowClear placeholder="Sem" options={[{value: '1', label: 'Sem 1'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Form.Item name="faculty" label={t("filters.faculty")}>
                <Select allowClear placeholder="Faculty" options={[{value: 'IT', label: 'IT'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Form.Item name="major" label={t("filters.major")}>
                <Select allowClear placeholder="Major" options={[{value: 'SNA', label: 'SNA'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={8} lg={4}>
              <Form.Item name="subject" label={t("filters.subject")}>
                <Select allowClear placeholder="Subject" options={academicSetup.map(a => ({value: a.subject, label: a.subject}))}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Item name="studyDay" label={t("filters.studyDay")}>
                <Select allowClear placeholder="Day" options={[{value: 'ចន្ទ-សុក្រ', label: 'ចន្ទ-សុក្រ'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Item name="shift" label={t("filters.shift")}>
                <Select allowClear placeholder="Shift" options={[{value: 'ព្រឹក', label: 'ព្រឹក'}]}/>
              </Form.Item>
            </Col>
            
          </Row>
        
          <Row gutter={[16, 8]} align="bottom">
            
            <Col xs={24} sm={24} md={24} lg={24} style={{ marginBottom: '5px',marginTop: '15px' }}>
              <Flex gap="small" wrap="wrap" justify={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ backgroundColor: PRIMARY_COLOR }}>
                  {t("search")}
                </Button>
                <Button icon={<ClearOutlined/>} onClick={handleClear} />
                <Button icon={<EyeOutlined />} onClick={() => setShowMajorReport(true)} disabled={!searchSummary}>
                  {t("Report")}
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/attendant/take")} style={{ backgroundColor: PRIMARY_COLOR }}>
                  Take Att
                </Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                  {t("print")}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </div>

      {searchSummary && (
        <div style={{ textAlign: 'center', margin: '20px 0', color: isDark ? '#e5e7eb' : '#000' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            ទម្រង់វត្តមាននិស្សិតឆ្នាំទី {searchSummary.studyYear} ឆមាសទី {searchSummary.semester} ជំនាន់ទី {searchSummary.batch}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            ថ្ងៃសិក្សា {searchSummary.studyDay} វេនសិក្សា {searchSummary.shift}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            មហាវិទ្យាល័យ {searchSummary.faculty} | ជំនាញ៖ {searchSummary.major}
          </div>
        </div>
      )}

      <div className="att-paper-sheet">
        <Skeleton loading={loading} active>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            pagination={{ pageSize: 15 }} 
            bordered 
            size="small" 
            scroll={{ x: 2800 }} 
            className="att-main-table"
            rowKey="ID"
          />
        </Skeleton>
      </div>
    </div>
  );
};

export default AttendanceListPage;
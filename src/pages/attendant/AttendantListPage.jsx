import React, { useState, useEffect } from "react";
import { 
  SearchOutlined, EyeOutlined, 
  PrinterOutlined, ClearOutlined,
  PlusOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Table, Button, Space, Skeleton, 
  Form, Row, Col, Select, Typography,
  Flex, Tag, message
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { Text, Title } = Typography;
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
      if (Object.values(values).some(v => v)) {
        setSearchSummary({
          batch: values.batch || "...",
          year: values.studyYear || "...",
          semester: values.semester || "...",
          faculty: values.faculty || "...",
          major: values.major || "...",
          day: values.studyDay || "...",
          shift: values.shift || "...",
          subject: values.subject || "គ្រប់មុខវិជ្ជា"
        });
      } else {
        setSearchSummary(null);
      }
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    form.resetFields();
    setFilteredData(allData);
    setSearchSummary(null);
  };

  const getDisciplineStatus = (attArray = []) => {
    const totalAbsentAndPermit = attArray.filter(v => v === 'A' || v === 'P').length;
    if (totalAbsentAndPermit >= 15) return { text: "ដកសិទ្ធិប្រឡង", color: "#ff4d4f", level: 3 }; 
    if (totalAbsentAndPermit >= 8)  return { text: "ធ្វើកិច្ចសន្យា", color: "#fa8c16", level: 2 }; 
    if (totalAbsentAndPermit >= 4)  return { text: "ណែនាំ", color: "#1890ff", level: 1 };        
    return { text: "", color: "default", level: 0 };
  };

  const renderAttStatus = (val) => {
    if (val === 'A') return <b style={{ color: '#ff4d4f' }}>A</b>;
    if (val === 'P') return <b style={{ color: '#fa8c16' }}>P</b>;
    if (val === 'Att') return <span style={{ color: '#52c41a' }}>✔</span>;
    return "-";
  };

  const attendanceColumns = Array.from({ length: 15 }, (_, weekIdx) => ({
    title: `W${weekIdx + 1}`,
    children: [1, 2].map(sNum => ({
      title: `S${sNum}`,
      width: 55,
      align: 'center',
      render: (_, record) => renderAttStatus(record.attendance?.[(weekIdx * 2) + (sNum - 1)])
    })),
  }));

  const columns = [
    { title: "ល.រ", dataIndex: "No", width: 30, align: "center", fixed: 'left' },
    { title: "អត្តលេខ", dataIndex: "ID", width: 70, align: "center", fixed: 'left' },
    { title: "ឈ្មោះនិស្សិត", dataIndex: "nameKhmer", width: 140, fixed: 'left' },
    ...attendanceColumns,
    { 
      title: "A", width: 60, align: 'center', 
      render: (_, record) => (record.attendance || []).filter(v => v === 'A').length 
    },
    { 
      title: "P", width: 60, align: 'center', 
      render: (_, record) => (record.attendance || []).filter(v => v === 'P').length 
    },
    { 
      title: "Att", width: 70, align: 'center', 
      render: (_, record) => (record.attendance || []).filter(v => v === 'Att').length 
    },
    { 
      title: "ពិន័យ", width: 120, align: 'center',
      render: (_, record) => {
        const status = getDisciplineStatus(record.attendance);
        return status.level > 0 ? <Tag color={status.color}>{status.text}</Tag> : <span style={{ color: '#d9d9d9' }}>-</span>;
      } 
    },
    { 
      title: "ពិន្ទុ", width: 80, align: 'center', 
      render: (_, record) => {
        const att = record.attendance || [];
        const score = ((att.filter(v => v === 'Att').length / (att.length || 1)) * 10).toFixed(2);
        return <strong style={{ color: PRIMARY_COLOR }}>{score}</strong>;
      } 
    },
    {
      title: "Action", width: 50, fixed: 'right', align: 'center',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined style={{ color: PRIMARY_COLOR }} />} onClick={() => navigate(`/attendant/take?id=${record.ID}`)} />
      )
    },
  ];

  // --- REPORT PAGE SECTION ---
  if (showMajorReport) {
    const studentsMap = {};
    const subjectsSet = new Set();
    
    filteredData.forEach(item => {
      subjectsSet.add(item.subject);
      if (!studentsMap[item.ID]) {
        studentsMap[item.ID] = { ...item, subjectStatus: {} };
      }
      const status = getDisciplineStatus(item.attendance);
      studentsMap[item.ID].subjectStatus[item.subject] = (status.level >= 2) ? status.text : "";
    });

    const reportDataSource = Object.values(studentsMap).map((s, index) => ({ ...s, No: index + 1 }));
    const reportCols = [
        { title: "ល.រ", dataIndex: "No", width: 50, align: 'center' },
        { title: "អត្តលេខ", dataIndex: "ID", width: 100, align: 'center' },
        { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 180 },
        { title: "អក្សរឡាតាំង", dataIndex: "nameLatin", width: 160 },
        { title: "ភេទ", dataIndex: "gender", width: 60, align: 'center' },
        ...Array.from(subjectsSet).map(sub => ({
          title: sub,
          dataIndex: ['subjectStatus', sub],
          align: 'center',
          render: (text) => <b style={{ color: text === "ដកសិទ្ធិប្រឡង" ? "#ff4d4f" : "#fa8c16", fontSize: '11px' }}>{text}</b>
        }))
    ];

    return (
       <div style={{ padding: '30px', background: isDark ? '#0b1220' : '#fff', minHeight: '100vh' }}>
              <Flex justify="space-between" className="no-print" style={{ marginBottom: 20 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => setShowMajorReport(false)}>Back</Button>
                <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()} style={{ background: PRIMARY_COLOR }}>Print</Button>
              </Flex>
      
            <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="uni-logo-section" style={{ textAlign: 'center',justifyItems:'center' }}>
                  <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
                  <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
                  <div style={{ fontSize: 9, fontWeight: 'bold', color: isDark ? '#e5e7eb' : '#070f7a' }}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
                </div>
                <div className="kingdom-section" style={{ textAlign: 'center',justifyItems:'center' }}>
                  <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                  <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5,justifyItems:'center' }} />
                </div>
              </div>
      
              <div style={{ textAlign: 'center', marginBottom: 25, color: isDark ? '#e5e7eb' : '#070f7a' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, fontFamily: 'Khmer OS Muol Light' }}>
              ទម្រង់វត្តមាននិស្សិតឆ្នាំទី {searchSummary?.year} ឆមាសទី {searchSummary?.semester} ជំនាន់ទី {searchSummary?.batch}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0', fontFamily: 'Khmer OS Muol Light' }}>
              ថ្ងៃសិក្សា {searchSummary?.day} វេនសិក្សា {searchSummary?.shift}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0', fontFamily: 'Khmer OS Muol Light' }}>
              មហាវិទ្យាល័យ {searchSummary?.faculty}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, textDecoration: 'underline', fontFamily: 'Khmer OS Muol Light' }}>
              ជំនាញ៖ {searchSummary?.major}
          </div>
      </div>
      
              <Table columns={reportCols} dataSource={reportDataSource} pagination={false} bordered size="small" />
              
              <Flex justify="space-between" style={{ marginTop: 20 }}>
                <Text strong>សម្គាល់៖ បញ្ជីវត្តមានបញ្ចប់ត្រឹមចំនួន {reportDataSource.length.toString().padStart(2, '0')} នាក់</Text>
                <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
                <div className="signature-area" style={{ textAlign: 'center' }}>
                  <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
                  <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
                  <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
                  <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
                </div>
              </div>
              </Flex>
              <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } }`}</style>
            </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="att-page-wrapper">
      <div className="att-search-inner-container">
        <Form form={form} layout="vertical" className="att-search-form">
          <Row gutter={[16, 8]}>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="batch" label={t("filters.batch")}>
                <Select size="middle" allowClear placeholder="Batch" options={[{value: '26', label: 'B26'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="studyYear" label={t("filters.year")}>
                <Select size="middle" allowClear placeholder="Year" options={[{value: '1', label: 'Year 1'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={4} lg={2}>
              <Form.Item name="semester" label={t("filters.semester")}>
                <Select size="middle" allowClear placeholder="Sem" options={[{value: '1', label: 'Sem 1'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Form.Item name="faculty" label={t("filters.faculty")}>
                <Select size="middle" allowClear placeholder="Faculty" options={[{value: 'IT', label: 'IT'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Form.Item name="major" label={t("filters.major")}>
                <Select size="middle" allowClear placeholder="Major" options={[{value: 'SNA', label: 'SNA'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={8} lg={4}>
              <Form.Item name="subject" label={t("filters.subject")}>
                <Select size="middle" allowClear placeholder="Subject" options={academicSetup.map(a => ({value: a.subject, label: a.subject}))}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Item name="studyDay" label={t("filters.studyDay")}>
                <Select size="middle" allowClear placeholder="Day" options={[{value: 'ចន្ទ-សុក្រ', label: 'ចន្ទ-សុក្រ'}]}/>
              </Form.Item>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Form.Item name="shift" label={t("filters.shift")}>
                <Select size="middle" allowClear placeholder="Shift" options={[{value: 'ព្រឹក', label: 'ព្រឹក'}]}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]} align="bottom">
            <Col xs={24} sm={24} md={24} lg={24} style={{ marginBottom: '5px', marginTop: '15px' }}>
              <Flex gap="small" wrap="wrap" justify={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button size="middle" type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ backgroundColor: PRIMARY_COLOR }}>
                  {t("search")}
                </Button>
                <Button size="middle" icon={<ClearOutlined/>} onClick={handleClear} />
                <Button icon={<EyeOutlined />} onClick={() => setShowMajorReport(true)} disabled={!searchSummary}>
                  {t("Report")}
                </Button>
                <Button size="middle" type="primary" icon={<PlusOutlined />} onClick={() => navigate("/attendant/take")} style={{ backgroundColor: PRIMARY_COLOR }}>
                  Take Att
                </Button>
                <Button size="middle" icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                  {t("print")}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="att-paper-sheet">
        <Skeleton loading={loading} active>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            pagination={{ pageSize: 15 }} 
            bordered 
            size="small" 
            scroll={{ x: 3200 }} 
            rowKey="ID"
          />
        </Skeleton>
      </div>
    </div>
  );
};

export default AttendanceListPage;
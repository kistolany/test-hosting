import React, { useState } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, ClearOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Space, ConfigProvider, Form, Row, Col, Select, Popconfirm, Card, Tag
} from "antd";

// --- Sub-component for the Search Form ---
const AdvancedSearchForm = ({ onSearch, onClear, onPrint, initialData }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const formStyle = {
    background: "transparent",
    borderRadius: 0,
    padding: 0,
  };

  const getOptions = (key) => {
    const uniqueValues = [...new Set(initialData.map(item => item[key]).filter(Boolean))];
    return uniqueValues.map(val => ({ value: val, label: val }));
  };

  return (
    <div className="search-inner-container sticky-search no-print">
      <Form
        className="student-search-form"
        form={form} 
        name="advanced_search" 
        style={formStyle} 
        layout="vertical" 
        onFinish={onSearch}
      >
        <Row gutter={[12, 10]} align="bottom">
          {/* YEAR SELECTION (Year 1, 2, 3, 4) */}
          <Col xs={24} sm={12} md={8} lg={3}>
            <Form.Item name="yearLevel" label="Year" style={{ marginBottom: 12 }}>
              <Select 
                allowClear 
                placeholder="Select Year" 
                options={[
                  { value: '១', label: 'ឆ្នាំទី១' },
                  { value: '២', label: 'ឆ្នាំទី២' },
                  { value: '៣', label: 'ឆ្នាំទី៣' },
                  { value: '៤', label: 'ឆ្នាំទី៤' },
                ]} 
              />
            </Form.Item>
          </Col>

          {/* Batch, Semester */}
          {[
            { name: 'batch', label: 'Batch' },
            { name: 'semester', label: 'Semester' },
          ].map((field) => (
            <Col xs={24} sm={12} md={8} lg={3} key={field.name}>
              <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
                <Select 
                  allowClear 
                  placeholder={`Select ${field.label}`} 
                  options={getOptions(field.name)} 
                />
              </Form.Item>
            </Col>
          ))}

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="studyYear" label="Study Year" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Study Year" options={getOptions('studyYear')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="faculty" label="Faculty" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Faculty" options={getOptions('faculty')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="major" label="Major" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Major" options={getOptions('major')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={3}>
            <Form.Item name="shift" label="Shift" style={{ marginBottom: 12 }}>
              <Select 
                allowClear 
                placeholder="Select Shift" 
                options={[
                  { value: 'ព្រឹក', label: 'ព្រឹក' },
                  { value: 'រសៀល', label: 'រសៀល' },
                  { value: 'យប់', label: 'យប់' }
                ]} 
              />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={[12, 10]}>
          <Col span={24}>
            <Form.Item style={{ marginBottom: 6 }}>
              <Flex className="student-search-actions" justify="flex-start" gap="small" wrap="wrap">
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#070f7a' }}>Search</Button>
                <Button icon={<ClearOutlined/>} onClick={() => { form.resetFields(); onClear(); }} />
                <Button icon={<PrinterOutlined />} onClick={onPrint} style={{ backgroundColor: '#070f7a', color: "white" }}>Print</Button>
                <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/createStudent", { state: { mode: "create" } })}>Add New</Button>
                </ConfigProvider>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

// --- Main Student Page Component ---
const StudentPage = () => {
  const [loading] = useState(false);
  const navigate = useNavigate();
  const textOrDash = (value) => (value === undefined || value === null || value === "" ? "-" : value);

  const [headerData, setHeaderData] = useState({
    year: "១", 
    semester: "១", 
    generation: "៤", 
    shift: "ព្រឹក",
    faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", 
    major: "បង្រៀនភាសាអង់គ្លេស", 
    studyYear: "២០២៨-២០២៩",
  });

  const [masterData, setMasterData] = useState([
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៨-២០២៩", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "២", batch: "4", major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", studyYear: "២០២៥-២០២៦", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៦-២០២៧", semester: "2", shift: "រសៀល", Note: "" },
    { key: "4", ID: "B260030", nameKhmer: "លីម សុភ័ក្ត្រ", name: "LIM SOPHEAK", gender: "M", dob: "05-May-05", yearLevel: "៣", batch: "4", major: "គ្រប់គ្រងពាណិជ្ជកម្ម", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៦-២០២៧", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "5", ID: "B260045", nameKhmer: "ឆាយ លីនដា", name: "CHHAY LINDA", gender: "F", dob: "20-Nov-04", yearLevel: "១", batch: "4", major: "សេដ្ឋកិច្ចឌីជីថល", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៥-២០២៦", semester: "1", shift: "យប់", Note: "" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "២", batch: "4", major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", studyYear: "២០២៥-២០២៦", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៦-២០២៧", semester: "2", shift: "រសៀល", Note: "" },
    { key: "4", ID: "B260030", nameKhmer: "លីម សុភ័ក្ត្រ", name: "LIM SOPHEAK", gender: "M", dob: "05-May-05", yearLevel: "៣", batch: "4", major: "គ្រប់គ្រងពាណិជ្ជកម្ម", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៦-២០២៧", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "២", batch: "4", major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", studyYear: "២០២៥-២០២៦", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៦-២០២៧", semester: "2", shift: "រសៀល", Note: "" },
    { key: "4", ID: "B260030", nameKhmer: "លីម សុភ័ក្ត្រ", name: "LIM SOPHEAK", gender: "M", dob: "05-May-05", yearLevel: "៣", batch: "4", major: "គ្រប់គ្រងពាណិជ្ជកម្ម", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៦-២០២៧", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "5", ID: "B260045", nameKhmer: "ឆាយ លីនដា", name: "CHHAY LINDA", gender: "F", dob: "20-Nov-04", yearLevel: "១", batch: "4", major: "សេដ្ឋកិច្ចឌីជីថល", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៥-២០២៦", semester: "1", shift: "យប់", Note: "" },
    { key: "4", ID: "B260030", nameKhmer: "លីម សុភ័ក្ត្រ", name: "LIM SOPHEAK", gender: "M", dob: "05-May-05", yearLevel: "៣", batch: "4", major: "គ្រប់គ្រងពាណិជ្ជកម្ម", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៦-២០២៧", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "5", ID: "B260045", nameKhmer: "ឆាយ លីនដា", name: "CHHAY LINDA", gender: "F", dob: "20-Nov-04", yearLevel: "១", batch: "4", major: "សេដ្ឋកិច្ចឌីជីថល", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៥-២០២៦", semester: "1", shift: "យប់", Note: "" }
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  const handleSearch = (values) => {
    const results = masterData.filter(item => {
      return (
        (!values.yearLevel || item.yearLevel === values.yearLevel) &&
        (!values.batch || item.batch === values.batch) &&
        (!values.studyYear || item.studyYear === values.studyYear) &&
        (!values.semester || item.semester === values.semester) &&
        (!values.major || item.major === values.major) &&
        (!values.faculty || item.faculty === values.faculty) &&
        (!values.shift || item.shift === values.shift)
      );
    });

    results.sort((a, b) => a.ID.localeCompare(b.ID));
    setFilteredData(results);

    // Update Header Text to match search
    setHeaderData(prev => ({
      ...prev,
      year: values.yearLevel || prev.year,
      semester: values.semester || prev.semester,
      generation: values.batch || prev.generation,
      shift: values.shift || prev.shift,
      faculty: values.faculty || prev.faculty,
      major: values.major || prev.major,
      studyYear: values.studyYear || prev.studyYear,
    }));
  };

  const handleClear = () => {
    setFilteredData(null);
  };

  const handlePrintPage = () => {
    navigate("/studentPrint", {
      state: {
        data: finalTableData,
        headerData,
      },
    });
  };

  const columns = [
    {
      title: "ល.រ",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: 120, align: "center", render: (t) => textOrDash(t) },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 220, render: (t) => textOrDash(t) },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 210, render: (t) => textOrDash(t) },
    {
      title: "ភេទ",
      dataIndex: "gender",
      width: 90,
      align: "center",
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: "12px", border: "none" }}>
          {gender === "M" ? "ប្រុស" : gender === "F" ? "ស្រី" : textOrDash(gender)}
        </Tag>
      ),
    },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 160, align: "center", render: (t) => textOrDash(t) },
    {
      title: "ប្រភេទនិស្សិត",
      dataIndex: "studentType",
      width: 170,
      render: (_, r) => {
        const type = r.studentType || r.StudentType;
        if (!type) return "-";
        const isScholar = String(type).toLowerCase().includes("scholar");
        return (
          <Tag color={isScholar ? "gold" : "cyan"} style={{ border: "none" }}>
            {isScholar ? "Scholarship" : "Pay"}
          </Tag>
        );
      }
    },
    { title: "Email", dataIndex: "email", width: 210, render: (_, r) => textOrDash(r.email || r.Email) },
    { title: "អត្តសញ្ញាណបណ្ណ", dataIndex: "idCard", width: 190, render: (_, r) => textOrDash(r.idCard || r.IdCard) },
    { title: "លេខទូរស័ព្ទ", dataIndex: "phone", width: 170, render: (_, r) => textOrDash(r.phone || r.Phone) },
    {
      title: "សកម្មភាព",
      key: "action",
      className: "action-column no-print",
      width: 90,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate("/createStudent", { state: { mode: "edit", student: record } })}
          />
          <Popconfirm title="លុប?" onConfirm={() => {
              const updated = masterData.filter(i => i.key !== record.key);
              setMasterData(updated);
              if (filteredData) setFilteredData(updated.filter(i => filteredData.some(f => f.key === i.key)));
          }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper">
      <AdvancedSearchForm onSearch={handleSearch} onClear={handleClear} onPrint={handlePrintPage} initialData={masterData} />

      <Card className="user-card-main student-table-card sort-card" bordered={false} style={{ width: '100%', maxWidth: '1400px' }}>
        <Table
          columns={columns}
          dataSource={finalTableData}
          loading={loading}
          pagination={{ pageSize: 10, position: ["bottomRight"], showSizeChanger: false }}
          scroll={{ x: 1500, y: "calc(100vh - 430px)" }}
          bordered={false}
        />
      </Card>
    </div>
  );
};

export default StudentPage;
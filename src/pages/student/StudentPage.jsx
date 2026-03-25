import React, { useState } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, ClearOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Typography, Space, ConfigProvider, Skeleton, theme, Form, Row, Col, Select, Popconfirm
} from "antd";

const { Title } = Typography;

// --- Sub-component for the Search Form ---
const AdvancedSearchForm = ({ onSearch, onClear, initialData }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: "20px",
  };

  const getOptions = (key) => {
    const uniqueValues = [...new Set(initialData.map(item => item[key]).filter(Boolean))];
    return uniqueValues.map(val => ({ value: val, label: val }));
  };

  return (
    <div className="search-inner-container sticky-search no-print">
      <Form 
        form={form} 
        name="advanced_search" 
        style={formStyle} 
        layout="vertical" 
        onFinish={onSearch}
      >
        <Row gutter={[16, 16]}>
          {/* YEAR SELECTION (Year 1, 2, 3, 4) */}
          <Col xs={24} sm={20} md={8} lg={6}>
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
            <Col xs={24} sm={20} md={8} lg={4} key={field.name}>
              <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
                <Select 
                  allowClear 
                  placeholder={`Select ${field.label}`} 
                  options={getOptions(field.name)} 
                />
              </Form.Item>
            </Col>
          ))}

          <Col xs={24} sm={20} md={8} lg={8}>
            <Form.Item name="studyYear" label="Study Year" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Study Year" options={getOptions('studyYear')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={20} md={8} lg={8}>
            <Form.Item name="faculty" label="Faculty" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Faculty" options={getOptions('faculty')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={20} md={8} lg={8}>
            <Form.Item name="major" label="Major" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Major" options={getOptions('major')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={20} md={8} lg={6}>
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
        
        <Flex justify="flex-start" gap="middle" wrap="wrap">
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#070f7a' }}>Search</Button>
          <Button icon={<ClearOutlined/>} onClick={() => { form.resetFields(); onClear(); }} />
          <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: "white" }}>Print</Button>
          <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/createStudent")}>Add New</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/sortingpage")}>Sort</Button>
          </ConfigProvider>
        </Flex>
      </Form>
    </div>
  );
};

// --- Main Student Page Component ---
const StudentPage = () => {
  const [loading] = useState(false);
  const { isDark } = useOutletContext();
  const navigate = useNavigate();

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
    { key: "5", ID: "B260045", nameKhmer: "ឆាយ លីនដា", name: "CHHAY LINDA", gender: "F", dob: "20-Nov-04", yearLevel: "១", batch: "4", major: "សេដ្ឋកិច្ចឌីជីថល", faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង", studyYear: "២០២៥-២០២៦", semester: "1", shift: "យប់", Note: "" }
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  // --- Gender Count Calculations ---
  const femaleCount = finalTableData.filter(item => item.gender === "F").length;
  const maleCount = finalTableData.filter(item => item.gender === "M").length;

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

  const columns = [
    { 
      title: "ល.រ", 
      key: "index", 
      width: "50px", 
      align: "center",
      render: (text, record, index) => index + 1, 
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: "90px", align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "170px" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: "170px", render: (t) => t.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender", width: "50px", align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "120px", align: "center" },
    { 
      title: "ផ្សេងៗ", 
      dataIndex: "Note",
      render: (text, record) => (
        <input 
          style={{ width: '100%', border: 'none', background: 'transparent' }} 
          value={text} 
          onChange={(e) => {
            const updated = masterData.map(item => 
              item.key === record.key ? { ...item, Note: e.target.value } : item
            );
            setMasterData(updated);
          }}
        />
      )
    },
    {
      title: "សកម្មភាព",
      key: "action",
      className: "action-column no-print", 
      width: "60px",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/createStudent${record.key}`)} />
          <Popconfirm title="លុប?" onConfirm={() => {
              const updated = masterData.filter(i => i.key !== record.key);
              setMasterData(updated);
              if(filteredData) setFilteredData(updated.filter(i => filteredData.some(f => f.key === i.key)));
          }}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-page-wrapper">
      <AdvancedSearchForm onSearch={handleSearch} onClear={handleClear} initialData={masterData} />

      <div className="paper-sheet">
        <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="uni-logo-section" style={{ textAlign: 'center' }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: 'bold', color:'#070f7a'}}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: 'center' }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5 }} />
          </div>
        </div>

        <Skeleton loading={loading} active>
            <div className="document-title-block" style={{ textAlign: 'center', margin: '20px 0' }}>
              <div className="khmer-moul" style={{ fontSize: 15 }}>បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី{headerData.semester} ជំនាន់ទី{headerData.generation} ({headerData.shift})</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>មហាវិទ្យាល័យ {headerData.faculty}</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ {headerData.major}</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ឆ្នាំសិក្សា {headerData.studyYear}</div>
            </div>
        </Skeleton>

        <Table
          columns={columns}
          dataSource={finalTableData}
          loading={loading}
          pagination={false}
          bordered
          size="small"
          className="official-table"
        />

        {/* --- Summary Section with Gender Breakdown --- */}
        <div className="totalStu" style={{ marginTop: 15, fontSize: 13, fontWeight: 'bold' }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {finalTableData.length.toLocaleString('km-KH')} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ស្រី ចំនួន {femaleCount.toLocaleString('km-KH')} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ប្រុស ចំនួន {maleCount.toLocaleString('km-KH')} នាក់។</div>
        </div>

        <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <div className="signature-area" style={{ textAlign: 'center' }}>
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
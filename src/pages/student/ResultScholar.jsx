import React, { useState } from "react";
import { 
  SearchOutlined, 
  PrinterOutlined, 
  ClearOutlined,
  SwapLeftOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Table, Button, Typography, Space, Skeleton, theme, Form, Row, Col, Select, DatePicker, Card
} from "antd";

const { Title, Text } = Typography;

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
  
      <Row gutter={[16, 0]} style={{ marginBottom: 10, width: '100%' }}>
        <Col xs={6}>
          <Button onClick={() => navigate("/scholarExam")} icon={<SwapLeftOutlined />}>
            Back
          </Button>
        </Col>
      </Row>

      <Form 
        form={form} 
        name="advanced_search" 
        style={formStyle} 
        layout="vertical" 
        onFinish={onSearch}
      >
        <Row gutter={[16, 0]} align="bottom">
          <Col xs={24} sm={24} md={6}>
            <Form.Item name="studyYear" label="Study Year" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Study Year" options={getOptions('studyYear')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Form.Item name="examDate" label="Exam Date" style={{ marginBottom: 12 }}>
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={6}>
            <Form.Item name="result" label="Result" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Result">
                <Select.Option value="ជាប់">ជាប់ (Pass)</Select.Option>
                <Select.Option value="ធ្លាក់">ធ្លាក់ (Fail)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Form.Item style={{ marginBottom: 12 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />} 
                style={{ backgroundColor: '#070f7a', width: '100%' }}
              >
                Search
              </Button>
            </Form.Item>
          </Col>

          <Col xs={5} sm={5} md={2}>
            <Form.Item style={{ marginBottom: 12 }}>
              <Button 
                icon={<ClearOutlined/>} 
                onClick={() => { form.resetFields(); onClear(); }} 
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={6} sm={6} md={3}>
            <Form.Item style={{ marginBottom: 12 }}>
              <Button 
                icon={<PrinterOutlined />} 
                onClick={() => window.print()} 
                style={{ backgroundColor: '#070f7a', color: "white", width: '100%' }}
              >
                Print
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

// --- Main Student Page Component ---
const ResultScholar = () => {
  const [loading] = useState(false);
  const { isDark } = useOutletContext();
  const navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const toKhmerNum = (num) => {
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  const formatKhmerDate = (date) => {
    if (!date) return "........................";
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const day = toKhmerNum(date.date());
    const month = khmerMonths[date.month()];
    const year = toKhmerNum(date.year());
    return `${day} ខែ${month} ឆ្នាំ${year}`;
  };

  const [headerData, setHeaderData] = useState({
    major: "បង្រៀនភាសាអង់គ្លេស", 
    studyYear: "២០២៨-២០២៩",
    examDate: "........................",
    resultFilter: null 
  });

  const [masterData, setMasterData] = useState([
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", major: "បង្រៀនភាសាអង់គ្លេស", studyYear: "២០២៨-២០២៩", Result: "ជាប់" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ", studyYear: "២០២៥-២០២៦", Result: "ធ្លាក់" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", major: "បង្រៀនភាសាអង់គ្លេស", studyYear: "២០២៦-២០២៧", Result: "ជាប់" },
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  const femaleCount = finalTableData.filter(item => item.gender === "F").length;
  const maleCount = finalTableData.filter(item => item.gender === "M").length;

  const handleSearch = (values) => {
    const dateText = values.examDate ? formatKhmerDate(values.examDate) : "........................";
    setHeaderData(prev => ({
      ...prev,
      studyYear: values.studyYear || prev.studyYear,
      examDate: dateText,
      resultFilter: values.result 
    }));

    const results = masterData.filter(item => (
      (!values.studyYear || item.studyYear === values.studyYear) &&
      (!values.result || item.Result === values.result)
    ));
    setFilteredData(results);
  };

  const handleClear = () => {
    setFilteredData(null);
    setHeaderData(prev => ({ ...prev, resultFilter: null }));
    setSelectedRowKeys([]);
    setSelectedStudents([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
      setSelectedStudents(selectedRows);

    },
    ClassName: "no-print",
  };

  const columns = [
    { 
      title: "ល.រ", 
      key: "index", 
      width: "40px", 
      align: "center",
      render: (text, record, index) => index + 1, 
    },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "150px",className:"namKh-column-custom" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: "150px",className:"namEn-column-custom", render: (t) => t.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender",width: "20px",  align: "center",className:"sex-column-custom" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "100px", align: "center", className:"dob-column-custom"},
    { title: "ជំនាញ", dataIndex: "major", width: "150px", align: "center",className:"major-column-custom" },
    { 
      title: "លទ្ធផល", 
      dataIndex: "Result",
      align: "center",
      className:"result-column-custom",
      render: (text, record) => (
        <Select
          value={text || "ជាប់"} 
          variant="borderless"
          suffixIcon={null} 
          className="hidden-select" 
          style={{ 
            width: '100%', 
            fontWeight: 'bold',
            color: text === "ធ្លាក់" ? 'red' : '#070f7a',
            textAlign: 'center'
          }}
          onChange={(value) => {
            const updateData = (data) => data.map(item => 
              item.key === record.key ? { ...item, Result: value } : item
            );
            setMasterData(prev => updateData(prev));
            if (filteredData) setFilteredData(prev => updateData(prev));
          }}
        >
          <Select.Option value="ជាប់">ជាប់</Select.Option>
          <Select.Option value="ធ្លាក់">ធ្លាក់</Select.Option>
        </Select>
      )
    },
  ];

  return (
    <div className="student-page-wrapper" style={{ paddingBottom: selectedStudents.length > 0 ? 120 : 20 }}>
      <AdvancedSearchForm onSearch={handleSearch} onClear={handleClear} initialData={masterData} />

      <div className="paper-sheet">
        <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="uni-logo-section" style={{ textAlign: 'center' }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80 }} />
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
            <div className="document-header" style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="khmer-moul" style={{ fontSize: 16 }}>
                បញ្ជីរាយនាមបេក្ខជនប្រឡងជាប់អាហារូបករណ៍ ១០០%
              </div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ថ្នាក់បរិញ្ញាបត្រ ឆ្នាំសិក្សា {headerData.studyYear}</div>
              <div className="khmer-moul" style={{ fontSize: 13 }}>សម័យប្រឡង ថ្ងៃទី {headerData.examDate}</div>
            </div>
          </div>
        </Skeleton>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={finalTableData}
          loading={loading}
          pagination={false}
          bordered
          size="small"
          className="official-table result-scholar-table"
        />

        {/* --- RESTORED: Total Count Block --- */}
        <div className="totalStu" style={{ marginTop: 15, fontSize: 13, fontWeight: 'bold' }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {toKhmerNum(finalTableData.length)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ស្រី ចំនួន {toKhmerNum(femaleCount)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ប្រុស ចំនួន {toKhmerNum(maleCount)} នាក់។</div>
        </div>

        {/* --- RESTORED: Signature Block --- */}
        <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <div className="signature-area" style={{ textAlign: 'center' }}>
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
          </div>
        </div>
        
      </div>

      {/* --- CENTERED POP-UP --- */}
      {selectedStudents.length > 0 && (
        <div className="no-print" style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-38%)',
          width: '90%',
          maxWidth: '800px',
          zIndex: 1000
        }}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '1.5px solid #070f7a',
              padding: '4px 0'
            }}
          >
            <Row align="middle" justify="space-between">
              <Col span={10}>
                <Text strong style={{ fontSize: '18px', marginLeft: '20px' }}>
                  បានជ្រើសរើស: <span style={{ color: '#070f7a' }}>{(selectedStudents.length)} នាក់</span>
                </Text>
              </Col>
              <Col>
                <Space size="middle"  style={{ marginRight: '20px' }}>
                  <Button size="large" onClick={() => { setSelectedRowKeys([]); setSelectedStudents([]); }}>Cancel</Button>
                  <Button 
                    size="large"
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    style={{ backgroundColor: '#070f7a', minWidth: '180px' }}
                    onClick={() => navigate("/final-enrollment-form", { state: { students: selectedStudents } })}
                  >
                    Confirm Study
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResultScholar;
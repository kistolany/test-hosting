import React, { useState } from "react";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PrinterOutlined, 
  ClearOutlined,
  SwapLeftOutlined 
} from '@ant-design/icons';
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Typography, Space, ConfigProvider, Skeleton, theme, Form, Row, Col, Select, Popconfirm, DatePicker, TimePicker
} from "antd";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

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
        <Row gutter={[16, 0]} align="bottom">
          <Col xs={24} sm={24} md={8}>
            <Form.Item name="studyYear" label="Study Year" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Study Year" options={getOptions('studyYear')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item name="major" label="Major" style={{ marginBottom: 12 }}>
              <Select allowClear placeholder="Select Major" options={getOptions('major')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item name="examDateRange" label="Exam Date" style={{ marginBottom: 12 }}>
              <RangePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item name="examTime" label="Exam Time" style={{ marginBottom: 12 }}>
              <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
          </Col>

          <Col xs={12} sm={6} md={4}>
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

          <Col xs={12} sm={12} md={4}>
            <Form.Item style={{ marginBottom: 12 }}>
              <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate("/ResultScholar")}
                  style={{ width: '100%' }}
                >
                  Result
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Col>
          {/* <Col xs={8} sm={8} md={4}>
            <Form.Item style={{ marginBottom: 12 }}>
              <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate("/sortConfirm")}
                  style={{ width: '100%' }}
                >
                  Continue
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    </div>
  );
};

// --- Main Student Page Component ---
const ScholarExam = () => {
  const [loading] = useState(false);
  const { isDark } = useOutletContext();
  const navigate = useNavigate();

  // Helper to convert numbers to Khmer
  const toKhmerNum = (num) => {
    if (num === null || num === undefined) return "";
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  const formatKhmerDate = (date) => {
    if (!date) return null;
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    const day = toKhmerNum(date.date());
    const month = khmerMonths[date.month()];
    const year = toKhmerNum(date.year());
    return `ថ្ងៃទី ${day} ខែ${month} ឆ្នាំ${year}`;
  };

  const [headerData, setHeaderData] = useState({
    major: "បង្រៀនភាសាអង់គ្លេស", 
    studyYear: "២០២៨-២០២៩",
    examDate: "ថ្ងៃទី..... ខែ..... ឆ្នាំ.....",
    examTime: "..... ដល់ម៉ោង ....."
  });

  const [masterData, setMasterData] = useState([
    { key: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៨-២០២៩", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", yearLevel: "២", batch: "4", major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ", faculty: "វិទ្យាសាស្ត្រ និងបច្គេកវិទ្យា", studyYear: "២០២៥-២០២៦", semester: "1", shift: "ព្រឹក", Note: "" },
    { key: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", yearLevel: "១", batch: "4", major: "បង្រៀនភាសាអង់គ្លេស", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", studyYear: "២០២៦-២០២៧", semester: "2", shift: "រសៀល", Note: "" },
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  const femaleCount = finalTableData.filter(item => item.gender === "F").length;
  const maleCount = finalTableData.filter(item => item.gender === "M").length;

  const handleSearch = (values) => {
    const dateText = values.examDateRange 
      ? `${formatKhmerDate(values.examDateRange[0])} រហូតដល់ ${formatKhmerDate(values.examDateRange[1])}`
      : headerData.examDate;

    const timeText = values.examTime 
      ? `${toKhmerNum(values.examTime[0].format("HH:mm"))} ដល់ម៉ោង ${toKhmerNum(values.examTime[1].format("HH:mm"))}`
      : headerData.examTime;

    setHeaderData(prev => ({
      ...prev,
      major: values.major || prev.major,
      studyYear: values.studyYear || prev.studyYear,
      examDate: dateText,
      examTime: timeText
    }));

    const results = masterData.filter(item => {
      return (
        (!values.studyYear || item.studyYear === values.studyYear) &&
        (!values.major || item.major === values.major)
      );
    });

    setFilteredData(results);
  };

  const handleClear = () => {
    setFilteredData(null);
  };

  const columns = [
    { 
      title: "ល.រ", 
      key: "index", 
      width: "15px", 
      align: "center",
      render: (text, record, index) => toKhmerNum(index + 1), 
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: "70px", align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "150px" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: "150px", render: (t) => t.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender", width: "30px", align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "100px", align: "center" },
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
      width: "20px",
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
              <div className="khmer-moul" style={{ fontSize: 14 }}>បញ្ជីរាយនាមនិស្សិត ប្រឡងអាហារូបកណ៍ </div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ {headerData.major}</div>

              <div style={{ fontSize: 13, fontWeight: 'bold', marginTop: 5 }}>កាលបរិច្ឆេទប្រឡង៖ {headerData.examDate}</div>
              <div style={{ fontSize: 13, fontWeight: 'bold' }}>ម៉ោងប្រឡង៖ {headerData.examTime}</div>
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

        <div className="totalStu" style={{ marginTop: 15, fontSize: 13, fontWeight: 'bold' }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {toKhmerNum(finalTableData.length)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ស្រី ចំនួន {toKhmerNum(femaleCount)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ប្រុស ចំនួន {toKhmerNum(maleCount)} នាក់។</div>
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

export default ScholarExam;
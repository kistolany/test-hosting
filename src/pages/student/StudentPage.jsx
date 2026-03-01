import React, { useState, useEffect } from "react";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Typography, Space, ConfigProvider, Skeleton, theme, Form, Row, Col, Select, Popconfirm
} from "antd";

const { Title } = Typography;

const AdvancedSearchForm = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: "20px",
  };

  return (
    <div className="search-inner-container">
     <Form form={form} name="advanced_search" style={formStyle} layout="vertical">
  <Row gutter={[16, 0]}>
    {[
      { name: 'batch', label: 'Batch' },
      { name: 'studyYear', label: 'Study Year' },
      { name: 'semester', label: 'Semester' },
      { name: 'course', label: 'Course' },
      { name: 'major', label: 'Major' },
      { name: 'faculty', label: 'Faculty' },
    ].map((field) => (
      <Col xs={24} sm={12} md={8} key={field.name}>
        <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
          <Select placeholder={`Select ${field.label}`} options={[{ value: 'all', label: 'All' }]} />
        </Form.Item>
      </Col>
    ))}
  </Row>
  
  {/* Flex wrap ensures buttons don't overflow on small screens */}
  <Flex justify="flex-start" gap="middle" wrap="wrap">
    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#070f7a' }}>Search</Button>
    <Button onClick={() => form.resetFields()}>Clear</Button>
    <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: "white" }}>Print</Button>
    <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/createStudent")}>Add New</Button>
    </ConfigProvider>
  </Flex>
</Form>
    </div>
  );
};

const StudentPage = () => {
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useOutletContext();
  const navigate = useNavigate();
  const [data, setData] = useState([
    { key: "1", No: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "F", dob: "11-Jan-06", Note: "" },
    { key: "2", No: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", name: "HARUN HUYSNA", gender: "F", dob: "28-Apr-06", Note: "" },
    { key: "3", No: "3", ID: "B260026", nameKhmer: "សុគ្រី សាអ៊ីទី", name: "SOKRY SAIDI", gender: "M", dob: "12-Feb-08", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    { key: "4", No: "4", ID: "B260027", nameKhmer: "សុភីយ៉ាន អាលី", name: "SORPIYAN ALY", gender: "M", dob: "8-Feb-06", Note: "" },
    
    
    
  ]);

  useEffect(() => {
    setTimeout(() => {
      setHeaderData({
        year: "១", semester: "១", generation: "៤", shift: "ព្រឹក",
        faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", academicYear: "២០២៥-២០២៦",
      });
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { title: "ល.រ", dataIndex: "No", width: "20px", align: "center" },
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
          style={{ width: '70px', border: 'none', background: 'transparent' }} 
          value={text} 
          onChange={(e) => {
            const newData = [...data];
            const idx = newData.findIndex(item => item.key === record.key);
            newData[idx].Note = e.target.value;
            setData(newData);
          }}
        />
      )
    },
    {
      title: "សកម្មភាព",
      key: "action",
      className: "action-column", 
      width: "60px",
      render: (_, record) => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => navigate(`/createStudent/${record.key}`)} />
          <Popconfirm title="លុប?" onConfirm={() => setData(data.filter(i => i.key !== record.key))}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-page-wrapper">
      <div className="web-ui-controls "> 
        <AdvancedSearchForm />
      </div>

      <div className="paper-sheet">
        <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="uni-logo-section" style={{ textAlign: 'center' }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: 'bold',color:'#070f7a'}}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: 'center' }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
<img 
      src="/src/assets/devider.png" 
      alt="decorative divider" 
      style={{ width: '90px', height: 'auto' }} 
    />         

</div>
        </div>

        <Skeleton loading={loading} active>
          {headerData && (
            <div className="document-title-block" style={{ textAlign: 'center', margin: '20px 0' }}>
              <div className="khmer-moul" style={{ fontSize: 15 }}>បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី{headerData.semester} ជំនាន់ទី{headerData.generation} ({headerData.shift})</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>មហាវិទ្យាល័យ{headerData.faculty}</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ {headerData.major}</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ឆ្នាំសិក្សា {headerData.academicYear}</div>
            </div>
          )}
        </Skeleton>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          bordered
          size="small"
          className="official-table"
        />

        <div style={{ marginTop: 10, fontSize: 13 }}>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {data.length} នាក់។</div>
<div className="signature-block">
<div className="signature-area">
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 40 }}>ប្រធាន</div>
        </div>

</div>
        
      </div>
    </div>
  );
};

export default StudentPage;
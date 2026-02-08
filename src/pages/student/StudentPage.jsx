import React, { useState, useEffect } from "react";
import { DownOutlined,SearchOutlined,PlusOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import {
  Table,
  Button,
  Flex,
  Typography,
  Space,
  Avatar,
  ConfigProvider,
  Skeleton,
  Card,
  theme,
  Form, 
  Row, 
  Col,  
  Select,
  Watermark
} from "antd";

const { Title, Text } = Typography;

const AdvancedSearchForm = () => {
    const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };
  const searchFields = [
    { name: 'batch', label: 'Batch', placeholder: 'Select Batch' },
    { name: 'studyYear', label: 'Study Year', placeholder: 'Select Study Year' },
    { name: 'semester', label: 'Semester', placeholder: 'Select Semester' },
    { name: 'course', label: 'Course', placeholder: 'Select Course' },
    { name: 'major', label: 'Major', placeholder: 'Select Major' },
    { name: 'faculty', label: 'Faculty', placeholder: 'Select Faculty' },
  ];

  const onFinish = (values) => {
    console.log('Search Params: ', values);
  };

  return (
    <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish} layout="vertical">
      <Row gutter={[24]}>
        {searchFields.map((field) => (
          <Col xs={24} sm={12} md={8} lg={6} key={field.name}>
            <Form.Item
              name={field.name}
              label={field.label}
            >
              <Select
                placeholder={field.placeholder}
                options={[
                  { value: 'all', label: 'All' },
         
                ]}
              />
            </Form.Item>
          </Col>
        ))}
        
        <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '24px' }}>
  <Space size="middle" wrap>
    <Button 
      type="primary" 
      htmlType="submit" 
      icon={<SearchOutlined />} 
      style={{ backgroundColor: '#070f7a'}}
    >
      Search
    </Button>
    
    <Button 
      onClick={() => form.resetFields()} 
      
    >
      Clear
    </Button>

    <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => navigate("/createStudent")}
        
      >
        Add New
      </Button>
    </ConfigProvider>
  </Space>
</Col>
      </Row>
    </Form>
  );
};

const columns = [
  {
    title: "ល.រ",
    dataIndex: "No",
    filters: [
      { text: "1", value: "1" },
      { text: "2", value: "2" },
      { text: "3", value: "3" },
    ],
    filterSearch: true,
    onFilter: (value, record) => record.No.includes(value),
    width: "2%",
  },
  {
    title: "អត្តលេខ",
    dataIndex: "ID",
    filters: [
      { text: "B01", value: "B01" },
      { text: "B02", value: "B02" },
      { text: "B03", value: "B04" },
    ],
    filterSearch: true,
    onFilter: (value, record) => record.ID.includes(value),
    width: "3%",
  },
  {
    title: "គោត្តនាម​ និងនាម",
    dataIndex: "nameKhmer",
    filters: [
      { text: "ស្លេះ ស៊ីហ្វា", value: "ស្លេះ ស៊ីហ្វា" },
      { text: "សូកូឡ គីសតូឡានី", value: "សូកូឡ គីសតូឡានី" },
      { text: "ឆាន់ សម្បត្តិ", value: "ឆាន់ សម្បត្តិ" },
    ],
    filterSearch: true,
    onFilter: (value, record) => record.nameKhmer.includes(value),
    width: "20%",
  },
  {
    title: "ឈ្មោះជាឡាតាំង",
    dataIndex: "name",
    filters: [
      { text: "sles sifa", value: "sles sifa" },
      { text: "sokut kistolany", value: "sokut kistolany" },
      { text: "chann sambath", value: "chann sambath" },
    ],
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value),
    width: "16%",
  },
  {
    title: "ភេទ",
    dataIndex: "gender",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.gender.includes(value),
    filterSearch: true,
    width: "2%",
  },
  {
    title: "ថ្ងៃខែឆ្នាំកំណើត",
    dataIndex: "dob",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.dob.includes(value),
    filterSearch: true,
    width: "20%",
  },
  {
    title: "ផ្សេងៗ",
    dataIndex: "Note",
    filters: [
      { text: "London", value: "London" },
      { text: "New York", value: "New York" },
    ],
    onFilter: (value, record) => record.Note.includes(value),
    filterSearch: true,
    width: "30%",
  },
];

const data = [
  {
    key: "1",
    No: "1",
    ID: "B01",
    nameKhmer: "ស្លេះ ស៊ីហ្វា",
    name: "sles sifa",
    gender: 32,
    dob: "10/02/2001",
  },
  {
    key: "2",
    No: "2",
    ID: "B02",
    nameKhmer: "សូកូឡ គីសតូឡានី",
    name: "sokut kistolany",
    gender: 42,
    dob: "10/02/2002",
  },
  {
    key: "3",
    No: "3",
    ID: "B03",
    nameKhmer: "ឆាន់ សម្បត្តិ",
    name: "chann sambath",
    gender: 32,
    dob: "10/02/2003",
  },
  {
    key: "4",
    No: "4",
    ID: "B04",
    nameKhmer: "ឆាន់ មាសសម្បត្តិ",
    name: "chann meassambath",
    gender: 32,
    dob: "10/02/2004",
  },
];

const StudentPage = () => {
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useOutletContext();
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("Table params:", { pagination, filters, sorter, extra });
  };

  useEffect(() => {
    setTimeout(() => {
      setHeaderData({
        year: "១",
        semester: "១",
        generation: "៤",
        shift: "ព្រឹក",
        faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា",
        major: "បង្រៀនភាសាអង់គ្លេស",
        academicYear: "២០២៥-២០២៦",
      });
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div style={{ padding: "clamp(12px, 3vw, 24px)" }}>
      <div style={{ padding: 20 }}>
        <AdvancedSearchForm />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        bordered
        scroll={{ x: 1000 }}
        title={() => (
          <div style={{ overflowX: "auto", width: "100%" }}>
            <Space
              direction="vertical"
              gap="middle"
              style={{ width: "100%", minWidth: "600px", padding: "10px 0" }}
            >
              
              <div className="textContain">
                <div className="textRight">
                  <div>ព្រះរាជាណាចក្រកម្ពុជា</div>
                  <div>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                </div>
              </div>
              <div className="textContainLeft">
                <img
                  src="/asset/image/logo.png"
                  alt="logo"
                  style={{
                    marginLeft: "130px",
                    width: "120px",
                    filter: isDark ? "brightness(0) invert(1)" : "none",
                    transition: "filter 0.3s ease",
                  }}
                />
                <div>
                  <div className="textLeft1">
                    សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា
                  </div>
                  <div className="textLeft2">
                    CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY
                  </div>
                </div>
              </div>
              <Card
                className="textCenter"
                style={{ textAlign: "center", border: "none" }}
              >
                <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
                  {headerData && (
                    <div style={{ lineHeight: "2" }}>
                      <Title className="title" level={4} style={{ margin: 0 }}>
                        បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី
                        {headerData.semester} ជំនាន់ទី{headerData.generation} (
                        {headerData.shift})
                      </Title>
                      <Title className="title" level={4} style={{ margin: 0 }}>
                        មហាវិទ្យាល័យ{headerData.faculty}
                      </Title>
                      <Title className="title" level={4} style={{ margin: 0 }}>
                        ជំនាញ {headerData.major}
                      </Title>
                      <Title className="title" level={4} style={{ margin: 0 }}>
                        ឆ្នាំសិក្សា {headerData.academicYear}
                      </Title>
                    </div>
                  )}
                </Skeleton>
              </Card>
            </Space>
          </div>
        )}
        footer={() => `Total Students: ${data.length}`}
      />
    </div>
   
  );
};

export default StudentPage;
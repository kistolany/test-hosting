import React from "react";
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Typography,
  Button,
  Space,
  Image,
  Select,
  theme,
  Layout,
} from "antd";
import {
  SaveOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import flourishSign from "../../assets/image_69b387.png";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const THEME_BLUE = "#000080";

const MOCK_STUDENTS = {
  "Batch 1-រដ្ឋបាលសាធារណៈ-LIM FAHIMA": {
    name_kh: "name_kh",
    name_en: "name_en",
    gender: "gender",
    nationality: "nationality",
    ethnicity: "ethnicity",
    dob: dayjs("dob"),
    pob_village: "pob_village",
    pob_commune: "pob_commune",
    pob_district: "pob_district",
    pob_city: "pob_city",
    house_no: "house_no",
    street: "8street",
    village: "village",
    commune: "commune",
    district: "district",
    city: "city",
    phone: "phone",
    emergency_contact: "emergency_contact",
    emergency_relation: "emergency_relation",
    emergency_village: "emergency_village",
    emergency_commune: "emergency_commune",
    emergency_district: "emergency_district",
    emergency_city: "emergency_city",
    emergency_phone: "emergency_phone",
    bac_grade: "bac_grade",
    bac_year: "bac_year",
    major: "major",
    duration: "duration",
  },
};

const HeaderDecorative = () => (
  <div className="header-decorative">
    <Image
      src={flourishSign}
      preview={false}
      alt="Decorative"
      width={60}
      className="decorative-image"
    />
  </div>
);

const Cover = () => {
  
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const searchFields = [
    { name: "batch", label: "Batch", placeholder: "Select Batch" },
    {
      name: "studyYear",
      label: "Study Year",
      placeholder: "Select Study Year",
    },
    { name: "major", label: "Major", placeholder: "Select Major" },
    { name: "faculty", label: "Faculty", placeholder: "Select Faculty" },
    { name: "Name", label: "Name", placeholder: "Select Name" },
  ];

  const onSearchFinish = (values) => {
    const studentData = MOCK_STUDENTS[values.Name];
    if (studentData) {
      form.setFieldsValue(studentData);
    }
  };

  const onFinish = (values) => {
    console.log("Application Data:", values);
  };

  return (
    
    <div className="scholarship-container">
      {/* Search Bar Section */}
      <div className="sticky-search">
        <Form
          form={searchForm}
          onFinish={onSearchFinish}
          layout="vertical"
          className="search-form"
          style={{
            background: token.colorFillAlter,
            padding: "24px",
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Row gutter={[16, 16]} align="bottom">
            {searchFields.map((field) => (
              <Col xs={24} sm={12} md={8} lg={4.8} key={field.name}>
                <Form.Item
                  name={field.name}
                  label={field.label}
                  className="search-form-item"
                >
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    options={[{ value: "all", label: "All" }]}
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            ))}

            <Col xs={24} sm={12} md={8} lg={4.8}>
                          <Form.Item className="search-form-item">
                            <Space className="search-button-space">
                              <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SearchOutlined />}
                                className="search-button"
                              >
                                Search
                              </Button>
                                <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: "white" }}>Print</Button>
                              
                              <Button
                                onClick={() => {
                                  form.resetFields();
                                  searchForm.resetFields();
                                }}
                                className="clear-button"
                              >
                                Clear
                              </Button>
                            </Space>
                          </Form.Item>
                        </Col>
          </Row>
        </Form>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="scholarship-form"
      >
        <div className="form-content">
                  <div className="national-header">
                    <Title level={3} className="national-title">
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </Title>
                    <Title level={4} className="national-subtitle">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </Title>
                    <HeaderDecorative />
                  </div>
        
                  {/* University Logo Section */}
                  <div className="university-header">
                    <Row justify="start">
                      <Col xs={24} sm={12}>
                        <Space
                          direction="vertical"
                          align="center"
                          className="university-logo-space"
                        >
                          <img
                            src="/asset/image/logo.png"
                            alt="CUMT Logo"
                            className="university-logo"
                          />
                          <div className="university-text-container">
                            <Text strong className="university-name-kh">
                              សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា
                            </Text>
                            <Text className="university-name-en">
                              CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY
                            </Text>
                          </div>
                        </Space>
                      </Col>
                    </Row>
                  </div>

          <div className="form-title-section">
            <Title level={3} className="form-main-title">
              ប្រវត្តិរូបសង្ខេប
            </Title>
          </div>

          <div className="responsive-lines">
            <div className="form-line">
              <span>ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ:</span>
              <Form.Item name="name_kh" noStyle><Input className="dotted-input input w-20" /></Form.Item>
              <span>ភេទ:</span>
              <Form.Item name="gender" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ថ្ងៃខែឆ្នាំកំណើត:</span>
              <Form.Item name="dob" noStyle><Input className="dotted-input input w-12" /></Form.Item>
              <span>អត្តសញ្ញាណប័ណ្ណលេខ:</span>
              <Form.Item name="IDcard" noStyle><Input className="dotted-input input w-17" /></Form.Item>
            </div>

            <div className="form-line">
              <Text strong>ទីកន្លែងកំណើត៖</Text>
              <span>ផ្ទះលេខ</span>
              <Form.Item name="pob_house" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ផ្លូវលេខ</span>
              <Form.Item name="pob_street" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ភូមិ</span>
              <Form.Item name="pob_village" noStyle><Input className="dotted-input input w-10" /></Form.Item>
              <span>ឃុំ/សង្កាត់</span>
              <Form.Item name="pob_commune" noStyle><Input className="dotted-input input w-17" /></Form.Item>
              <span>ស្រុក/ខណ្ឌ/ក្រុង</span>
              <Form.Item name="pob_district" noStyle><Input className="dotted-input input w-15" /></Form.Item>
            </div>

            <div className="form-line">
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="pob_city" noStyle><Input className="dotted-input input w-20" /></Form.Item>
            </div>

            <div className="form-line">
              <Text strong>អាសយដ្ឋានបច្ចុប្បន្ន៖</Text>
              <span>ផ្ទះលេខ</span>
              <Form.Item name="house_no" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ផ្លូវលេខ</span>
              <Form.Item name="street" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ភូមិ</span>
              <Form.Item name="village" noStyle><Input className="dotted-input input w-12" /></Form.Item>
              <span>ឃុំ/សង្កាត់</span>
              <Form.Item name="commune" noStyle><Input className="dotted-input input w-14" /></Form.Item>
              <span>ស្រុក/ខណ្ឌ/ក្រុង</span>
              <Form.Item name="district" noStyle><Input className="dotted-input input w-15" /></Form.Item>
            </div>

            <div className="form-line">
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="city" noStyle><Input className="dotted-input input w-20" /></Form.Item>
            </div>

            <div className="form-line">
              <span className="">កម្រិតវប្បធម៌ទូទៅ៖</span>
              <Form.Item name="highschool" noStyle><Input className="dotted-input input w-30" /></Form.Item>
              <span>នៅឆ្នាំ</span>
              <Form.Item name="start_year" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ដល់ឆ្នាំ</span>
              <Form.Item name="end_year" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="school_province" noStyle><Input className="dotted-input input w-10" /></Form.Item>
              <span>លទ្ធផលបាក់ឌុប</span>
              <Form.Item name="bacll" noStyle><Input className="dotted-input input w-5" /></Form.Item>
              <span>ឆ្នាំប្រឡង</span>
              <Form.Item name="bac_year" noStyle><Input className="dotted-input input w-10" /></Form.Item>
              <span>លេខបន្ទប់</span>
              <Form.Item name="room_no" noStyle><Input className="dotted-input input w-4" /></Form.Item>
              <span>លេខតុ</span>
              <Form.Item name="table_no" noStyle><Input className="dotted-input input w-4" /></Form.Item>
              <span>មណ្ឌលប្រឡង</span>
              <Form.Item name="exam_center" noStyle><Input className="dotted-input input w-30" /></Form.Item>
              <span>និទ្ទេស</span>
              <Form.Item name="grade" noStyle><Input className="dotted-input input w-3" /></Form.Item>
            </div>

            {/* FAMILY SECTION */}
            <div className="family-section">
              <div className="form-line">
                <Text className="" strong style={{ minWidth: '103px'}}>ព័ត៌មានគ្រួសារ៖</Text>
                <span>ឪពុកឈ្មោះ</span>
                <Form.Item name="father_name" noStyle><Input className="dotted-input input w-25" /></Form.Item>
                <span>មុខរបរបច្ចុប្បន្ន</span>
                <Form.Item name="father_job" noStyle><Input className="dotted-input input w-25" /></Form.Item>
              </div>
              <div className="form-line">
                <span style={{ marginLeft: '110px' }}>ម្តាយឈ្មោះ</span>
                <Form.Item name="mother_name" noStyle><Input className="dotted-input input w-25" /></Form.Item>
                <span>មុខរបរបច្ចុប្បន្ន</span>
                <Form.Item name="mother_job" noStyle><Input className="dotted-input input w-25" /></Form.Item>
              </div>
              <div className="form-line">
                <span style={{ marginLeft: '110px' }}>អាណាព្យាបាលឈ្មោះ</span>
                <Form.Item name="guardian_name" noStyle><Input className="dotted-input input w-21" /></Form.Item>
                <span>មុខរបរបច្ចុប្បន្ន</span>
                <Form.Item name="guardian_job" noStyle><Input className="dotted-input input w-20" /></Form.Item>
              </div>
              <div className="form-line">
                <span style={{ marginLeft: '110px' }}>អាស័យដ្ឋាន</span>
                <Form.Item name="family_address" noStyle><Input className="dotted-input input w-40" /></Form.Item>
              </div>
              <div className="form-line">
                <span style={{ marginLeft: '110px' }}>ទូរស័ព្ទ</span>
                <Form.Item name="phone" noStyle><Input className="dotted-input input w-20" /></Form.Item>
                <span>អ៊ីមែល</span>
                <Form.Item name="email" noStyle><Input className="dotted-input input w-25" /></Form.Item>
              </div>
           

            
 <div className="form-line commitment-text">
  <span>
    ខ្ញុំបាទ/នាងខ្ញុំសូមអះអាងថា ព័ត៌មានក្នុងប្រវត្តិរូបខាងលើនេះពិតជាត្រឹមត្រូវឥតក្លែងបន្លំឡើយ។ 
    ប្រសិនបើមានចំណុចណាមួយដែលប្រាសចាកពីការពិត ខ្ញុំបាទ/នាងខ្ញុំព្រមទទួល
  </span>
</div>
<div className="form-line">
  <span>
    ខុសត្រូវចំពោះមុខច្បាប់ជាធរមាន។
  </span>
</div>
 </div>
            <div className="signature-area sign-cover">
              <div className="lunar-date">ថ្ងៃ................ កើត ខែ............ ឆ្នាំ..................ស័ក ព.ស. ............</div>
              <div className="gregorian-date">រាជធានីភ្នំពេញ ថ្ងៃទី........ ខែ........ ឆ្នាំ២០២៥</div>
              <div className="sig-label khmer-moul">ហត្ថលេខា និងឈ្មោះ</div>
            </div>
            
          </div>
          
          {/* Footer */}
        <div className="form-footer footer-cover" style={{ marginTop:'360px' }}>
          <div className="footer-address">
            អាសយដ្ឋានៈ អគារលេខ១៤៧ក ផ្លូវឥដ្ឋច្រាស សង្កាត់ទូលសង្កែទី២
            ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ
          </div>
          <div className="footer-contact">
Hot Line: 023 902 220 | FAX: 023 902 221 | E-mail: cumt.cambodia@gmail.com | Website: www.cumt.edu.kh          </div>
        </div>
          </div>

        
      </Form>
      
    </div>
  );
};

export default Cover;

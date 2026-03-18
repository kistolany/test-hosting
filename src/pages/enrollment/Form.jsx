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
} from "antd";
import {
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import dayjs from "dayjs";
import flourishSign from "../../assets/image_69b387.png";

const { Title, Text } = Typography;

const MOCK_STUDENTS = {
  "Batch 1-រដ្ឋបាលសាធារណៈ-LIM FAHIMA": {
    name_kh: "លីម ហ្វាហ៊ីម៉ា",
    name_en: "LIM FAHIMA",
    dob: "01/01/2000",
    nationality: "ខ្មែរ",
    race: "ខ្មែរ",
    occupation: "សិស្ស",
    student_id: "CUMT-001",
    phone: "012 345 678",
    province: "ភ្នំពេញ",
    acad_start: "2023",
    acad_end: "2024",
    year_val: "1",
    faculty: "ព័ត៌មានវិទ្យា",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    promotion: "ទី៨",
    day: "ចន្ទ - សុក្រ",
    time: "វេនព្រឹក",
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

const EnrollmentForm = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const searchFields = [
    { name: "batch", label: "Batch", placeholder: "Select Batch" },
    { name: "studyYear", label: "Study Year", placeholder: "Select Study Year" },
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
      {/* Search Bar Section - Kept as per your code */}
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
                <Form.Item name={field.name} label={field.label} className="search-form-item">
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    options={[{ value: "Batch 1-រដ្ឋបាលសាធារណៈ-LIM FAHIMA", label: "LIM FAHIMA" }]}
                  />
                </Form.Item>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8} lg={4.8}>
              <Form.Item className="search-form-item">
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
                  <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: "white" }}>Print</Button>
                  <Button onClick={() => { form.resetFields(); searchForm.resetFields(); }}>Clear</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <Form form={form} layout="horizontal" onFinish={onFinish} className="scholarship-form">
        <div className="form-content">
          {/* Header Section */}
          <div className="national-header">
            <Title level={3} className="national-title">ព្រះរាជាណាចក្រកម្ពុជា</Title>
            <Title level={4} className="national-subtitle">ជាតិ សាសនា ព្រះមហាក្សត្រ</Title>
            <HeaderDecorative />
          </div>

          <div className="receipt-header">
            <div className="uni-brand-header">
              <div className="uni-brand-stack">
                <img src="/asset/image/logo.png" className="uni-brand-logo" alt="CUMT" />
                <div className="uni-brand-text-kh">សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
                <div className="uni-brand-text-en">CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
              </div>
              <div className="uni-serial-line">លេខ:..........................................................សកតប</div>
            </div>
            <div className="photo-box">4x6</div>
          </div>

          <div className="form-title-section1" >
            <Title level={3} className="form-main-title">ពាក្យចុះឈ្មោះសិក្សា</Title>
            <Title level={3} className="form-main-title-en">APPLICATION FORM</Title>
          </div>

          {/* MAIN FORM AREA: Matches Image structure exactly */}
<Row gutter={16} style={{ marginTop: '0px' }}>
  <Col span={14}>
    {[
      { labelKh: "ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ ជាភាសាខ្មែរ", name: "name_kh" },
      { labelKh: "Full name in English", name: "name_en" },
      { labelKh: "ថ្ងៃខែឆ្នាំកំណើត/ Date of birth", name: "dob" },
      { labelKh: "សញ្ជាតិ/Nationality", name: "nationality" },
      { labelKh: "ជនជាតិ/ Race", name: "race" },
      { labelKh: "មុខរបរសព្វថ្ងៃ/Current Occupation", name: "occupation" }
    ].map((item, idx) => (
      <div className="enroll-field-group" key={idx}>
        <span className="enroll-label-kh">{item.labelKh}</span>
        <Form.Item name={item.name} noStyle>
          <Input className="enroll-box-input" />
        </Form.Item>
      </div>
    ))}
  </Col>

  <Col span={10}>
    <div className="enroll-status-container">
      <div className="enroll-check-row">
        <span style={{ fontSize: '12px',marginRight:'50px' }}>ភេទ/Gender:</span>
        <div className="enroll-check-item">ប្រុស/Male <div className="enroll-square-indicator"></div></div>
      </div>
      <div className="enroll-check-row">
        <div className="enroll-check-item">ស្រី/Female <div className="enroll-square-indicator"></div></div>
      </div>
      <div className="enroll-check-row">
        <div className="enroll-check-item">នៅលីវ/Single <div className="enroll-square-indicator"></div></div>
      </div>
      <div className="enroll-check-row">
        <div className="enroll-check-item">មានគ្រួសារ/Married <div className="enroll-square-indicator"></div></div>
      </div>
    </div>

    {/* Right side inputs with shorter boxes */}
    <div className="enroll-field-group-right" style={{ marginTop: '20px' }}>
    <span className="enroll-label-right">អត្តលេខ/ Student ID</span>
    <Form.Item name="student_id" noStyle>
      <Input className="enroll-box-input2" />
    </Form.Item>
  </div>

  <div className="enroll-field-group-right">
    <span className="enroll-label-right">លេខទូរស័ព្ទ/ Phone N°</span>
    <Form.Item name="phone" noStyle>
      <Input className="enroll-box-input2" />
    </Form.Item>
  </div>

  <div className="enroll-field-group-right">
    <span className="enroll-label-right">រាជធានី/ខេត្ត/ Capital/Province</span>
    <Form.Item name="province" noStyle>
      <Input className="enroll-box-input2" />
    </Form.Item>
  </div>
  </Col>
</Row>

<div className="enroll-formal-center-header">
  <Title  className="form-main-title">សូមគោរពជូន</Title>
  <Title  className="form-main-title">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ នៃសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</Title>
  <Text className="enroll-en-sub">To H.E Dr. Rector of Cambodia University of Management and Technology</Text>
  <div className="enroll-request-body">
    <p className="enroll-kh-bold">ខ្ញុំបាទ/នាងខ្ញុំគោរពស្នើសុំចុះឈ្មោះចូលសិក្សា៖</p>
    <p className="enroll-en-sub">I would request to register for:</p>
  </div>
</div>

<Row gutter={24}>
  <Col span={15}>
    <div className="enroll-field-group enroll-year-row">
  <span style={{ fontSize: '12px' }}>ឆ្នាំសិក្សា/Academic Year</span>
  
  {/* First Year Box */}
  <Form.Item name="acad_start" noStyle>
    <Input className="enroll-box-year" />
  </Form.Item>
  
  <span className="enroll-dash-spacer">-</span>
  
  {/* Second Year Box */}
  <Form.Item name="acad_end" noStyle>
    <Input className="enroll-box-year" />
  </Form.Item>
  
  <span style={{ fontSize: '12px', marginLeft: '15px' }}>ឆ្នាំ/Year</span>
  
  {/* Single Year Box */}
  <Form.Item name="year_val" noStyle>
    <Input className="enroll-box-year" style={{ width: '60px' }} />
  </Form.Item>
</div>
    <div className="enroll-field-group enroll-mt-15">
      <span className="enroll-label-kh">មហាវិទ្យាល័យ/Faculties</span>
      <Form.Item name="faculty" noStyle><Input className="enroll-form-box" /></Form.Item>
    </div>
    <div className="enroll-field-group enroll-mt-15">
      <span className="enroll-label-kh">ជំនាញ/Major</span>
      <Form.Item name="major" noStyle><Input className="enroll-form-box" /></Form.Item>
    </div>
  </Col>

  <Col span={9}>
  <div className="enroll-field-group">
    <span className="enroll-label-sub">ជំនាន់/Promotion</span>
    <Form.Item name="promotion" noStyle>
      <Input className="enroll-box-small" />
    </Form.Item>
  </div>
  
  <div className="enroll-field-group enroll-mt-15">
    <span className="enroll-label-sub">ថ្ងៃសិក្សា/Day</span>
    <Form.Item name="day" noStyle>
      <Input className="enroll-box-small" />
    </Form.Item>
  </div>
  
  <div className="enroll-field-group enroll-mt-15">
    <span className="enroll-label-sub">វេនសិក្សា/Time</span>
    <Form.Item name="time" noStyle>
      <Input className="enroll-box-small" />
    </Form.Item>
  </div>
</Col>
</Row>

<div className="enroll-footer-notes">
  <p>ខ្ញុំបាទ/នាងខ្ញុំសូមសន្យា នឹងគោរពគោលការណ៍ និងបទបញ្ជាផ្ទៃក្នុងទាំងអស់របស់សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា។</p>
  <p className="enroll-en-sub">I acknowledge that I have to adhere the policies, regulation and all requirements for admission for university's rules.</p>
  <p className="enroll-mt-20">សូម <b>ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ</b> មេត្តាពិនិត្យអនុញ្ញាតឱ្យខ្ញុំបាទ/នាងខ្ញុំ បានចុះឈ្មោះចូលសិក្សានៅមហាវិទ្យាល័យដែលមានជំនាញដូចខាងលើដោយក្តីអនុគ្រោះ។</p>
  <p className="enroll-en-sub">I hereby request your kind admission for my enrollment in the above Faculty and field of study</p>
</div>

          {/* Attachment & Date Section - Kept from your code */}
          <div className="enroll-date-section">
             <div className="form-line date-line">
              <span>កាលបរិច្ឆេទ ថ្ងៃទី</span>
              <Form.Item name="khmer_date_day" noStyle><Input bordered={false} className="dotted-input w-4" /></Form.Item>
              <span>ខែ</span>
              <Form.Item name="khmer_date_month" noStyle><Input bordered={false} className="dotted-input w-8" /></Form.Item>
              <span>ឆ្នាំ</span>
              <Form.Item name="khmer_date_year" noStyle><Input bordered={false} className="dotted-input w-8" /></Form.Item>
            </div>
            <div className="signature-label">ហត្ថលេខា និងឈ្មោះ</div>
          </div>

          <Space direction="horizontal" className="" style={{ marginTop: '35px',marginBottom:'0px' }}>
                      <div className="form-note">
                        <Title className="form-note">ឯកសារភ្ជាប់មកជាមួយ៖</Title>
                        <Title className="form-note">១- វិញ្ញាបនបត្របណ្ដោះអាសន្ន</Title>
                        <Title className="form-note">២- សំបុត្រកំណើត (ច្បាប់ចម្លងមានបញ្ជាក់ត្រឹមត្រូវ)</Title>
                        <Title className="form-note">៣- រូបថត 4X6</Title>
                      
                      </div>
                      <div>
                        <Title className="form-note"></Title>
                        <Title className="form-note"></Title>
                        <Title className="form-note">០១ច្បាប់</Title>
                        <Title className="form-note">០១ច្បាប់</Title>
                        <Title className="form-note">០៤ច្បាប់</Title>

                      </div>
                    </Space>

          <div className="form-footer enroll-footer">
            <div className="footer-address">
              អាសយដ្ឋានៈ អគារលេខ១៤៧ក ផ្លូវឥដ្ឋច្រាស សង្កាត់ទួលសង្កែទី២ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ
            </div>
            <div className="footer-contact">
              Hot Line: 023 902 220 | FAX: 023 902 221 | E-mail: cumt.cambodia@gmail.com | Website: www.cumt.edu.kh
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
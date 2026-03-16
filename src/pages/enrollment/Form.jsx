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

const EnrollmentForm = () => {
  
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

          <div className="form-title-section">
            <Title level={3} className="form-main-title">
              ពាក្យចុះឈ្មោះសិក្សា
            </Title>
            <Title level={3} className="form-main-title-en">
              APPLYCATION FORM
            </Title>
          </div>

          {/* Form Fields Area */}
          <div className="responsive-lines">
            {/* Line 1: Name */}
            <div className="form-line">
              <span className="nameKh">ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ</span>
              <Form.Item name="name_kh" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-19 name-kh-input"
                />
              </Form.Item>
              <span>អក្សរឡាតាំង</span>
              <Form.Item name="name_en" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-19 name-en-input"
                />
              </Form.Item>
              <span>ភេទ</span>
              <Form.Item name="gender" noStyle>
                <Input bordered={false} className="dotted-input w-5 input gender-input" />
              </Form.Item>
              <span>សញ្ជាតិ</span>
              <Form.Item name="nationality" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-5 nationality-input"
                />
              </Form.Item>
              <span>ជនជាតិ</span>
              <Form.Item name="ethnicity" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-5 ethnicity-input"
                />
              </Form.Item>
            </div>

            {/* Line 2: DOB */}
            <div className="form-line">
              <span>ថ្ងៃខែឆ្នាំកំណើត</span>
              <Form.Item name="dob" noStyle>
                <DatePicker
                  bordered={false}
                  className="dotted-input w-14 dob-input"
                  format="DD/MM/YYYY"
                  placeholder=""
                />
              </Form.Item>
              <span>នៅភូមិ</span>
              <Form.Item name="pob_village" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 pob-village-input"
                />
              </Form.Item>
              <span>ឃុំ/សង្កាត់</span>
              <Form.Item name="pob_commune" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-12 pob-commune-input"
                />
              </Form.Item>
              <span>ស្រុក/ខណ្ឌ</span>
              <Form.Item name="pob_district" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-11 pob-district-input"
                />
              </Form.Item>
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="pob_city" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-11 pob-city-input"
                />
              </Form.Item>
            </div>

            {/* Line 3: Address */}
            <div className="form-line">
              <span>អាសយដ្ឋានបច្ចុប្បន្នផ្ទះលេខ</span>
              <Form.Item name="house_no" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-3 house-no-input"
                />
              </Form.Item>
              <span>ផ្លូវ</span>
              <Form.Item name="street" noStyle>
                <Input bordered={false} className="dotted-input input w-3 street-input" />
              </Form.Item>
              <span>ភូមិ</span>
              <Form.Item name="village" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 village-input"
                />
              </Form.Item>
              <span>ឃុំ/សង្កាត់</span>
              <Form.Item name="commune" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 commune-input"
                />
              </Form.Item>
              <span>ស្រុក/ខណ្ឌ</span>
              <Form.Item name="district" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-11 district-input"
                />
              </Form.Item>
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="city" noStyle>
                <Input bordered={false} className="dotted-input input w-10 city-input" />
              </Form.Item>
            </div>

            {/* Line 4: Phone */}
            <div className="form-line">
              <span>លេខទូរស័ព្ទ(ផ្ទាល់ខ្លួន)</span>
              <Form.Item name="phone" noStyle>
                <Input bordered={false} className="dotted-input input w-24 phone-input" />
                <span className="sign-end">។</span>
              </Form.Item>
              <span>ករណីបន្ទាន់ទាក់ទងឈ្មោះ</span>
              <Form.Item name="emergency_contact" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-21 emergency-contact-input"
                />
              </Form.Item>
              <span>ត្រូវជា</span>
              <Form.Item name="emergency_relation" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-13 emergency-relation-input"
                />
              </Form.Item>
            </div>

            {/* Line 3 (Repeat in your code): Emergency Address */}
            <div className="form-line">
              <span>អាសយដ្ឋាននៅភូមិ</span>
              <Form.Item name="village" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-7 village-input-emergency"
                />
              </Form.Item>
              <span>ឃុំ/សង្កាត់</span>
              <Form.Item name="commune" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-9 commune-input-emergency"
                />
              </Form.Item>
              <span>ស្រុក/ខណ្ឌ</span>
              <Form.Item name="district" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-11 district-input-emergency"
                />
              </Form.Item>
              <span>រាជធានី/ខេត្ត</span>
              <Form.Item name="city" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 city-input-emergency"
                />
              </Form.Item>
              <span>លេខទូរស័ព្ទ</span>
              <Form.Item name="phone" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-13 phone-input-emergency"
                />
                <span className="sign-end">។</span>
              </Form.Item>
            </div>

            <div className="form-title-section2">
              <Title level={3} className="form-main-title">
                សូមគោរពជូន
              </Title>
              <Title level={4} className="form-subtitle">
                ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ
              </Title>
              <Text strong className="form-university-name">
                នៃសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា
              </Text>
            </div>

            <div className="commitment-section">
              <div className="subject-line">
                <span className="subject-bold">កម្មវត្ថុ៖</span>{" "}
                សំណើសុំអាហារូបករណ៍ចូលរៀនថ្នាក់បរិញ្ញាបត្រ នៅសាកលវិទ្យល័យកម្ពុជា
                គ្រប់គ្រង និងបច្ចេកវិទ្យា
              </div>
              <div className="subject-line2">
                សេចក្តីដូចមានចែងក្នុងកម្មវត្ថុខាងលើ ខ្ញុំបាទ/នាងខ្ញុំ
                មានកិត្តិយសសូមគោរពជូន{" "}
                <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ</span>{" "}
                មេត្តាជ្រាបថា ខ្ញុំបាទ/នាងខ្ញុំ ជាសិស្សជាប់និទ្ទេស{" "}
              </div>
              <Form.Item name="grade" noStyle>
                (<Input bordered={false} className="dotted-input input w-2 grade-input" />
                )
              </Form.Item>
              <span className="subject-line3">
                {" "}
                នៃការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) សម័យប្រឡងឆ្នាំ
              </span>
              <Form.Item name="yearExam" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-4 yearExam-input"
                />
                <span className="sign-end">។</span>
              </Form.Item>
              <span>
                {" "}
                ខ្ញុំបាទ/នាងខ្ញុំ
                មានបំណងស្នើសុំអាហារូបករណ៍ចុះឈ្មោះចូលរៀនថ្នាក់បរិញ្ញាបត្រនៅសាកលវិទ្យាល័យ
                កម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា លើមុខជំនាញ{" "}
              </span>
              <Form.Item name="major" noStyle>
                <Input bordered={false} className="dotted-input input w-25 major-input" />
              </Form.Item>
              <span>សម្រាប់ឆ្នាំសិក្សា </span>
              <Form.Item name="year" noStyle>
                <Input bordered={false} className="dotted-input input w-11 year-input" />
              </Form.Item>
              <span>រយៈពេល</span>
              <Form.Item name="duration" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-5 duration-input"
                />
              </Form.Item>
              <span>ឆ្នាំ។</span>

              <p className="commitment-text">
                ខ្ញុំបាទ/នាងខ្ញុំសូមសន្យាថានឹងខិតខំសិក្សា មិនបោះបង់ការសិក្សា
                តស៊ូរៀនសូត្រឱ្យបានចប់សព្វគ្រប់ទៅតាមការកំណត់ ហើយគោរព តាមគោលការណ៍
                និងបទបញ្ជាផ្ទៃក្នុងរបស់
              </p>
              <p>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា ។</p>

              <p className="commitment-text">
                អាស្រ័យដូចបានគោរពជម្រាបជូនខាងលើ ខ្ញុំបាទ/នាងខ្ញុំ សូម{" "}
                <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ </span>{" "}
                មេត្តាពិនិត្យលទ្ធភាព និងអនុញ្ញាត ផ្តល់អាហារូបករណ៍ដល់ខ្ញុំបាទ/នាង
              </p>
              <p>
                ខ្ញុំ បានចូលសិក្សាថ្នាក់បរិញ្ញាបត្រ នៅសាកលវិទ្យាល័យកម្ពុជា
                គ្រប់គ្រង និងបច្ចេកវិទ្យា លើមុខជំនាញឯកទេសខាងលើដោយក្តីអនុគ្រោះ។
              </p>

              <p className="commitment-text">
                សូម <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ </span>{" "}
                មេត្តាទទួលនូវការគោរពដ៏ខ្ពង់ខ្ពស់អំពីខ្ញុំបាទ/នាងខ្ញុំ។
              </p>
            </div>
          </div>
          {/* Date Section */}
          <div className="date-section">
            <div className="form-line date-line1">
              <span>ថ្ងៃ</span>
              <Form.Item name="khmer_date_day" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-5 date-day-input"
                />
              </Form.Item>
              <span>ខែ</span>
              <Form.Item name="khmer_date_month" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-9 date-month-input"
                />
              </Form.Item>
              <span>ឆ្នាំ</span>
              <Form.Item name="khmer_date_year" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 date-year-input"
                />
              </Form.Item>
            </div>
            <div className="form-line date-line">
              <span>រាជធានីភ្នំពេញ ថ្ងៃទី</span>
              <Form.Item name="khmer_date_day" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-5 date-day-input"
                />
              </Form.Item>
              <span>ខែ</span>
              <Form.Item name="khmer_date_month" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-9 date-month-input"
                />
              </Form.Item>
              <span>ឆ្នាំ</span>
              <Form.Item name="khmer_date_year" noStyle>
                <Input
                  bordered={false}
                  className="dotted-input input w-10 date-year-input"
                />
              </Form.Item>
            </div>
            <div className="signature-label">ហត្ថលេខា និងឈ្មោះ</div>
          </div>
          <Space direction="horizontal" className="attachment-section">
            <div className="form-note">
              <Title className="form-note">ឯកសារភ្ជាប់មកជាមួយ៖</Title>
              <Title className="form-note">១- ពាក្យស្នើសុំអាហារូបករណ៍</Title>
              <Title className="form-note">២- ប្រវត្តិរូបសង្ខេប</Title>
              <Title className="form-note">៣- វិញ្ញាបនបត្របណ្តោះអាសន្ន</Title>
              <Title className="form-note">
                ៤- សំបុត្រកំណើត(ថតចម្លងបញ្ជាក់ត្រឹមត្រូវ)
              </Title>
              <Title className="form-note">
                ៥- លិខិតបញ្ជាក់ស្ថានភាពគ្រួសារ ឬប័ណ្ណក្រីក្រ
              </Title>
              <Title className="form-note">
                ៦- បង្កាន់ដៃទទួលពាក្យស្នើសុំអាហារូបករណ៍
              </Title>
              <Title className="form-note">៧- រូបថត ៤ x ៦ (ថ្មី)</Title>
            </div>
            <div>
              <Title className="form-note"></Title>
              <Title className="form-note"></Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០១ច្បាប់</Title>
              <Title className="form-note">០៦ច្បាប់</Title>
            </div>
          </Space>
           {/* Footer */}
          <div className="form-footer">
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

export default EnrollmentForm;

import React,{ useState } from "react";
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
  SaveOutlined,
  PrinterOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import flourishSign from "../../assets/image_69b387.png";

const { Title, Text } = Typography;

const MOCK_STUDENTS = {
  "SOK SOMNANG": {
    name_kh: "សុខ សំណាង",
    name_en: "SOK SOMNANG",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: dayjs("2003-05-15"),
    pob_village: "ព្រែកលៀប",
    pob_commune: "ព្រែកលៀប",
    pob_district: "ជ្រោយចង្វារ",
    pob_city: "ភ្នំពេញ",
    house_no: "12A",
    street: "598",
    village: "ទួលសង្កែ",
    commune: "ទួលសង្កែ",
    district: "ឫស្សីកែវ",
    city: "ភ្នំពេញ",
    phone: "012 345 678",
    emergency_contact: "សុខ ជា",
    emergency_relation: "ឪពុក",
    emergency_village: "ព្រែកលៀប",
    emergency_commune: "ព្រែកលៀប",
    emergency_district: "ជ្រោយចង្វារ",
    emergency_city: "ភ្នំពេញ",
    emergency_phone: "099 888 777",
    grade: "A",
    year_exam: "2023",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    batch: "Batch 10",
    duration: "4",
    year_study: "2024-2025",
    year: "២០២៤"
  },
  "CHHAY LINDA": {
    name_kh: "ឆាយ លីនដា",
    name_en: "CHHAY LINDA",
    gender: "ស្រី",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: dayjs("2004-11-20"),
    pob_village: "ភូមិ៣",
    pob_commune: "វាលវង់",
    pob_district: "៧មករា",
    pob_city: "ភ្នំពេញ",
    house_no: "45",
    street: "271",
    village: "បឹងទំពុន",
    commune: "បឹងទំពុន",
    district: "មានជ័យ",
    city: "ភ្នំពេញ",
    phone: "010 111 222",
    emergency_contact: "មាស ស្រីមុំ",
    emergency_relation: "ម្តាយ",
    emergency_village: "ភូមិ៣",
    emergency_commune: "វាលវង់",
    emergency_district: "៧មករា",
    emergency_city: "ភ្នំពេញ",
    emergency_phone: "012 000 111",
    grade: "B",
    year_exam: "2023",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    batch: "Batch 10",
    duration: "4",
    year_study: "2024-2025",
    year: "២០២៤"
  },
  "KEP MUNY": {
    name_kh: "កែប មុនី",
    name_en: "KEP MUNY",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: dayjs("2002-01-10"),
    pob_village: "កម្មករ",
    pob_commune: "ស្វាយប៉ោ",
    pob_district: "បាត់ដំបង",
    pob_city: "បាត់ដំបង",
    house_no: "102",
    street: "03",
    village: "វត្តបូព៌",
    commune: "សាលាកំរើក",
    district: "សៀមរាប",
    city: "សៀមរាប",
    phone: "088 555 666",
    emergency_contact: "កែប សុភ័ក្ត្រ",
    emergency_relation: "បងប្រុស",
    emergency_village: "កម្មករ",
    emergency_commune: "ស្វាយប៉ោ",
    emergency_district: "បាត់ដំបង",
    emergency_city: "បាត់ដំបង",
    emergency_phone: "017 444 333",
    grade: "C",
    year_exam: "2022",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    batch: "Batch 10",
    duration: "4",
    year_study: "2024-2025",
    year: "២០២៤"
  },
  "LIM SREYROTH": {
    name_kh: "លីម ស្រីរ័ត្ន",
    name_en: "LIM SREYROTH",
    gender: "ស្រី",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: dayjs("2005-08-30"),
    pob_village: "កណ្តាល",
    pob_commune: "រលួស",
    pob_district: "កណ្តាលស្ទឹង",
    pob_city: "កណ្តាល",
    house_no: "5BT",
    street: "371",
    village: "ភូមិ៦",
    commune: "ទឹកថ្លា",
    district: "សែនសុខ",
    city: "ភ្នំពេញ",
    phone: "077 222 333",
    emergency_contact: "ហេង លីម",
    emergency_relation: "ឪពុក",
    emergency_village: "កណ្តាល",
    emergency_commune: "រលួស",
    emergency_district: "កណ្តាលស្ទឹង",
    emergency_city: "កណ្តាល",
    emergency_phone: "012 999 000",
    grade: "A",
    year_exam: "2024",
    major: "សេដ្ឋកិច្ចឌីជីថល",
    faculty: "វិទ្យាសាស្ត្រសេដ្ឋកិច្ច",
    batch: "Batch 11",
    duration: "4",
    year_study: "2024-2025"
  },
  "VONG RAKSMEY": {
    name_kh: "វង្ស រស្មី",
    name_en: "VONG RAKSMEY",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: dayjs("2003-03-12"),
    pob_village: "ផ្សារលើ",
    pob_commune: "ស្វាយរៀង",
    pob_district: "ស្វាយរៀង",
    pob_city: "ស្វាយរៀង",
    house_no: "88",
    street: "V12",
    village: "ទួលគោក",
    commune: "ទួលសង្កែ២",
    district: "ឫស្សីកែវ",
    city: "ភ្នំពេញ",
    phone: "016 777 888",
    emergency_contact: "វង្ស វ៉ា",
    emergency_relation: "ឪពុក",
    emergency_village: "ផ្សារលើ",
    emergency_commune: "ស្វាយរៀង",
    emergency_district: "ស្វាយរៀង",
    emergency_city: "ស្វាយរៀង",
    emergency_phone: "092 333 444",
    grade: "B",
    year_exam: "2021",
    major: "រដ្ឋបាលសាធារណៈ",
    faculty: "វិទ្យាសាស្ត្រសង្គម",
    batch: "Batch 08",
    duration: "4",
    year_study: "2022-2023"
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

const ScholarshipForm = () => {
  const { token } = theme.useToken();
  const [searchForm] = Form.useForm();
  const [displayedStudents, setDisplayedStudents] = useState([{}]);

  const searchFields = [
    { name: "batch", label: "Batch", placeholder: "Select Batch" },
    { name: "studyYear", label: "Study Year", placeholder: "Select Study Year" },
    { name: "major", label: "Major", placeholder: "Select Major" },
    { name: "faculty", label: "Faculty", placeholder: "Select Faculty" },
    { name: "Name", label: "Name", placeholder: "Select Name" },
  ];

  const onSearchFinish = (values) => {
    const filteredResults = Object.values(MOCK_STUDENTS).filter((s) => {
      return (
        (!values.batch || s.batch === values.batch) &&
        (!values.studyYear || s.year_study === values.studyYear) &&
        (!values.major || s.major === values.major) &&
        (!values.faculty || s.faculty === values.faculty) &&
        (!values.Name || s.name_en === values.Name)
      );
    });

    setDisplayedStudents(filteredResults.length > 0 ? filteredResults : [{}]);
  };

  return (
    <div className="scholarship-container">
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
            marginBottom: "20px",
          }}
        >
          <Row gutter={[16, 16]} align="bottom">
            {searchFields.map((field) => (
              <Col xs={24} sm={20} md={8} lg={4.8} key={field.name}>
                <Form.Item name={field.name} label={field.label} className="search-form-item">
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    allowClear
                    options={
                      field.name === "Name"
                        ? Object.values(MOCK_STUDENTS).map((s) => ({ value: s.name_en, label: s.name_en }))
                        : field.name === "major"
                        ? [...new Set(Object.values(MOCK_STUDENTS).map((s) => s.major))].map((m) => ({ value: m, label: m }))
                        : field.name === "batch"
                        ? [...new Set(Object.values(MOCK_STUDENTS).filter(s => s.batch).map((s) => s.batch))].map((b) => ({ value: b, label: b }))
                        : field.name === "studyYear"
                        ? [...new Set(Object.values(MOCK_STUDENTS).map((s) => s.year_study))].map((y) => ({ value: y, label: y }))
                        : field.name === "faculty"
                        ? [...new Set(Object.values(MOCK_STUDENTS).filter(s => s.faculty).map((s) => s.faculty))].map((f) => ({ value: f, label: f }))
                        : []
                    }
                    optionFilterProp="label"
                  />
                </Form.Item>
              </Col>
            ))}

            <Col xs={24} sm={12} md={8} lg={4.8}>
              <Form.Item className="search-form-item">
                <Space>
                  <Button style={{ backgroundColor: "#070f7a"}} type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    Search
                  </Button>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={() => window.print()}
                    style={{ backgroundColor: "#070f7a", color: "white" }}
                  >
                    Print
                  </Button>
                  <Button
                    icon={<ClearOutlined />}
                    onClick={() => {
                      searchForm.resetFields();
                      setDisplayedStudents([{}]);
                    }}
                  />
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {displayedStudents.map((student, index) => (
        <Form
          key={student.name_en || index}
          initialValues={student}
          layout="vertical"
          className="scholarship-form"
          style={{ marginBottom: "50px", pageBreakAfter: "always" }}
        >
          <div className="form-content">
            <div className="national-header">
              <Title level={3} className="national-title">ព្រះរាជាណាចក្រកម្ពុជា</Title>
              <Title level={4} className="national-subtitle">ជាតិ សាសនា ព្រះមហាក្សត្រ</Title>
              <HeaderDecorative />
            </div>

            <div className="university-header">
              <Row justify="start">
                <Col xs={24} sm={12}>
                  <Space direction="vertical" align="center" className="university-logo-space">
                    <img src="/asset/image/logo.png" alt="CUMT Logo" className="university-logo" />
                    <div className="university-text-container">
                      <Text strong className="university-name-kh">សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</Text>
                      <Text className="university-name-en">CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>

            <div className="form-title-section">
              <Title level={3} className="form-main-title">ពាក្យស្នើសុំអាហារូបករណ៍</Title>
              <Title level={4} className="form-subtitle">
                ថ្នាក់បរិញ្ញាបត្រ ឆ្នាំសិក្សា
                <Form.Item name="year-study" noStyle><Input bordered={false} className="input-title-year w-16 year-study-input" /></Form.Item>
              </Title>
              <Text strong className="form-university-name">នៅសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</Text>
            </div>

            <div className="responsive-lines">
              <div className="form-line">
                <span className="nameKh">ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ</span>
                <Form.Item name="name_kh" noStyle><Input bordered={false} className="dotted-input input w-19 name-kh-input" /></Form.Item>
                <span>អក្សរឡាតាំង</span>
                <Form.Item name="name_en" noStyle><Input bordered={false} className="dotted-input input w-19 name-en-input" /></Form.Item>
                <span>ភេទ</span>
                <Form.Item name="gender" noStyle><Input bordered={false} className="dotted-input w-5 input gender-input" /></Form.Item>
                <span>សញ្ជាតិ</span>
                <Form.Item name="nationality" noStyle><Input bordered={false} className="dotted-input input w-5 nationality-input" /></Form.Item>
                <span>ជនជាតិ</span>
                <Form.Item name="ethnicity" noStyle><Input bordered={false} className="dotted-input input w-5 ethnicity-input" /></Form.Item>
              </div>

              <div className="form-line">
                <span>ថ្ងៃខែឆ្នាំកំណើត</span>
                <Form.Item name="dob" noStyle><DatePicker bordered={false} className="dotted-input w-14 dob-input" format="DD/MM/YYYY" placeholder="" /></Form.Item>
                <span>នៅភូមិ</span>
                <Form.Item name="pob_village" noStyle><Input bordered={false} className="dotted-input input w-10 pob-village-input" /></Form.Item>
                <span>ឃុំ/សង្កាត់</span>
                <Form.Item name="pob_commune" noStyle><Input bordered={false} className="dotted-input input w-12 pob-commune-input" /></Form.Item>
                <span>ស្រុក/ខណ្ឌ</span>
                <Form.Item name="pob_district" noStyle><Input bordered={false} className="dotted-input input w-11 pob-district-input" /></Form.Item>
                <span>រាជធានី/ខេត្ត</span>
                <Form.Item name="pob_city" noStyle><Input bordered={false} className="dotted-input input w-11 pob-city-input" /></Form.Item>
              </div>

              <div className="form-line">
                <span>អាសយដ្ឋានបច្ចុប្បន្នផ្ទះលេខ</span>
                <Form.Item name="house_no" noStyle><Input bordered={false} className="dotted-input input w-3 house-no-input" /></Form.Item>
                <span>ផ្លូវ</span>
                <Form.Item name="street" noStyle><Input bordered={false} className="dotted-input input w-3 street-input" /></Form.Item>
                <span>ភូមិ</span>
                <Form.Item name="village" noStyle><Input bordered={false} className="dotted-input input w-10 village-input" /></Form.Item>
                <span>ឃុំ/សង្កាត់</span>
                <Form.Item name="commune" noStyle><Input bordered={false} className="dotted-input input w-10 commune-input" /></Form.Item>
                <span>ស្រុក/ខណ្ឌ</span>
                <Form.Item name="district" noStyle><Input bordered={false} className="dotted-input input w-11 district-input" /></Form.Item>
                <span>រាជធានី/ខេត្ត</span>
                <Form.Item name="city" noStyle><Input bordered={false} className="dotted-input input w-10 city-input" /></Form.Item>
              </div>

              <div className="form-line">
                <span>លេខទូរស័ព្ទ(ផ្ទាល់ខ្លួន)</span>
                <Form.Item name="phone" noStyle><Input bordered={false} className="dotted-input input w-24 phone-input" /></Form.Item><span className="sign-end">។</span>
                <span>ករណីបន្ទាន់ទាក់ទងឈ្មោះ</span>
                <Form.Item name="emergency_contact" noStyle><Input bordered={false} className="dotted-input input w-21 emergency-contact-input" /></Form.Item>
                <span>ត្រូវជា</span>
                <Form.Item name="emergency_relation" noStyle><Input bordered={false} className="dotted-input input w-13 emergency-relation-input" /></Form.Item>
              </div>

              <div className="form-line">
                <span>អាសយដ្ឋាននៅភូមិ</span>
                <Form.Item name="emergency_village" noStyle><Input bordered={false} className="dotted-input input w-9 village-input-emergency" /></Form.Item>
                <span>ឃុំ/សង្កាត់</span>
                <Form.Item name="emergency_commune" noStyle><Input bordered={false} className="dotted-input input w-9 commune-input-emergency" /></Form.Item>
                <span>ស្រុក/ខណ្ឌ</span>
                <Form.Item name="emergency_district" noStyle><Input bordered={false} className="dotted-input input w-11 district-input-emergency" /></Form.Item>
                <span>រាជធានី/ខេត្ត</span>
                <Form.Item name="emergency_city" noStyle><Input bordered={false} className="dotted-input input w-8 city-input-emergency" /></Form.Item>
                <span>លេខទូរស័ព្ទ</span>
                <Form.Item name="emergency_phone" noStyle><Input bordered={false} className="dotted-input input w-14 phone-input-emergency" /></Form.Item><span className="sign-end">។</span>
              </div>

              <div className="form-title-section2">
                <Title level={3} className="form-main-title">សូមគោរពជូន</Title>
                <Title level={4} className="form-subtitle">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ</Title>
                <Text strong className="form-university-name">នៃសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</Text>
              </div>

              <div className="commitment-section">
                <div className="subject-line">
                  <span className="subject-bold">កម្មវត្ថុ៖</span> សំណើសុំអាហារូបករណ៍ចូលរៀនថ្នាក់បរិញ្ញាបត្រ នៅសាកលវិទ្យល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា
                </div>
                <div className="subject-line2">
                  សេចក្តីដូចមានចែងក្នុងកម្មវត្ថុខាងលើ ខ្ញុំបាទ/នាងខ្ញុំ មានកិត្តិយសសូមគោរពជូន <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ</span> មេត្តាជ្រាបថា ខ្ញុំបាទ/នាងខ្ញុំ ជាសិស្សជាប់និទ្ទេស 
                </div>
                <Form.Item name="grade" noStyle><Input bordered={false} className="dotted-input input w-2 grade-input" /></Form.Item>
                <span className="subject-line3"> នៃការប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) សម័យប្រឡងឆ្នាំ </span>
                <Form.Item name="year_exam" noStyle><Input bordered={false} className="dotted-input input w-4 yearExam-input" /></Form.Item>
                <span>។ ខ្ញុំបាទ/នាងខ្ញុំ មានបំណងស្នើសុំអាហារូបករណ៍ចុះឈ្មោះចូលរៀនថ្នាក់បរិញ្ញាបត្រនៅសាកលវិទ្យាល័យ កម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា លើមុខជំនាញ </span>
                <Form.Item name="major" noStyle><Input bordered={false} className="dotted-input input w-25 major-input" /></Form.Item>
                <span>សម្រាប់ឆ្នាំសិក្សា </span>
                <Form.Item name="year_study" noStyle><Input bordered={false} className="dotted-input input w-11 year-input" /></Form.Item>
                <span>រយៈពេល</span>
                <Form.Item name="duration" noStyle><Input bordered={false} className="dotted-input input w-5 duration-input" /></Form.Item>
                <span>ឆ្នាំ។</span>

                <p className="commitment-text">ខ្ញុំបាទ/នាងខ្ញុំសូមសន្យាថានឹងខិតខំសិក្សា មិនបោះបង់ការសិក្សា តស៊ូរៀនសូត្រឱ្យបានចប់សព្វគ្រប់ទៅតាមការកំណត់ ហើយគោរព តាមគោលការណ៍ និងបទបញ្ជាផ្ទៃក្នុងរបស់</p>
                <p>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា ។</p>

                <p className="commitment-text">អាស្រ័យដូចបានគោរពជម្រាបជូនខាងលើ ខ្ញុំបាទ/នាងខ្ញុំ សូម <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ </span> មេត្តាពិនិត្យលទ្ធភាព និងអនុញ្ញាត ផ្តល់អាហារូបករណ៍ដល់ខ្ញុំបាទ/នាង</p>
                <p>ខ្ញុំ បានចូលសិក្សាថ្នាក់បរិញ្ញាបត្រ នៅសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា លើមុខជំនាញឯកទេសខាងលើដោយក្តីអនុគ្រោះ។</p>

                <p className="commitment-text">សូម <span className="EK">ឯកឧត្តមបណ្ឌិត សាកលវិទ្យាធិការ </span> មេត្តាទទួលនូវការគោរពដ៏ខ្ពង់ខ្ពស់អំពីខ្ញុំបាទ/នាងខ្ញុំ។</p>
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
          <div className="form-footer">
            <div className="footer-address">
              អាសយដ្ឋានៈ អគារលេខ១៤៧ក ផ្លូវឥដ្ឋច្រាស សង្កាត់ទូលសង្កែទី២
              ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ
            </div>
            <div className="footer-contact">
              Hot Line: 023 902 220 | FAX: 023 902 221 | E-mail:
              cumt.cambodia@gmail.com | Website: www.cumt.edu.kh{" "}
            </div>
          </div>
        </div>
      </Form>
      ))}
    </div>
);
};

export default ScholarshipForm;
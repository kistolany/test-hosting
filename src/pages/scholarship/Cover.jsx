import React, { useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Image,
  Select,
  theme,
  Flex,
} from "antd";
import {
  PrinterOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import flourishSign from "../../assets/image_69b387.png";

const { Title, Text } = Typography;

const MOCK_STUDENTS = {

  "LIM FAHIMA": {

    name_kh: "លីម ហ្វាហ៊ីម៉ា",

    name_en: "LIM FAHIMA",

    gender: "ស្រី",

    dob: "០១-មករា-២០០២",

    IDcard: "010203040",

    pob_house: "១២៣",

    pob_street: "០៨",

    pob_village: "ភូមិ១",

    pob_commune: "វាលវង់",

    pob_district: "៧មករា",

    pob_city: "ភ្នំពេញ",

    house_no: "១២៣",

    street: "០៨",

    village: "ភូមិ១",

    commune: "វាលវង់",

    district: "៧មករា",

    city: "ភ្នំពេញ",

    highschool: "វិទ្យាល័យបាក់ទូក",

    start_year: "២០១៦",

    end_year: "២០១៩",

    school_province: "ភ្នំពេញ",

    bacll: "ជាប់",

    bac_year: "២០១៩",

    room_no: "១២",

    table_no: "២៥",

    exam_center: "បាក់ទូក",

    grade: "B",

    father_name: "លីម ហុីម",

    father_job: "អាជីវករ",

    mother_name: "សួស ម៉ារី",

    mother_job: "មេផ្ទះ",

    guardian_name: "លីម ហុីម",

    guardian_job: "អាជីវករ",

    family_address: "ភ្នំពេញ",

    phone: "012 345 678",

    email: "fahima.lim@email.com",

    batch: "០១",

    major: "រដ្ឋបាលសាធារណៈ",

    faculty: "វិទ្យាសាស្ត្រសង្គម",

    year_study: "២០២៦-២០២៧"

  },

  "CHAN THYDA": {

    name_kh: "ចាន់ ធីតា",

    name_en: "CHAN THYDA",

    gender: "ស្រី",

    dob: "១៥-ឧសភា-២០០៣",

    IDcard: "050607080",

    pob_house: "៤៥",

    pob_street: "២៧១",

    pob_village: "បឹងទំពុន",

    pob_commune: "បឹងទំពុន",

    pob_district: "មានជ័យ",

    pob_city: "ភ្នំពេញ",

    house_no: "៤៥",

    street: "២៧១",

    village: "បឹងទំពុន",

    commune: "បឹងទំពុន",

    district: "មានជ័យ",

    city: "ភ្នំពេញ",

    highschool: "វិទ្យាល័យហ៊ុនសែនបឹងទំពុន",

    start_year: "២០២០",

    end_year: "២០២០",

    school_province: "ភ្នំពេញ",

    bacll: "ជាប់",

    bac_year: "២០២០",

    room_no: "០៥",

    table_no: "១៤",

    exam_center: "ច្បារអំពៅ",

    grade: "A",

    father_name: "ចាន់ ថន",

    father_job: "បុគ្គលិករដ្ឋ",

    mother_name: "មាស សុខា",

    mother_job: "គ្រូបង្រៀន",

    guardian_name: "ចាន់ ថន",

    guardian_job: "បុគ្គលិករដ្ឋ",

    family_address: "ភ្នំពេញ",

    phone: "098 765 432",

    email: "thyda.chan@email.com",

    batch: "០១",

    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",

    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",

    year_study: "២០២៥-២០២៦"

  },

  "SENG SAMNANG": {

    name_kh: "សេង សំណាង",

    name_en: "SENG SAMNANG",

    gender: "ប្រុស",

    dob: "១០-មិថុនា-២០០១",

    IDcard: "090807060",

    pob_house: "១២A",

    pob_street: "១៩៨៦",

    pob_village: "ភ្នំពេញថ្មី",

    pob_commune: "ភ្នំពេញថ្មី",

    pob_district: "សែនសុខ",

    pob_city: "ភ្នំពេញ",

    house_no: "១២A",

    street: "១៩៨៦",

    village: "ភ្នំពេញថ្មី",

    commune: "ភ្នំពេញថ្មី",

    district: "សែនសុខ",

    city: "ភ្នំពេញ",

    highschool: "វិទ្យាល័យភ្នំពេញថ្មី",

    start_year: "២០២១",

    end_year: "២០១៨",

    school_province: "ភ្នំពេញ",

    bacll: "ជាប់",

    bac_year: "២០១៨",

    room_no: "២១",

    table_no: "០៩",

    exam_center: "សន្ធរម៉ុក",

    grade: "C",

    father_name: "សេង ហេង",

    father_job: "អ្នកបើកបរ",

    mother_name: "យន់ ស្រីមុំ",

    mother_job: "លក់ដូរ",

    guardian_name: "សេង ហេង",

    guardian_job: "អ្នកបើកបរ",

    family_address: "ភ្នំពេញ",

    phone: "088 123 456",

    email: "samnang.seng@email.com",

    batch: "០១",

    major: "គ្រប់គ្រង",

    faculty: "គ្រប់គ្រងពាណិជ្ជកម្ម",

    year_study: "២០២៥-២០២៦"

  },

  "KEP MUNY": {

    name_kh: "កែប មុនី",

    name_en: "KEP MUNY",

    gender: "ប្រុស",

    dob: "២០-ធ្នូ-២០០៤",

    IDcard: "112233445",

    pob_house: "៨៨",

    pob_street: "V12",

    pob_village: "ទួលសង្កែ",

    pob_commune: "ទួលសង្កែ២",

    pob_district: "ឫស្សីកែវ",

    pob_city: "ភ្នំពេញ",

    house_no: "៨៨",

    street: "V12",

    village: "ទួលសង្កែ",

    commune: "ទួលសង្កែ២",

    district: "ឫស្សីកែវ",

    city: "ភ្នំពេញ",

    highschool: "វិទ្យាល័យឬស្សីកែវ",

    start_year: "២០១៨",

    end_year: "២០២២",

    school_province: "ភ្នំពេញ",

    bacll: "ជាប់",

    bac_year: "២០២១",

    room_no: "០ graduation",

    table_no: "៣០",

    exam_center: "ឫស្សីកែវ",

    grade: "B",

    father_name: "កែប សុផល",

    father_job: "វិស្វករ",

    mother_name: "អ៊ុច ចាន់នី",

    mother_job: "បុគ្គលិកក្រុមហ៊ុន",

    guardian_name: "កែប សុផល",

    guardian_job: "វិស្វករ",

    family_address: "ភ្នំពេញ",

    phone: "077 445 566",

    email: "muny.kep@email.com",

    batch: "០២",

    major: "សេដ្ឋកិច្ចឌីជីថល",

    faculty: "សេដ្ឋកិច្ច",

    year_study: "២០២៧-២០២៨"

  },

  "CHHAY LINDA": {

    name_kh: "ឆាយ លីនដា",

    name_en: "CHHAY LINDA",

    gender: "ស្រី",

    dob: "១១-វិច្ឆិកា-២០០៣",

    IDcard: "998877665",

    pob_house: "១០២",

    pob_street: "០៣",

    pob_village: "វត្តបូព៌",

    pob_commune: "សាលាកំរើក",

    pob_district: "សៀមរាប",

    pob_city: "សៀមរាប",

    house_no: "១០២",

    street: "០៣",

    village: "វត្តបូព៌",

    commune: "សាលាកំរើក",

    district: "សៀមរាប",

    city: "សៀមរាប",

    highschool: "វិទ្យាល័យ១០មករា",

    start_year: "២០២១",

    end_year: "២០២០",

    school_province: "សៀមរាប",

    bacll: "ជាប់",

    bac_year: "២០២០",

    room_no: "០៣",

    table_no: "១៥",

    exam_center: "សៀមរាប",

    grade: "A",

    father_name: "ឆាយ វិបុល",

    father_job: "មគ្គុទ្ទេសក៍ទេសចរណ៍",

    mother_name: "តាំង ម៉េងហួយ",

    mother_job: "អាជីវករ",

    guardian_name: "ឆាយ វិបុល",

    guardian_job: "មគ្គុទ្ទេសក៍ទេសចរណ៍",

    family_address: "សៀមរាប",

    phone: "010 99 graduation 011",

    email: "linda.chhay@email.com",

    batch: "០២",

    major: "បច្ចេកវិទ្យាព័ត៌មាន",

    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",

    year_study: "២០២៦-២០២៧"

  }

};

const HeaderDecorative = () => (
  <div className="header-decorative">
    <Image src={flourishSign} preview={false} alt="Decorative" width={60} className="decorative-image" />
  </div>
);

const Cover = () => {
  const { token } = theme.useToken();
  const [searchForm] = Form.useForm();

  // Changed: Set initial state to an array with one empty object for a blank default form
  const [studentList, setStudentList] = useState([{}]); 

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

    setStudentList(filteredResults.length > 0 ? filteredResults : [{}]);
  };

  return (
    <div className="scholarship-container">
      <div className="sticky-search no-print">
        <Form
          form={searchForm}
          onFinish={onSearchFinish}
          layout="vertical"
          className="search-form"
          style={{ background: token.colorFillAlter, padding: "24px", borderRadius: token.borderRadiusLG }}
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
                                              setStudentList([{}]);
                                            }}
                                          />
                                        </Space>
                                      </Form.Item>
                                    </Col>
          </Row>
        </Form>
      </div>

      {studentList.map((student, index) => (
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
              <Title level={3} className="form-main-title">ប្រវត្តិរូបសង្ខេប</Title>
            </div>

            <div className="responsive-lines">
              <div className="form-line">
                <span>ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ:</span>
                <Form.Item name="name_kh" noStyle><Input className="dotted-input input w-20" /></Form.Item>
                <span>ភេទ:</span>
                <Form.Item name="gender" noStyle><Input className="dotted-input input w-5" /></Form.Item>
                <span>ថ្ងៃខែឆ្នាំកំណើត:</span>
                <Form.Item name="dob" noStyle><Input className="dotted-input input w-15" /></Form.Item>
                <span>អត្តសញ្ញាណប័ណ្ណលេខ:</span>
                <Form.Item name="IDcard" noStyle><Input className="dotted-input input w-13" /></Form.Item>
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
                <span>កម្រិតវប្បធម៌ទូទៅ៖</span>
                <Form.Item name="highschool" noStyle><Input className="dotted-input input w-25" /></Form.Item>
                <span>នៅឆ្នាំ</span>
                <Form.Item name="start_year" noStyle><Input className="dotted-input input w-7" /></Form.Item>
                <span>ដល់ឆ្នាំ</span>
                <Form.Item name="end_year" noStyle><Input className="dotted-input input w-7" /></Form.Item>
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

              <div className="family-section">
                <div className="form-line">
                  <Text strong style={{ minWidth: '103px'}}>ព័ត៌មានគ្រួសារ៖</Text>
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
                  <span>ខ្ញុំបាទ/នាងខ្ញុំសូមអះអាងថា ព័ត៌មានក្នុងប្រវត្តិរូបខាងលើនេះពិតជាត្រឹមត្រូវឥតក្លែងបន្លំឡើយ។ ប្រសិនបើមានចំណុចណាមួយដែលប្រាសចាកពីការពិត ខ្ញុំបាទ/នាងខ្ញុំព្រមទទួល</span>
                </div>
                <div className="form-line">
                  <span>ខុសត្រូវចំពោះមុខច្បាប់ជាធរមាន។</span>
                </div>
              </div>

              <div className="signature-area sign-cover">
                <div className="lunar-date">ថ្ងៃ................ កើត ខែ............ ឆ្នាំ..................ស័ក ព.ស. ............</div>
                <div className="gregorian-date">រាជធានីភ្នំពេញ ថ្ងៃទី........ ខែ........ ឆ្នាំ២០២៥</div>
                <div className="sig-label khmer-moul">ហត្ថលេខា និងឈ្មោះ</div>
              </div>
            </div>

            <div className="form-footer footer-cover" style={{ marginTop: '360px' }}>
              <div className="footer-address">
                អាសយដ្ឋានៈ អគារលេខ១៤៧ក ផ្លូវឥដ្ឋច្រាស សង្កាត់ទូលសង្កែទី២ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ
              </div>
              <div className="footer-contact">
                Hot Line: 023 902 220 | FAX: 023 902 221 | E-mail: cumt.cambodia@gmail.com | Website: www.cumt.edu.kh
              </div>
            </div>
          </div>
        </Form>
      ))}
    </div>
  );
};

export default Cover;
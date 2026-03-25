import React,{useState} from "react";
import { Form, Input, Divider, Button, Row, Col, Select, Space, theme } from "antd";
import { SearchOutlined, PrinterOutlined, ClearOutlined } from "@ant-design/icons";

const MOCK_STUDENTS = {
  "Batch 1-រដ្ឋបាលសាធារណៈ-LIM FAHIMA": {
    name_kh: "លីម ហ្វាហ៊ីម៉ា",
    name_en: "LIM FAHIMA",
    gender: "ស្រី",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "០១-មករា-២០០២",
    house_no: "១២៣",
    street: "០៨",
    village: "ភូមិ១",
    commune: "វាលវង់",
    district: "៧មករា",
    city: "ភ្នំពេញ",
    major: "រដ្ឋបាលសាធារណៈ",
    faculty: "វិទ្យាសាស្ត្រសង្គម",
    batch: "០១",
    year_study: "២០២៥-២០២៦"
  },
  "Batch 2-វិទ្យាសាស្ត្រកុំព្យូទ័រ-CHAN THYDA": {
    name_kh: "ចាន់ ធីតា",
    name_en: "CHAN THYDA",
    gender: "ស្រី",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "១៥-ឧសភា-២០០៣",
    house_no: "៤៥",
    street: "២៧១",
    village: "បឹងទំពុន",
    commune: "បឹងទំពុន",
    district: "មានជ័យ",
    city: "ភ្នំពេញ",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    batch: "០២",
    year_study: "២០២៤-២០២៥"
  },
  "Batch 1-គ្រប់គ្រង-SENG SAMNANG": {
    name_kh: "សេង សំណាង",
    name_en: "SENG SAMNANG",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "១០-មិថុនា-២០០១",
    house_no: "១២A",
    street: "១៩៨៦",
    village: "ភ្នំពេញថ្មី",
    commune: "ភ្នំពេញថ្មី",
    district: "សែនសុខ",
    city: "ភ្នំពេញ",
    major: "គ្រប់គ្រង",
    faculty: "គ្រប់គ្រងពាណិជ្ជកម្ម",
    batch: "០១",
    year_study: "២០២៥-២០២៦"
  },
  "Batch 3-សេដ្ឋកិច្ចឌីជីថល-KEP MUNY": {
    name_kh: "កែប មុនី",
    name_en: "KEP MUNY",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "២០-ធ្នូ-២០០៤",
    house_no: "៨៨",
    street: "V12",
    village: "ទួលសង្កែ",
    commune: "ទួលសង្កែ២",
    district: "ឫស្សីកែវ",
    city: "ភ្នំពេញ",
    major: "សេដ្ឋកិច្ចឌីជីថល",
    faculty: "សេដ្ឋកិច្ច",
    batch: "០៣",
    year_study: "២០២៥-២០២៦"
  },
  "Batch 2-បច្ចេកវិទ្យាព័ត៌មាន-CHHAY LINDA": {
    name_kh: "ឆាយ លីនដា",
    name_en: "CHHAY LINDA",
    gender: "ស្រី",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "០៥-វិច្ឆិកា-២០០៣",
    house_no: "១០២",
    street: "០៣",
    village: "វត្តបូព៌",
    commune: "សាលាកំរើក",
    district: "សៀមរាប",
    city: "សៀមរាប",
    major: "បច្ចេកវិទ្យាព័ត៌មាន",
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    batch: "០២",
    year_study: "២០២៤-២០២៥"
  },
  "Batch 1-នីតិសាស្ត្រ-LONG RAKSMEY": {
    name_kh: "ឡុង រស្មី",
    name_en: "LONG RAKSMEY",
    gender: "ប្រុស",
    nationality: "ខ្មែរ",
    ethnicity: "ខ្មែរ",
    dob: "១២-មីនា-២០០២",
    house_no: "៥BT",
    street: "៣៧១",
    village: "ភូមិ៦",
    commune: "ទឹកថ្លា",
    district: "សែនសុខ",
    city: "ភ្នំពេញ",
    major: "នីតិសាស្ត្រ",
    faculty: "នីតិសាស្ត្រ និងវិទ្យាសាស្ត្រនយោបាយ",
    batch: "០១",
    year_study: "២០២៥-២០២៦"
  }
};

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

  const receiptTypes = [
    { },
    { }
  ];

  return (
    <div className="scholarship-container">
      {/* --- SEARCH BAR SECTION --- */}
      <div className="sticky-search">
        <Form
          form={searchForm}
          onFinish={onSearchFinish}
          layout="vertical"
          className="search-card"
          style={{
            background: token.colorFillAlter,
            padding: "24px",
            borderRadius: token.borderRadiusLG,
            marginBottom: "20px"
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

      {/* --- RECEIPT CONTENT LOOP --- */}
      {displayedStudents.map((student, index) => (
          <Form 
          key={student.name_en || index}
          initialValues={student}
          layout="vertical"
          className="scholarship-form"
          style={{ marginBottom: "50px", pageBreakAfter: "always" }}
        >
            <div className="print-page-container">
              {receiptTypes.map((type, typeIndex) => (
                <React.Fragment key={type.key}>
                  <div className="receipt-content">
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

                    <div className="receipt-title khmer-moul">
                      បង្កាន់ដៃទទួលពាក្យស្នើសុំអាហារូបករណ៍
                      <div className="receipt-subtitle">{type.label}</div>
                    </div>

                    <div className="receipt-body">
                      <div className="form-line">
                        <span>ខ្ញុំបាទ/នាងខ្ញុំឈ្មោះ:</span>
                        <Form.Item name="name_kh" noStyle><Input variant="borderless" className="dotted-input input w-30" /></Form.Item>
                        <span>អក្សរឡាតាំង:</span>
                        <Form.Item name="name_en" noStyle><Input variant="borderless" className="dotted-input input w-30" /></Form.Item>
                        <span>ភេទ:</span>
                        <Form.Item name="gender" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
                      </div>

                      <div className="form-line">
                        <span>សញ្ជាតិ:</span>
                        <Form.Item name="nationality" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
                        <span>ជនជាតិ:</span>
                        <Form.Item name="ethnicity" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
                        <span>ថ្ងៃខែឆ្នាំកំណើត:</span>
                        <Form.Item name="dob" noStyle><Input variant="borderless" className="dotted-input input w-17" /></Form.Item>
                        <span>អាសយដ្ឋានបច្ចុប្បន្នផ្ទះលេខ:</span>
                        <Form.Item name="house_no" noStyle><Input variant="borderless" className="dotted-input input w-10" /></Form.Item>
                        <span>ផ្លូវ:</span>
                        <Form.Item name="street" noStyle><Input variant="borderless" className="dotted-input input w-10" /></Form.Item>
                      </div>

                      <div className="form-line">
                        <span>ភូមិ/ក្រុម:</span>
                        <Form.Item name="village" noStyle><Input variant="borderless" className="dotted-input input w-12" /></Form.Item>
                        <span>ឃុំ/សង្កាត់:</span>
                        <Form.Item name="commune" noStyle><Input variant="borderless" className="dotted-input input w-17" /></Form.Item>
                        <span>ស្រុក/ខណ្ឌ:</span>
                        <Form.Item name="district" noStyle><Input variant="borderless" className="dotted-input input w-15" /></Form.Item>
                        <span>ខេត្ត/រាជធានី:</span>
                        <Form.Item name="city" noStyle><Input variant="borderless" className="dotted-input input w-14" /></Form.Item><span className="sign-end">។</span>
                      </div>

                      <div className="form-line">
                        <span>ជាបេក្ខជនចុះឈ្មោះស្នើសុំអាហារូបករណ៍ឆ្នាំទី</span>
                        <Form.Item name="study_year" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
                        <span>ជំនាញ:</span>
                        <Form.Item name="major" noStyle><Input variant="borderless" className="dotted-input input w-25" /></Form.Item>
                        <span>ជំនាន់ទី</span>
                        <Form.Item name="batch" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
                        <span>ឆ្នាំសិក្សា</span> 
                        <Form.Item name="year_study" noStyle><Input variant="borderless" className="dotted-input input w-12" /></Form.Item>
                        <span>នៅសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា ។</span>
                      </div>

                      <div className="signature-grid">
                        <div className="sig-block">
                          <div className="sig-date-info staff-date-offset">
                            <span>រាជធានីភ្នំពេញ ថ្ងៃទី.........ខែ.........ឆ្នាំ ២០២...</span>
                          </div>
                          <div className="khmer-moul sig-title">ហត្ថលេខា និងឈ្មោះអ្នកទទួលពាក្យ</div>
                          <div className="sig-space"></div>
                        </div>

                        <div className="sig-block">
                          <div className="sig-date-info">
                            <span>រាជធានីភ្នំពេញ ថ្ងៃទី.........ខែ.........ឆ្នាំ ២០២...</span>
                          </div>
                          <div className="khmer-moul sig-title">ហត្ថលេខា និងឈ្មោះសាមីខ្លួន</div>
                          <div className="sig-space"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {typeIndex === 0 && (
                    <div className="perforation">
                      <Divider dashed className="perforation-divider" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Form>
        
      ))}
    </div>
  );
};

export default ScholarshipForm;
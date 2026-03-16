import React from "react";
import { Form, Input, Divider, Button, Row, Col, Select, Space, theme } from "antd";
import { SearchOutlined,PrinterOutlined} from "@ant-design/icons";

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
    batch: "០១",
    study_year: "០១",
  },
};

const ScholarshipForm = () => {
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
    // The Select for Name is tied to the 'Name' field in the form
    const studentData = MOCK_STUDENTS[values.Name];
    if (studentData) {
      form.setFieldsValue(studentData);
    }
  };

  const receiptTypes = [
    { key: "uni"},
    { key: "student" }
  ];

  return (
    <div className="scholarship-container">
      
      {/* --- SEARCH BAR SECTION --- */}
      <div className="sticky-search no-print">
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
          {/* Top Row for Filters */}
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

      {/* --- RECEIPT CONTENT --- */}
      
      <Form className="scholarship-form" form={form} initialValues={{ study_year: "", batch: "" }}>
  <div className="print-page-container">
    {receiptTypes.map((type, index) => (
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
              <Form.Item name="city" noStyle><Input variant="borderless" className="dotted-input input w-14" /> <span className="sign-end">។</span></Form.Item>
            </div>

            <div className="form-line">
              <span>ជាបេក្ខជនចុះឈ្មោះស្នើសុំអាហារូបករណ៍ឆ្នាំទី</span>
              <Form.Item name="study_year" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
              <span>ជំនាញ:</span>
              <Form.Item name="major" noStyle><Input variant="borderless" className="dotted-input input w-25" /></Form.Item>
              <span>ជំនាន់ទី</span>
              <Form.Item name="batch" noStyle><Input variant="borderless" className="dotted-input input w-5" /></Form.Item>
              <span>ឆ្នាំសិក្សា</span> <Form.Item name="year" noStyle>
              <Input variant="borderless" className="dotted-input input w-12" /></Form.Item>
              <span>នៅសាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា ។</span>
            </div>

            <div className="signature-grid">
              <div className="sig-block">
                <div className="sig-date-info staff-date-offset">
                  <span>រាជធានីភ្នំពេញ ថ្ងៃទី</span>
                  <Form.Item name="stu_s_day" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                  <span>ខែ</span>
                  <Form.Item name="stu_s_month" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 80}}/></Form.Item>
                  <span>ឆ្នាំ ២០២</span>
                  <Form.Item name="stu_s_year" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                </div>
                <div className="khmer-moul sig-title">ហត្ថលេខា និងឈ្មោះអ្នកទទួលពាក្យ</div>
                <div className="sig-space"></div>
              </div>

              <div className="sig-block">
                <div className="sig-date-info student-date-offset">
                  <span>ថ្ងៃ</span>
                  <Form.Item name="rep_l_day" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                  <span>ខែ</span>
                  <Form.Item name="rep_l_month" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 80}}/></Form.Item>
                  <span>ឆ្នាំ</span>
                  <Form.Item name="rep_l_year" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 50}}/></Form.Item>
                  <span>ព.ស. ២៥៦</span>
                  <Form.Item name="rep_be" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                </div>
                <div className="sig-date-info">
                  <span>រាជធានីភ្នំពេញ ថ្ងៃទី</span>
                  <Form.Item name="rep_s_day" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                  <span>ខែ</span>
                  <Form.Item name="rep_s_month" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 80}}/></Form.Item>
                  <span>ឆ្នាំ ២០២</span>
                  <Form.Item name="rep_s_year" noStyle><Input variant="borderless" className="dotted-input input" style={{width: 30}}/></Form.Item>
                </div>
                <div className="khmer-moul sig-title">ហត្ថលេខា និងឈ្មោះសាមីខ្លួន</div>
                <div className="sig-space"></div>
              </div>
            </div>
          </div>
        </div>

        {index === 0 && (
          <div className="perforation">
            <Divider dashed className="perforation-divider" />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
</Form>
    </div>
  );
};

export default ScholarshipForm;
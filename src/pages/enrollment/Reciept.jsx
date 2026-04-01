import React, { useState } from "react";
import { Form, Input, Divider, Button, Row, Col, Select, Space, theme } from "antd";
import { SearchOutlined, PrinterOutlined, ClearOutlined } from "@ant-design/icons";
import SearchToolbar from "../../component/layouts/SearchForm";


// --- YOUR MAIN COMPONENT ---
const MOCK_STUDENTS = [
  { id: "B2307475", name_kh: "លីម ហ្វាហ៊ីម៉ា", name_en: "LIM FAHIMA", gender: "ស្រី", nationality: "ខ្មែរ", ethnicity: "ខ្មែរ", dob: "០១-មករា-២០០២", house_no: "១២៣", street: "០៨", village: "វាលវង់", commune: "វាលវង់", district: "៧មករា", city: "ភ្នំពេញ", major: "រដ្ឋបាលសាធារណៈ", faculty: "នីតិសាស្ត្រ និងវិទ្យាសាស្ត្រនយោបាយ", batch: "០១", study_year: "២០២៣-២០២៤" },
  { id: "B2307476", name_kh: "ចន សុខា", name_en: "CHORN SOKHA", gender: "ប្រុស", nationality: "ខ្មែរ", ethnicity: "ខ្មែរ", dob: "១២-ឧសភា-២០០០", house_no: "៤៥", street: "២៧១", village: "ភូមិ២", commune: "ស្ទឹងមានជ័យ", district: "មានជ័យ", city: "ភ្នំពេញ", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", batch: "០១", study_year: "២០២៣-២០២៤" },
  { id: "B2307477", name_kh: "មាស ស្រីនាថ", name_en: "MEAS SREYNEATH", gender: "ស្រី", nationality: "ខ្មែរ", ethnicity: "ខ្មែរ", dob: "០៥-កញ្ញា-២០០១", house_no: "១២", street: "១៩", village: "ព្រែកលៀប", commune: "ជ្រោយចង្វារ", district: "ជ្រោយចង្វារ", city: "ភ្នំពេញ", major: "រដ្ឋបាលសាធារណៈ", faculty: "នីតិសាស្ត្រ និងវិទ្យាសាស្ត្រនយោបាយ", batch: "០១", study_year: "២០២៣-២០២៤" },
  { id: "B2307478", name_kh: "សៅ ភារម្យ", name_en: "SAO PHEAROM", gender: "ប្រុស", nationality: "ខ្មែរ", ethnicity: "ខ្មែរ", dob: "២០-វិច្ឆិកា-១៩៩៩", house_no: "៩៩", street: "០៣", village: "ត្រពាំងថ្លឹង", commune: "ចោមចៅ", district: "ពោធិ៍សែនជ័យ", city: "ភ្នំពេញ", major: "គ្រប់គ្រង", faculty: "គ្រប់គ្រងពាណិជ្ជកម្ម", batch: "០២", study_year: "២០២៤-២០២៥" },
  { id: "B2307479", name_kh: "ហេង ម៉ានិត", name_en: "HENG MANIT", gender: "ប្រុស", nationality: "ខ្មែរ", ethnicity: "ខ្មែរ", dob: "១៥-កុម្ភៈ-២០០២", house_no: "២០", street: "៦០M", village: "ព្រែកតានូ", commune: "ចាក់អង្រែលើ", district: "មានជ័យ", city: "ភ្នំពេញ", major: "រដ្ឋបាលសាធារណៈ", faculty: "នីតិសាស្ត្រ និងវិទ្យាសាស្ត្រនយោបាយ", batch: "០១", study_year: "២០២៣-២០២៤" }
];

const Reciept = () => {
  const { token } = theme.useToken();
  const [searchForm] = Form.useForm();
  const [studentList, setStudentList] = useState([{}]);

  const searchFields = [
    { name: "batch", label: "Batch", placeholder: "Select Batch", width: "190px" },
    { name: "study_year", label: "Study Year", placeholder: "Select Study Year" },
    { name: "major", label: "Major", placeholder: "Select Major" },
    { name: "faculty", label: "Faculty", placeholder: "Select Faculty" },
    { name: "name_en", label: "Name", placeholder: "Select Name" },
  ];

  const onSearchFinish = (values) => {
    const filtered = MOCK_STUDENTS.filter(s => {
      return (
        (!values.batch || s.batch === values.batch) &&
        (!values.study_year || s.study_year === values.study_year) &&
        (!values.major || s.major === values.major) &&
        (!values.faculty || s.faculty === values.faculty) &&
        (!values.name_en || s.name_en === values.name_en)
      );
    });
    setStudentList(filtered.length > 0 ? filtered : [{}]);
  };

  const receiptTypes = [{ key: "uni" }, { key: "student" }];

  return (
    <div>
      {/* USE THE REUSABLE SEARCH HERE */}
      <SearchToolbar 
        form={searchForm}
        onSearch={onSearchFinish}
        fields={searchFields}
        data={MOCK_STUDENTS}
        onClear={() => setStudentList([{}])}
        token={token}
      />

      <div className="scholarship-container">
        {studentList.map((student, sIdx) => (
          <Form 
            key={student.id || sIdx} 
            className="scholarship-form" 
            initialValues={student}
            style={{ marginBottom: "50px", pageBreakAfter: "always" }}
          >
            <div className="print-page-container" style={{ pageBreakAfter: 'always' }}>
              {receiptTypes.map((type, index) => (
                <React.Fragment key={`${sIdx}-${type.key}`}>
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
                      <Space direction="vertical" style={{ width: 'fit-content' }}>
                        <div className="photo-box"><div>4x6</div></div>
                        <div className="student-id">
                          <div>អត្តលេខ/ Student ID: {student.id || "................"}</div>
                        </div>
                      </Space>
                    </div>

                    <div className="receipt-title khmer-moul">
                      សាលាកបត្រឯកត្តជន
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
                        <Form.Item name="study_year" noStyle><Input variant="borderless" className="dotted-input input w-12" /></Form.Item>
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
                    <div className="perforation"><Divider dashed className="perforation-divider" /></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Form>
        ))}
      </div>
    </div>
  );
};

export default Reciept;
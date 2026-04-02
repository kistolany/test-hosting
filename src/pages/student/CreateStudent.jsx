import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Row,
  Col,
  Select,
  TreeSelect,
  Divider,
  message,
} from "antd";
import {
  SwapLeftOutlined
} from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";
import { pushNotification } from "../../utils/notifications";
import { pushAuditLog } from "../../utils/auditLogs";

const { RangePicker } = DatePicker;

const CreateStudent = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const tr = (en, km) => (lang === "km" ? km : en);
  const location = useLocation();
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);
  const isEdit = location.state?.mode === "edit";
  const student = location.state?.student;

  useEffect(() => {
    if (!isEdit || !student) return;

    const parsedDob = dayjs(student.dob);
    const parsedRegisterDate = dayjs(
      student.registerDate || student.registrationDate || student.RegDate || student.regDate
    );
    const yearStudyMap = {
      "2026-2027": 1,
      "2027-2028": 2,
      "2028-2029": 3,
      "2030-2031": 4,
      "២០២៦-២០២៧": 1,
      "២០២៧-២០២៨": 2,
      "២០២៨-២០២៩": 3,
      "២០៣០-២០៣១": 4,
    };

    form.setFieldsValue({
      Input: student.ID || "",
      NameKhmer: student.nameKhmer || "",
      NameEnglish: student.name || "",
      Gender: student.gender || undefined,
      DOB: parsedDob.isValid() ? parsedDob : undefined,
      RegisterDate: parsedRegisterDate.isValid() ? parsedRegisterDate : undefined,
      StudyShift: student.shift || undefined,
      Batch: student.batch || undefined,
      YearLevel: student.yearLevel || undefined,
      major: student.major || undefined,
      YearStudy: yearStudyMap[student.studyYear] || undefined,
      StudentType: student.studentType || student.StudentType || undefined,
      Others: student.Note || "",
    });
  }, [isEdit, student, form]);

  const handleSubmit = (values) => {
    const type = String(values.StudentType || "").trim().toLowerCase();
    const studentName = values.NameEnglish || values.NameKhmer || values.Input || "Student";

    const shouldNotifyCreate = !isEdit && type === "pay";
    const shouldNotifyUpdate = isEdit && (type === "pass" || type === "pay");

    if (shouldNotifyCreate || shouldNotifyUpdate) {
      pushNotification({
        title: isEdit ? "Student Type Updated" : "New PAY Student",
        message: `${studentName} requires enrollment processing.`,
      });
    }

    if (isEdit) {
      pushAuditLog({
        action: "Update",
        module: "Students",
        description: `Updated student ${studentName}.`,
        before: student ? JSON.stringify({
          id: student.ID,
          nameKhmer: student.nameKhmer,
          name: student.name,
          studentType: student.studentType || student.StudentType,
        }) : null,
        after: JSON.stringify({
          id: values.Input,
          nameKhmer: values.NameKhmer,
          name: values.NameEnglish,
          studentType: values.StudentType,
        }),
      });
    }

    message.success(isEdit ? tr("Student updated successfully", "កែប្រែនិស្សិតបានជោគជ័យ") : tr("Student created successfully", "បង្កើតនិស្សិតបានជោគជ័យ"));
    navigate("/student");
  };

  return (
    <Form
      className="register-student-form"
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      variant={variant || "outlined"}
      initialValues={{ variant: "outlined" }}
      style={{ width: "100%", padding: "20px" }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24}>
          <div className="create-student-topbar">
            <Button onClick={() => navigate("/student")} htmlType="button">
              <SwapLeftOutlined />
              {tr("Back", "ត្រឡប់")}
            </Button>
            <div className="headerText" style={{ color: "#070f7a" }}>
              {isEdit ? tr("Update Student Information", "កែប្រែព័ត៌មាននិស្សិត") : tr("Register Student", "ចុះឈ្មោះនិស្សិត")}
            </div>
            <div className="create-student-topbar-spacer" aria-hidden="true" />
          </div>
        </Col>

        {/* --- Added Student Type Option Here --- */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            label={tr("Student Type", "ប្រភេទនិស្សិត")} 
            name="StudentType" 
            rules={[{ required: true, message: tr("Please select student type!", "សូមជ្រើសរើសប្រភេទនិស្សិត!") }]}
          >
            <Select 
              placeholder={tr("Select type", "ជ្រើសរើសប្រភេទ")}
              options={[
                { label: tr('Pay', 'បង់ថ្លៃ (Pay)'), value: 'pay' },
                { label: tr('Scholarship', 'អាហាររូបករណ៍ (Scholarship)'), value: 'scholarship' },
                { label: tr('Pass', 'ជាប់ (Pass)'), value: 'pass' }
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24}></Col> {/* Spacer */}

        <Divider orientation="left">{tr("Personal Information", "ព័ត៍មានផ្ទាល់ខ្លួន")}</Divider>
        <Col xs={20} sm={10} md={6} lg={4}>
          <Form.Item
            label={tr("Student ID", "អត្តលេខ")}
            name="Input"
            rules={[{ required: true, message: tr("Please enter student ID!", "សូមបញ្ជាក់អត្តលេខ!") }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label={tr("Khmer Name", "គោត្តនាម និងនាម")}
            name="NameKhmer"
            rules={[{ required: true, message: tr("Please enter Khmer name!", "សូមបញ្ជាក់ឈ្មោះភាសាខ្មែរ!") }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label={tr("English Name", "អក្សរឡាតាំង")}
            name="NameEnglish"
            rules={[{ required: true, message: tr("Please enter English name!", "សូមបញ្ជាក់ឈ្មោះឡាតាំង!") }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={12} sm={6} md={4} lg={2}>
          <Form.Item 
            label={tr("Gender", "ភេទ")} 
            name="Gender" 
            rules={[{ required: true, message: tr("Please select gender!", "សូមជ្រើសរើសភេទ!") }]}
          >
            <Select 
               options={[
                { label: tr('Male', 'ប្រុស'), value: 'M' },
                { label: tr('Female', 'ស្រី'), value: 'F' }
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label={tr("Date of Birth", "ថ្ងៃខែឆ្នាំកំណើត")}
            name="DOB"
            rules={[{ required: true, message: tr("Please select date of birth!", "សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត!") }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label={tr("Registration Date", "ចុះឈ្មោះថ្ងៃ")}
            name="RegisterDate"
            rules={[{ required: true, message: tr("Please select registration date!", "សូមជ្រើសរើសថ្ងៃចុះឈ្មោះ!") }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            label="Email" 
            name="Email" 
            rules={[{ type: 'email', message: tr('Invalid email!', 'Email មិនត្រឹមត្រូវ!') }]}
          >
            <Input />
          </Form.Item>
        </Col>
        
        <Col xs={18} sm={8} md={6} lg={4}>
          <Form.Item
            label={tr("ID Card", "អត្តសញ្ញាណបណ្ណ")}
            name="IdCard"
            rules={[{ required: true, message: tr("Please enter ID card number!", "សូមបញ្ជាក់លេខអត្តសញ្ញាណបណ្ណ!") }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Col xs={18} sm={8} md={6} lg={4}>
          <Form.Item
            label={tr("Phone Number", "លេខទូរស័ព្ទ")}
            name="Phone"
            rules={[{ required: true, message: tr("Please enter phone number!", "សូមបញ្ជាក់លេខទូរស័ព្ទ!") }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Divider orientation="left">{tr("Address", "អាសយដ្ឋាន")}</Divider>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Item label={tr("Street No.", "ផ្លូវលេខ")} name="StreetNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Item label={tr("House No.", "ផ្ទះលេខ")} name="HouseNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Village", "ភូមិ")} name="Village" rules={[{ required: true, message: tr("Please enter village!", "បញ្ជាក់ភូមិ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Commune", "ឃុំ")} name="Commune" rules={[{ required: true, message: tr("Please enter commune!", "បញ្ជាក់ឃុំ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Form.Item label={tr("District", "ស្រុក")} name="District" rules={[{ required: true, message: tr("Please enter district!", "បញ្ជាក់ស្រុក!") }]}>
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Form.Item label={tr("Province/City", "ខេត្ត/រាជធានី")} name="Province" rules={[{ required: true, message: tr("Please enter province!", "បញ្ជាក់ខេត្ត!") }]}>
            <Select />
          </Form.Item>
        </Col>

        <Divider orientation="left">{tr("Current Address", "អាសយដ្ឋានបច្ចុប្បន្ន")}</Divider>

        <Col xs={12} sm={6} md={4} lg={4}>
          <Form.Item label={tr("Current Street No.", "ផ្លូវលេខបច្ចុប្បន្ន")} name="CurrStreetNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={4}>
          <Form.Item label={tr("Current House No.", "ផ្ទះលេខបច្ចុប្បន្ន")} name="CurrHouseNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Current Village", "ភូមិបច្ចុប្បន្ន")} name="CurrVillage" rules={[{ required: true, message: tr("Please enter current village!", "ស្ទួន!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Current Commune", "ឃុំបច្ចុប្បន្ន")} name="CurrCommune" rules={[{ required: true, message: tr("Please enter current commune!", "ស្ទួន!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Current District", "ស្រុកបច្ចុប្បន្ន")} name="CurrDistrict" rules={[{ required: true, message: tr("Please enter current district!", "ស្ទួន!") }]}>
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label={tr("Current Province", "ខេត្តបច្ចុប្បន្ន")} name="CurrProvince" rules={[{ required: true, message: tr("Please enter current province!", "ស្ទួន!") }]}>
            <Select />
          </Form.Item>
        </Col>

        <Divider orientation="left">{tr("Family Information", "ព័ត៌មានគ្រួសារ")}</Divider>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label={tr("Father Name", "ឈ្មោះឪពុក")} name="FatherName" rules={[{ required: true, message: tr("Please enter father name!", "បញ្ជាក់ឈ្មោះឪពុក!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label={tr("Father Occupation", "មុខរបរឪពុក")} name="FatherJob" rules={[{ required: true, message: tr("Please enter occupation!", "បញ្ជាក់មុខរបរ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label={tr("Mother Name", "ឈ្មោះម្តាយ")} name="MotherName" rules={[{ required: true, message: tr("Please enter mother name!", "បញ្ជាក់ឈ្មោះម្តាយ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label={tr("Mother Occupation", "មុខរបរម្តាយ")} name="MotherJob" rules={[{ required: true, message: tr("Please enter occupation!", "បញ្ជាក់មុខរបរ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label={tr("Guardian Name", "ឈ្មោះអាណាព្យាបាល")} name="GuardianName" rules={[{ required: true, message: tr("Please enter guardian name!", "បញ្ជាក់ឈ្មោះ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label={tr("Guardian Occupation", "មុខរបរអាណាព្យាបាល")} name="GuardianJob" rules={[{ required: true, message: tr("Please enter occupation!", "បញ្ជាក់មុខរបរ!") }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label={tr("Guardian Phone", "លេខអាណាព្យាបាល")} name="GuardianPhone" rules={[{ required: true, message: tr("Please enter phone number!", "បញ្ជាក់លេខទូរស័ព្ទ!") }]}>
            <Input />
          </Form.Item>
        </Col>

        <Divider orientation="left">{tr("Baccalaureate", "បាក់ឌុប")}</Divider>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label={tr("Exam Year", "ឆ្នាំប្រឡង")}
            name="ExamYear"
            rules={[{ required: true, message: tr("Please select exam year!", "ជ្រើសរើសឆ្នាំ!") }]}
          >
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label={tr("Exam Center", "បណ្ឌលប្រឡង")}
            name="ExamPlace"
            rules={[{ required: true, message: tr("Please enter exam center!", "បញ្ជាក់មណ្ឌល!") }]}
          >
            <Mentions />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label={tr("Baccalaureate Code", "លេខកូដបាក់ឌុប")}
            name="BacllCode"
            rules={[{ required: true, message: tr("Please enter baccalaureate code!", "បញ្ជាក់លេខកូដ!") }]}
          >
            <Mentions />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label={tr("Grade", "និន្ទេស")}
            name="Grade"
            rules={[{ required: true, message: tr("Please enter grade!", "បញ្ជាក់និន្ទេស!") }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Divider orientation="left">{tr("Education Enrollment", "ចុះឈ្មោះសិក្សា")}</Divider>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label={tr("Study Day", "ថ្ងៃសិក្សា")} name="StudyDays" rules={[{ required: true, message: tr("Please select study day!", "បញ្ជាក់ថ្ងៃសិក្សា!") }]}>
            <Select 
            placeholder={tr("Select study day", "ថ្ងៃសិក្សា")}
                        options={[
                          { label: tr('Mon-Fri', 'ច័ន្ទ-សុក្រ'), value: 1 },
                          { label: tr('Sat-Sun', 'សៅរ៍-អាទិត្យ'), value: 2 }
                        ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label={tr("Study Shift", "វេនសិក្សា")} name="StudyShift" rules={[{ required: true, message: tr("Please select shift!", "ជ្រើសរើសវេន!") }]}>
            <Select />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label={tr("Others", "ផ្សេងៗ")} name="Others">
            <Input />
          </Form.Item>
        </Col>

        <Col xs={20} sm={10} md={6} lg={4}>
          <Form.Item label={tr("Missing Documents", "ឯកសារខ្វះ")} name="doc">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item label={tr("Major", "ជំនាញ")} name="major" rules={[{ required: true, message: tr("Please select major!", "ជ្រើសរើសជំនាញ!") }]}>
            <Select />
          </Form.Item>
        </Col>

        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item
            label={tr("Batch", "ជំនាន់")}
            name="Batch"
            rules={[{ required: true, message: tr("Please select batch!", "ជ្រើសរើសជំនាន់!") }]}
          >
            <Select
              placeholder={tr("Select Batch", "ជ្រើសរើសជំនាន់")}
              options={[
                { label: "Batch 1", value: "1" },
                { label: "Batch 2", value: "2" },
                { label: "Batch 3", value: "3" },
                { label: "Batch 4", value: "4" },
                { label: "Batch 5", value: "5" },
                { label: "Batch 6", value: "6" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item
            label={tr("Year", "ឆ្នាំ")}
            name="YearLevel"
            rules={[{ required: true, message: tr("Please select year!", "ជ្រើសរើសឆ្នាំ!") }]}
          >
            <Select
              placeholder={tr("Select Year", "ជ្រើសរើសឆ្នាំ")}
              options={[
                { label: tr("Year 1", "ឆ្នាំទី១"), value: "១" },
                { label: tr("Year 2", "ឆ្នាំទី២"), value: "២" },
                { label: tr("Year 3", "ឆ្នាំទី៣"), value: "៣" },
                { label: tr("Year 4", "ឆ្នាំទី៤"), value: "៤" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* --- Added Year Study Here --- */}
        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item 
            label={tr("Study Year", "ឆ្នាំសិក្សា")} 
            name="YearStudy" 
            rules={[{ required: true, message: tr("Please select study year!", "ជ្រើសរើសឆ្នាំសិក្សា!") }]}
          >
            <Select 
              placeholder={tr("Select Study Year", "ជ្រើសរើសឆ្នាំ")}
              options={[
                { label: '2026-2027', value: 1 },
                { label: '2027-2028', value: 2 },
                { label: '2028-2029', value: 3 },
                { label: '2030-2031', value: 4 },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button type="primary" style={{ background:'#160579' }} htmlType="submit">
                {isEdit ? t("actions.updateStudent") : t("actions.submit")}
              </Button>
              <Button onClick={() => form.resetFields()}>
                {t("actions.clear")}
              </Button>
              <Button onClick={() => navigate("/student")}>
                {t("actions.cancel")}
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateStudent;
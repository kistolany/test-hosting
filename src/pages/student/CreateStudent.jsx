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
} from "antd";
import {
  SwapLeftOutlined
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const CreateStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);
  const isEdit = location.state?.mode === "edit";
  const student = location.state?.student;

  useEffect(() => {
    if (!isEdit || !student) return;

    const parsedDob = dayjs(student.dob);
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
      StudyShift: student.shift || undefined,
      major: student.major || undefined,
      YearStudy: yearStudyMap[student.studyYear] || undefined,
      Others: student.Note || "",
    });
  }, [isEdit, student, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      variant={variant || "outlined"}
      initialValues={{ variant: "outlined" }}
      style={{ width: "100%", padding: "20px" }}
    >
      <Row gutter={[16, 0]}>
      <Col xs={24}>
          <Form.Item>
            <Button onClick={() => navigate("/student")} htmlType="button">
              <SwapLeftOutlined />
              Back
            </Button>
          </Form.Item>
        </Col>
       <Col xs={24} sm={24} md={24} lg={24}>
          <div className="headerText" style={{ color:'#070f7a ' }}>
            {isEdit ? "កែប្រែព័ត៌មាននិស្សិត" : "ចុះឈ្មោះនិស្សិត"}
          </div>
        </Col>

        {/* --- Added Student Type Option Here --- */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            label="ប្រភេទនិស្សិត" 
            name="StudentType" 
            rules={[{ required: true, message: "សូមជ្រើសរើសប្រភេទនិស្សិត!" }]}
          >
            <Select 
              placeholder="ជ្រើសរើសប្រភេទ"
              options={[
                { label: 'បង់ថ្លៃ (Pay)', value: 'pay' },
                { label: 'អាហាររូបករណ៍ (Scholarship)', value: 'scholarship' }
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24}></Col> {/* Spacer */}

        <Divider orientation="left">ព័ត៍មានផ្ទាល់ខ្លួន (yourself)</Divider>
        <Col xs={20} sm={10} md={6} lg={4}>
          <Form.Item
            label="អត្តលេខ"
            name="Input"
            rules={[{ required: true, message: "សូមបញ្ជាក់អត្តលេខ!" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label="គោត្តនាម និងនាម"
            name="NameKhmer"
            rules={[{ required: true, message: "សូមបញ្ជាក់ឈ្មោះភាសាខ្មែរ!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label="អក្សរឡាតាំង"
            name="NameEnglish"
            rules={[{ required: true, message: "សូមបញ្ជាក់ឈ្មោះឡាតាំង!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={12} sm={6} md={4} lg={2}>
          <Form.Item 
            label="ភេទ" 
            name="Gender" 
            rules={[{ required: true, message: "សូមជ្រើសរើសភេទ!" }]}
          >
            <Select 
               options={[
                { label: 'ប្រុស', value: 'M' },
                { label: 'ស្រី', value: 'F' }
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item
            label="ថ្ងៃខែឆ្នាំកំណើត"
            name="DOB"
            rules={[{ required: true, message: "សូមជ្រើសរើសថ្ងៃខែឆ្នាំកំណើត!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item 
            label="Email" 
            name="Email" 
            rules={[{ type: 'email', message: 'Email មិនត្រឹមត្រូវ!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        
        <Col xs={18} sm={8} md={6} lg={4}>
          <Form.Item
            label="អត្តសញ្ញាណបណ្ណ"
            name="IdCard"
            rules={[{ required: true, message: "សូមបញ្ជាក់លេខអត្តសញ្ញាណបណ្ណ!" }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Col xs={18} sm={8} md={6} lg={4}>
          <Form.Item
            label="លេខទូរស័ព្ទ"
            name="Phone"
            rules={[{ required: true, message: "សូមបញ្ជាក់លេខទូរស័ព្ទ!" }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Divider orientation="left">អាសយដ្ឋាន (Address)</Divider>

        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Item label="ផ្លូវលេខ" name="StreetNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Item label="ផ្ទះលេខ" name="HouseNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ភូមិ" name="Village" rules={[{ required: true, message: "បញ្ជាក់ភូមិ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ឃុំ" name="Commune" rules={[{ required: true, message: "បញ្ជាក់ឃុំ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Form.Item label="ស្រុក" name="District" rules={[{ required: true, message: "បញ្ជាក់ស្រុក!" }]}>
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Form.Item label="ខេត្ត/រាជធានី" name="Province" rules={[{ required: true, message: "បញ្ជាក់ខេត្ត!" }]}>
            <Select />
          </Form.Item>
        </Col>

        <Divider orientation="left">អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)</Divider>

        <Col xs={12} sm={6} md={4} lg={4}>
          <Form.Item label="ផ្លូវលេខបច្ចុប្បន្ន" name="CurrStreetNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={4} lg={4}>
          <Form.Item label="ផ្ទះលេខបច្ចុប្បន្ន" name="CurrHouseNo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ភូមិបច្ចុប្បន្ន" name="CurrVillage" rules={[{ required: true, message: "ស្ទួន!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ឃុំបច្ចុប្បន្ន" name="CurrCommune" rules={[{ required: true, message: "ស្ទួន!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ស្រុកបច្ចុប្បន្ន" name="CurrDistrict" rules={[{ required: true, message: "ស្ទួន!" }]}>
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Form.Item label="ខេត្តបច្ចុប្បន្ន" name="CurrProvince" rules={[{ required: true, message: "ស្ទួន!" }]}>
            <Select />
          </Form.Item>
        </Col>

        <Divider orientation="left">ព័ត៌មានគ្រួសារ (Family)</Divider>

        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label="ឈ្មោះឪពុក" name="FatherName" rules={[{ required: true, message: "បញ្ជាក់ឈ្មោះឪពុក!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label="មុខរបរឪពុក" name="FatherJob" rules={[{ required: true, message: "បញ្ជាក់មុខរបរ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label="ឈ្មោះម្តាយ" name="MotherName" rules={[{ required: true, message: "បញ្ជាក់ឈ្មោះម្តាយ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item label="មុខរបរម្តាយ" name="MotherJob" rules={[{ required: true, message: "បញ្ជាក់មុខរបរ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label="ឈ្មោះអាណាព្យាបាល" name="GuardianName" rules={[{ required: true, message: "បញ្ជាក់ឈ្មោះ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label="មុខរបរអាណាព្យាបាល" name="GuardianJob" rules={[{ required: true, message: "បញ្ជាក់មុខរបរ!" }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Form.Item label="លេខអាណាព្យាបាល" name="GuardianPhone" rules={[{ required: true, message: "បញ្ជាក់លេខទូរស័ព្ទ!" }]}>
            <Input />
          </Form.Item>
        </Col>

        <Divider orientation="left">បាក់ឌុប (Bacll)</Divider>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label="ឆ្នាំប្រឡង"
            name="ExamYear"
            rules={[{ required: true, message: "ជ្រើសរើសឆ្នាំ!" }]}
          >
            <Select />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label="បណ្ឌលប្រឡង"
            name="ExamPlace"
            rules={[{ required: true, message: "បញ្ជាក់មណ្ឌល!" }]}
          >
            <Mentions />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label="លេខកូដបាក់ឌុប"
            name="BacllCode"
            rules={[{ required: true, message: "បញ្ជាក់លេខកូដ!" }]}
          >
            <Mentions />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Form.Item
            label="និន្ទេស"
            name="Grade"
            rules={[{ required: true, message: "បញ្ជាក់និន្ទេស!" }]}
          >
            <Mentions />
          </Form.Item>
        </Col>

        <Divider orientation="left">ចុះឈ្មោះសិក្សា (Education)</Divider>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="ថ្ងៃសិក្សា" name="StudyDays" rules={[{ required: true, message: "បញ្ជាក់ថ្ងៃសិក្សា!" }]}>
            <Select 
            placeholder="ថ្ងៃសិក្សា"
                        options={[
                          { label: 'ច័ន្ទ-សុក្រ', value: 1 },
                          { label: 'សៅរ៍-អាទិត្យ', value: 2 }
                        ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="វេនសិក្សា" name="StudyShift" rules={[{ required: true, message: "ជ្រើសរើសវេន!" }]}>
            <Select />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="ផ្សេងៗ" name="Others">
            <Input />
          </Form.Item>
        </Col>

        <Col xs={20} sm={10} md={6} lg={4}>
          <Form.Item label="ឯកសារខ្វះ" name="doc">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item label="ជំនាញ" name="major" rules={[{ required: true, message: "ជ្រើសរើសជំនាញ!" }]}>
            <Select />
          </Form.Item>
        </Col>

        {/* --- Added Year Study Here --- */}
        <Col xs={16} sm={8} md={6} lg={4}>
          <Form.Item 
            label="ឆ្នាំសិក្សា" 
            name="YearStudy" 
            rules={[{ required: true, message: "ជ្រើសរើសឆ្នាំសិក្សា!" }]}
          >
            <Select 
              placeholder="ជ្រើសរើសឆ្នាំ"
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
            <Button type="primary" style={{ background:'#160579' }} htmlType="submit">
              {isEdit ? "Update Student" : "Submit"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateStudent;
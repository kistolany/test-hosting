import React, { useState } from "react";
import { 
  SearchOutlined, 
  EditFilled, 
  DeleteFilled, 
  PrinterOutlined, 
  ClearOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Space, ConfigProvider, Form, Row, Col, Select, Popconfirm, DatePicker, TimePicker, Flex, Card
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { RangePicker } = DatePicker;

const AdvancedSearchForm = ({ onSearch, onClear, fullData, onPrint }) => {
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const getOptions = (key) => {
    const uniqueValues = [...new Set(fullData.map(item => item[key]).filter(Boolean))];
    return uniqueValues.map(val => ({ value: val, label: val }));
  };

  return (
    <div className="att-search-inner-container no-print" style={{ marginBottom: 20 }}>
      <Form form={form} layout="vertical" onFinish={onSearch}>
        <Row gutter={[16, 0]} align="bottom">
          <Col lg={5} xs={12} md={8}>
            <Form.Item name="major" label={t("filters.major")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectMajor")} options={getOptions('major')} />
            </Form.Item>
          </Col>
          <Col lg={5} xs={12} md={8} >
            <Form.Item name="subject" label={t("filters.subject")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectSubject")} options={getOptions('subject')} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={12} md={5}>
            <Form.Item name="batch" label={t("filters.batch")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectBatch")} options={getOptions('batch')} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={12} md={4}>
            <Form.Item name="year" label={t("filters.year")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectYear")} options={getOptions('year')} />
            </Form.Item>
          </Col>
          <Col lg={2} xs={12} md={4}>
            <Form.Item name="semester" label={t("filters.semester")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectSemester")} options={getOptions('semester')} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={12} md={4}>
            <Form.Item name="study-day" label={t("filters.studyDay")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectStudyDay")} options={getOptions('study-day')} />
            </Form.Item>
          </Col>
          <Col lg={3} xs={12} md={4}>
            <Form.Item name="shift" label={t("filters.shift")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectShift")} options={getOptions('shift')} />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={[16, 0]} align="bottom">
          <Col xs={24} md={14} lg={16}>
            <Form.Item label=" " style={{ marginBottom: 5 }}>
              <Flex gap="small" wrap="wrap">
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ backgroundColor: '#070f7a', minWidth: 100 }}>
                  {t("actions.search")}
                </Button>
                <Button icon={<ClearOutlined/>} onClick={() => { form.resetFields(); onClear(); }} style={{ width: 40 }} />
                <Button icon={<PrinterOutlined />} onClick={onPrint} style={{ backgroundColor: '#070f7a', color: "white", minWidth: 100 }}>
                  {t("actions.print")}
                </Button>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const FinalExam = () => {
  const navigate = useNavigate();

  const toKhmerNum = (num) => {
    if (num === null || num === undefined) return "";
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  const formatKhmerDate = (date) => {
    if (!date) return null;
    const khmerMonths = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
    return `${toKhmerNum(date.date())} ${khmerMonths[date.month()]} ${toKhmerNum(date.year())}`;
  };

  const [headerData, setHeaderData] = useState({
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ",
    year: "៤",
    semester: "១",
    generation: "៤",
    shift: "ព្រឹក",
    examDate: "ថ្ងៃទី..... ខែ..... ឆ្នាំ.....",
    examTime: "..... ដល់ម៉ោង ....."
  });

const [masterData, setMasterData] = useState([
  { 
    key: "1", 
    ID: "B240017", 
    nameKhmer: "ញ៉ សុខញ៉ែន", 
    name: "Nhor Soknhen", 
    gender: "ប", 
    dob: "1 មេសា 2002", 
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", 
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", 
    subject: "Web Development",
    year: "4", 
    semester: "1", 
    batch: "4", 
    shift: "ព្រឹក", 
    studyDay: "ច័ន្ទ - សុក្រ",
    Note: "" 
  },
  { 
    key: "2", 
    ID: "B240028", 
    nameKhmer: "ប៉េង សំណាង", 
    name: "Peng Samnang", 
    gender: "ប", 
    dob: "9 មករា 2003", 
    faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", 
    major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", 
    subject: "Cyber Security",
    year: "4", 
    semester: "1", 
    batch: "4", 
    shift: "ព្រឹក", 
    studyDay: "ច័ន្ទ - សុក្រ",
    Note: "ដកសិទ្ធិ" 
  },
  { 
    key: "3", 
    ID: "B260013", 
    nameKhmer: "អាត ភីយ៉ា", 
    name: "ART PHIYA", 
    gender: "ស", 
    dob: "11 មករា 2006", 
    faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", 
    major: "បង្រៀនភាសាអង់គ្លេស", 
    subject: "Academic Writing",
    year: "1", 
    semester: "1", 
    batch: "6", 
    shift: "រសៀល", 
    studyDay: "សៅរ៍ - អាទិត្យ",
    Note: "" 
  },
  { 
    key: "4", 
    ID: "B250102", 
    nameKhmer: "ចាន់ ម៉ានិត", 
    name: "Chan Manit", 
    gender: "ស", 
    dob: "20 កញ្ញា 2004", 
    faculty: "គ្រប់គ្រងពាណិជ្ជកម្ម និងសេដ្ឋកិច្ច", 
    major: "គណនេយ្យ", 
    subject: "Financial Accounting",
    year: "2", 
    semester: "2", 
    batch: "5", 
    shift: "យប់", 
    studyDay: "ច័ន្ទ - សុក្រ",
    Note: "ផ្អាកការសិក្សា" 
  },
  { 
    key: "5", 
    ID: "B250215", 
    nameKhmer: "ស៊ឹម វីរៈ", 
    name: "Sim Virak", 
    gender: "ប", 
    dob: "15 ធ្នូ 2005", 
    faculty: "គ្រប់គ្រងពាណិជ្ជកម្ម និងសេដ្ឋកិច្ច", 
    major: "គ្រប់គ្រងសណ្ឋាគារ", 
    subject: "Hospitality Management",
    year: "2", 
    semester: "1", 
    batch: "5", 
    shift: "ព្រឹក", 
    studyDay: "ច័ន្ទ - សុក្រ",
    Note: "" 
  },
  { 
    key: "6", 
    ID: "B230441", 
    nameKhmer: "លី ម៉ារីណា", 
    name: "Ly Marina", 
    gender: "ស", 
    dob: "30 មីនា 2001", 
    faculty: "នីតិសាស្ត្រ និងវិទ្យាសាស្ត្រនយោបាយ", 
    major: "នីតិសាស្ត្រ", 
    subject: "Criminal Law",
    year: "3", 
    semester: "2", 
    batch: "3", 
    shift: "រសៀល", 
    studyDay: "ច័ន្ទ - សុក្រ",
    Note: "ប្តូរវេនសិក្សា" 
  },
  { 
    key: "7", 
    ID: "B260882", 
    nameKhmer: "ហេង រតនា", 
    name: "Heng Ratana", 
    gender: "ប", 
    dob: "12 ឧសភា 2007", 
    faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", 
    major: "វិទ្យាសាស្ត្រនយោបាយ", 
    subject: "International Relations",
    year: "1", 
    semester: "1", 
    batch: "6", 
    shift: "សៅរ៍-អាទិត្យ", 
    studyDay: "សៅរ៍ - អាទិត្យ",
    Note: "" 
  }
]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  // Fix: Calculate femaleCount so it's available for the handlePrint function
  const femaleCount = finalTableData.filter(item => item.gender === "ស").length;

  const handlePrint = () => {
    navigate('/final/ListNamePrint', { 
      state: { 
        data: finalTableData, 
        headerData, 
        femaleCount: toKhmerNum(femaleCount),
        totalCount: toKhmerNum(finalTableData.length)
      } 
    });
  };

  const handleSearch = (values) => {
    const results = masterData.filter(item => 
      (!values.major || item.major === values.major) &&
      (!values.batch || item.batch === values.batch) &&
      (!values.year || item.year === values.year) &&
      (!values.semester || item.semester === values.semester)
    );
    
    setFilteredData(results);

    if (results.length > 0) {
      setHeaderData(prev => ({
        ...prev,
        faculty: results[0].faculty,
        major: results[0].major,
        year: toKhmerNum(results[0].year),
        semester: toKhmerNum(results[0].semester),
        generation: toKhmerNum(results[0].batch),
        shift: results[0].shift,
        examDate: values.examDateRange ? `${formatKhmerDate(values.examDateRange[0])} ដល់ ${formatKhmerDate(values.examDateRange[1])}` : prev.examDate,
        examTime: values.examTime ? `${toKhmerNum(values.examTime[0].format("H:mm"))} ដល់ម៉ោង ${toKhmerNum(values.examTime[1].format("H:mm"))}` : prev.examTime
      }));
    }
  };

  const columns = [
    { 
      title: "ល.រ", 
      key: "index", 
      width: 60, 
      align: "center",
      render: (_, __, index) => toKhmerNum(index + 1), 
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: 100, align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 180 },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 180, render: (t) => t.toUpperCase() },
    { 
      title: "ភេទ", 
      dataIndex: "gender", 
      width: 70, 
      align: "center",
      render: (text) => (
        <span style={{ color: text === "ស" ? "#ff4d4f" : "#1677ff" }}>{text}</span>
      )
    },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 130, align: "center" },
    { 
      title: "ផ្សេងៗ", 
      dataIndex: "Note",
      width: 120,
      align: "center",
      render: (text) => {
        const isDisqualified = text === "Absent" || text === "ដកសិទ្ធិ";
        return (
          <span style={{ 
            color: isDisqualified ? 'red' : 'inherit', 
            fontWeight: isDisqualified ? 'bold' : 'normal',
            display: 'block',
            textAlign: 'center'
          }}>
            {isDisqualified ? "ដកសិទ្ធិ" : text}
          </span>
        );
      }
    },
    {
      title: "សកម្មភាព",
      key: "action",
      className: "no-print", 
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" size="small" icon={<EyeOutlined style={{color: '#8c8c8c'}} />} />
          <Button type="text" size="small" icon={<EditFilled style={{color: '#1677ff'}} />} onClick={() => navigate(`/createStudent${record.key}`)} />
          <Popconfirm title="លុប?" onConfirm={() => setMasterData(masterData.filter(i => i.key !== record.key))}>
            <Button type="text" size="small" danger icon={<DeleteFilled />} />
          </Popconfirm>
          
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#070f7a",
            headerColor: "#ffffff",
            headerBorderRadius: 4,
          },
        },
      }}
    >
      <AdvancedSearchForm 
            onSearch={handleSearch} 
            onClear={() => setFilteredData(null)} 
            fullData={masterData} 
            onPrint={handlePrint} 
        />
      <div className="student-page-wrapper student-list-page-wrapper" style={{ padding: '20px' }}>
        <Card bordered={false} bodyStyle={{ padding: 0 }} className="user-card-main student-table-card sort-card" style={{ width: '100%' }}>
          <Table 
            columns={columns}
            dataSource={finalTableData}
            rowKey={(record) => record.key}
            pagination={false}
            bordered
            size="middle"
            className="custom-official-table"
          />
        </Card>

      </div>
    </ConfigProvider>
  );
};

export default FinalExam;
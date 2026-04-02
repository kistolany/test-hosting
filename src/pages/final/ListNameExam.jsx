import React, { useState } from "react";
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditFilled, 
  DeleteFilled, 
  PrinterOutlined, 
  ClearOutlined
} from '@ant-design/icons';
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Table, Button, Space, ConfigProvider, theme, Form, Row, Col, Select, Popconfirm, DatePicker, TimePicker, Flex
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { RangePicker } = DatePicker;

const AdvancedSearchForm = ({ onSearch, onClear, fullData }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { t } = useLanguage();

  // Ensures dropdowns always have data even after filtering
  const getOptions = (key) => {
    const uniqueValues = [...new Set(fullData.map(item => item[key]).filter(Boolean))];
    return uniqueValues.map(val => ({ value: val, label: val }));
  };

  return (
    <div className="search-inner-container sticky-search no-print">
      <Form 
        form={form} 
        style={{ background: token.colorFillAlter, borderRadius: token.borderRadiusLG, padding: "20px", marginBottom: 20 }} 
        layout="vertical" 
        onFinish={onSearch}
      >
        <Row gutter={[12, 0]} align="bottom">
          <Col xs={24} md={8}>
            <Form.Item name="major" label={t("filters.major")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectMajor")} options={getOptions('major')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item name="batch" label={t("filters.batch")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectBatch")} options={getOptions('batch')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item name="year" label={t("filters.year")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectYear")} options={getOptions('year')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={4}>
            <Form.Item name="semester" label={t("filters.semester")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectSemester")} options={getOptions('semester')} />
            </Form.Item>
          </Col>
          <Col xs={12} md={3}>
            <Form.Item name="shift" label={t("filters.shift")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectShift")} options={getOptions('shift')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 0]} align="bottom">
          <Col xs={24} md={5}>
            <Form.Item name="examDateRange" label={t("filters.examDate")} style={{ marginBottom: 12 }}>
              <RangePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={5}>
            <Form.Item name="examTime" label={t("filters.examTime")} style={{ marginBottom: 12 }}>
              <TimePicker.RangePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={14}>
            <Form.Item label=" " style={{ marginBottom: 12 }}>
            <Flex gap="small"  wrap>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                style={{ backgroundColor: '#070f7a', minWidth: 120 }}
              >
                {t("actions.search")}
              </Button>
              <Button
                icon={<ClearOutlined/>}
                onClick={() => { form.resetFields(); onClear(); }}
                style={{ minWidth: 44 }}
              />
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
                style={{ backgroundColor: '#070f7a', color: "white", minWidth: 100 }}
              >
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
    { key: "1", ID: "B240017", nameKhmer: "ញ៉ សុខញ៉ែន", name: "Nhor Soknhen", gender: "ប", dob: "1 មេសា 2002", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "2", ID: "B240028", nameKhmer: "ប៉េង សំណាង", name: "Peng Samnang", gender: "ប", dob: "9 មករា 2003", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "3", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", name: "ART PHIYA", gender: "ស", dob: "11 មករា 2006", faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា", major: "បង្រៀនភាសាអង់គ្លេស", year: "1", semester: "1", batch: "6", shift: "ព្រឹក", Note: "" },
    { key: "4", ID: "B240085", nameKhmer: "សៀត យូសុះ", name: "Seat Yusos", gender: "ប", dob: "7 មករា 2005", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "រសៀល", Note: "" },
    { key: "5", ID: "B240089", nameKhmer: "ស្មាន ម៉ូស្លីម", name: "Sman Moslim", gender: "ប", dob: "22 មករា 2006", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "6", ID: "B240092", nameKhmer: "ស្រ៊ិន មូភីល", name: "Sren Mopel", gender: "ប", dob: "2 ធ្នូ 2004", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "ដកសិទ្ធិ" },
    { key: "7", ID: "B240098", nameKhmer: "ហួត ពៅលក្ខិណា", name: "Hout Pov Leakhena", gender: "ស", dob: "31 មីនា 1983", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "8", ID: "B240105", nameKhmer: "ចាន់ សុភ័ក្ត្រ", name: "Chan Sopheak", gender: "ប", dob: "15 ឧសភា 2004", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "9", ID: "B240112", nameKhmer: "លី ម៉ារីណា", name: "Ly Marina", gender: "ស", dob: "10 មិថុនា 2005", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
    { key: "10", ID: "B240120", nameKhmer: "ស៊ន វីរៈ", name: "Sorn Veasna", gender: "ប", dob: "25 កញ្ញា 2003", faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា", major: "វិទ្យាសាស្ត្រកុំព្យូទ័រ", year: "4", semester: "1", batch: "4", shift: "ព្រឹក", Note: "" },
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;

  const femaleCount = finalTableData.filter(item => item.gender === "ស").length;

  const handleSearch = (values) => {
    const results = masterData.filter(item => 
      (!values.major || item.major === values.major) &&
      (!values.batch || item.batch === values.batch) &&
      (!values.year || item.year === values.year) &&
      (!values.semester || item.semester === values.semester) &&
      (!values.shift || item.shift === values.shift)
    );

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
    setFilteredData(results);
  };

  const columns = [
      { 
        title: "ល.រ", 
        key: "index", 
        width: "15px", 
        align: "center",
        render: (text, record, index) => toKhmerNum(index + 1), 
      },
      { title: "អត្តលេខ", dataIndex: "ID", width: "70px", align: "center" },
      { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "150px" },
      { title: "អក្សរឡាតាំង", dataIndex: "name", width: "150px", render: (t) => t.toUpperCase() },
      { title: "ភេទ", dataIndex: "gender", width: "30px", align: "center" },
      { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "100px", align: "center" },
      { 
        title: "ផ្សេងៗ", 
        dataIndex: "Note",
        render: (text, record) => (
          <input 
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', color: text === "ដកសិទ្ធិ" ? 'red' : 'inherit', fontWeight: 'bold' }} 
            value={text} 
            onChange={(e) => {
              const updated = masterData.map(item => item.key === record.key ? { ...item, Note: e.target.value } : item);
              setMasterData(updated);
            }}
          />
        )
      },
      {
        title: "សកម្មភាព",
        key: "action",
        className: "action-column no-print", 
        width: "20px",
        align: "center",
        render: (_, record) => (
          <Space>
            <Button type="text" size="small" icon={<EditFilled />} onClick={() => navigate(`/createStudent${record.key}`)} />
            <Popconfirm title="លុប?" onConfirm={() => {
                const updated = masterData.filter(i => i.key !== record.key);
                setMasterData(updated);
                if(filteredData) setFilteredData(updated.filter(i => filteredData.some(f => f.key === i.key)));
            }}>
              <Button type="text" size="small" danger icon={<DeleteFilled />} />
            </Popconfirm>
          </Space>
        ),
      },
    ];

  return (
    <div className="student-page-wrapper">
      <AdvancedSearchForm onSearch={handleSearch} onClear={() => setFilteredData(null)} fullData={masterData} />

      <div className="paper-sheet">
        <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="uni-logo-section" style={{ textAlign: 'center' }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80 }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: 'bold', color:'#070f7a'}}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: 'center' }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5 }} />
          </div>
        </div>
        <div className="document-title-block" style={{ textAlign: 'center', marginTop: '50px' }}>
          <div className="khmer-moul" style={{ fontSize: 14 }}>បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី{headerData.semester} ជំនាន់ទី{headerData.generation} វគ្គ{headerData.generation} សិក្សាវគ្គ{headerData.shift}</div>
          <div className="khmer-moul" style={{ fontSize: 14, marginTop: 5 }}>មហាវិទ្យាល័យ{headerData.faculty}</div>
          <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ៖ {headerData.major}</div>
          <div style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>កាលបរិច្ឆេទប្រឡង៖ {headerData.examDate}</div>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>ម៉ោងប្រឡង៖ {headerData.examTime}</div>
        </div>

        <Table 
          columns={columns}
          dataSource={finalTableData}
          pagination={false}
          bordered
          size="small"
          className="official-table"
        />

        <div style={{ marginTop: 20, fontSize: 15, fontWeight: 'bold' }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {toKhmerNum(finalTableData.length.toString().padStart(2, '0'))} នាក់ ក្នុងនោះស្រីមានចំនួន {toKhmerNum(femaleCount.toString().padStart(2, '0'))} នាក់។</div>
        </div>
        <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0 }}>
          <div className="signature-area" style={{ textAlign: 'center' }}>
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalExam;
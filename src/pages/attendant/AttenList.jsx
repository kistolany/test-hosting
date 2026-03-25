import React, { useState } from "react";
import { Table, Button, Form, Row, Col, Select, Typography, Space, Divider } from "antd";
import { PrinterOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const AttendancePage = () => {
  const [form] = Form.useForm();
  const [searchData, setSearchData] = useState(null);

  // Sample data simulating a database response
  const students = [
    { key: "1", no: "១", id: "B240017", nameKh: "ញ៉ សុខណេន", nameEn: "Nhor Soknhen", gender: "ប", dob: "1 មេសា 2002" },
    { key: "2", no: "២", id: "B240028", nameKh: "ប៉េង សំណាង", nameEn: "Peng Samnang", gender: "ប", dob: "9 មករា 2003" },
    { key: "3", no: "៣", id: "B240085", nameKh: "សៀត យូសុះ", nameEn: "Seat Yusos", gender: "ប", dob: "7 មករា 2005" },
    { key: "4", no: "៤", id: "B240089", nameKh: "ស្មាន មូស្លីម", nameEn: "Sman Moslim", gender: "ប", dob: "22 មករា 2006" },
    { key: "5", no: "៥", id: "B240092", nameKh: "ស្រែន ម៉ូពាល", nameEn: "Sren Mopel", gender: "ប", dob: "2 ធ្នូ 2004", withdrawn: true },
    { key: "6", no: "៦", id: "B240098", nameKh: "ហួត ពៅលក្ខិណា", nameEn: "Hout Pov Leakhena", gender: "ប", dob: "31 មិនា 1983" },
  ];

  const columns = [
    { title: "ល.រ", dataIndex: "no", width: 50, align: "center" },
    { title: "អត្តលេខ", dataIndex: "id", width: 90, align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKh", width: 160 },
    { title: "អក្សរឡាតាំង", dataIndex: "nameEn", width: 160 },
    { title: "ភេទ", dataIndex: "gender", width: 50, align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 130, align: "center" },
    {
      title: "ហត្ថលេខា",
      children: [
        { title: <span className="att-list-vertical-col">System Analysis and Design</span>, width: 90, render: (_, r) => r.withdrawn ? <span className="att-list-row-withdrawn">ដកសិទ្ធ</span> : "" },
        { title: <span className="att-list-vertical-col">Front End Web Development</span>, width: 90 },
        { title: <span className="att-list-vertical-col">Advanced PHP and MySQL</span>, width: 90 },
        { title: <span className="att-list-vertical-col">Network Operating System</span>, width: 90 },
        { title: <span className="att-list-vertical-col">Client/Server App. Development</span>, width: 90 },
      ]
    }
  ];

  const onFinish = (values) => {
    setSearchData(values);
  };

  return (
    <div className="att-list-container">
      {/* Search Header - HIDDEN ON PRINT */}
      <div className="att-list-search-card no-print">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={4}><Form.Item name="batch" label="ជំនាន់"><Select placeholder="Select" options={[{value:'២៤', label:'២៤'}, {value:'២៦', label:'២៦'}]}/></Form.Item></Col>
            <Col span={4}><Form.Item name="year" label="ឆ្នាំទី"><Select placeholder="Select" options={[{value:'៣', label:'៣'}]}/></Form.Item></Col>
            <Col span={4}><Form.Item name="semester" label="ឆមាសទី"><Select placeholder="Select" options={[{value:'១', label:'១'}]}/></Form.Item></Col>
            <Col span={6}><Form.Item name="major" label="ជំនាញ"><Select placeholder="Select" options={[{value:'វិទ្យាសាស្ត្រកុំព្យូទ័រ', label:'វិទ្យាសាស្ត្រកុំព្យូទ័រ'}]}/></Form.Item></Col>
            <Col span={6}><Form.Item name="shift" label="វេនសិក្សា"><Select placeholder="Select" options={[{value:'ព្រឹក', label:'ព្រឹក'}]}/></Form.Item></Col>
          </Row>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">បង្ហាញទិន្នន័យ</Button>
            <Button icon={<ClearOutlined />} onClick={() => {form.resetFields(); setSearchData(null)}}>សម្អាត</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()} disabled={!searchData}>បោះពុម្ព (Print)</Button>
          </Space>
        </Form>
      </div>

      {/* Official Form Area */}
      {searchData && (
        <div className="att-list-sheet">
          <div className="att-list-header">
            <Title level={3}>ទម្រង់វត្តមាននិស្សិតឆ្នាំទី{searchData.year} ឆមាសទី{searchData.semester} ជំនាន់{searchData.batch} វគ្គ២ សិក្សាវេន{searchData.shift}</Title>
            <Title level={3}>មហាវិទ្យាល័យវិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា</Title>
            <Title level={4}>ជំនាញ៖ {searchData.major}</Title>
            <div className="att-list-sub-info">
              <Text strong>កាលបរិច្ឆេទប្រឡង៖ ថ្ងៃទី២៣-២៧ ខែកុម្ភៈ ឆ្នាំ២០២៦</Text><br />
              <Text strong>ម៉ោងប្រឡង៖ ៨:៣០ - ១០:៣០ នាទីព្រឹក</Text>
            </div>
          </div>

          <Table
            className="att-list-table"
            columns={columns}
            dataSource={students}
            pagination={false}
            bordered
            size="small"
          />

          <div className="att-list-footer">
            <div className="att-list-note">
              សម្គាល់៖ បញ្ជីវត្តមានបញ្ចប់ត្រឹមចំនួន {students.length.toString().padStart(2, '០')} នាក់ ក្នុងនោះស្រីមានចំនួន ០០ នាក់។
            </div>
            <div className="att-list-khmer-date">
              ថ្ងៃ ពុធ ២ រោច ខែ ផល្គុន ឆ្នាំរោង ណព្វស័ក ព.ស. ២៥៦៩
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
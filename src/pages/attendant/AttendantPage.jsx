import React, { useState, useEffect } from "react";
import { 
  SearchOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, PrinterOutlined, ClearOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Space, Skeleton, 
  theme, Form, Row, Col, Select, Popconfirm, Tag, Radio, message, Input
} from "antd";

const AttendancePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  
  const [editingKey, setEditingKey] = useState("");

  // នេះគឺជាទិន្នន័យដើមទាំងអស់ (Master Data)
  const [allData, setAllData] = useState([
    { 
      key: "1", No: "1", ID: "B260013", nameKhmer: "អាត ភីយ៉ា", 
      dob: "12-May-2004", batch: "26", studyYear: "1", semester: "1", 
      faculty: "IT", major: "English", studyDay: "mon-fri", shift: "morning",
      attendance: Array(30).fill(null) 
    },
    { 
      key: "2", No: "2", ID: "B260023", nameKhmer: "ហានួន ហុយស្នា", 
      dob: "20-Jan-2005", batch: "27", studyYear: "2", semester: "1", 
      faculty: "IT", major: "English", studyDay: "sat-sun", shift: "afternoon",
      attendance: Array(30).fill(null) 
    },
  ]);

  // បង្កើត State ថ្មីសម្រាប់ទុកទិន្នន័យដែលបាន Filter រួច
  const [filteredData, setFilteredData] = useState(allData);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- មុខងារ Search ---
  const handleSearch = () => {
    setLoading(true);
    const values = form.getFieldsValue(); // យកតម្លៃពី Search Bar
    
    const newFilteredData = allData.filter((item) => {
      return (
        (!values.batch || item.batch === values.batch) &&
        (!values.studyYear || item.studyYear === values.studyYear) &&
        (!values.semester || item.semester === values.semester) &&
        (!values.faculty || item.faculty === values.faculty) &&
        (!values.major || item.major === values.major) &&
        (!values.studyDay || item.studyDay === values.studyDay) &&
        (!values.shift || item.shift === values.shift)
      );
    });

    setTimeout(() => {
      setFilteredData(newFilteredData);
      setLoading(false);
      if(newFilteredData.length === 0) {
        message.info("មិនមានទិន្នន័យដែលអ្នកស្វែងរកទេ");
      }
    }, 500);
  };

  // --- មុខងារ Clear Search ---
  const handleClear = () => {
    form.resetFields();
    setFilteredData(allData);
  };

  const isEditing = (record) => record.key === editingKey;

  const handleDobChange = (studentKey, value) => {
    const updated = allData.map(item => 
      item.key === studentKey ? { ...item, dob: value } : item
    );
    setAllData(updated);
    setFilteredData(updated); // Update ទាំងពីរដើម្បីឱ្យឃើញការកែប្រែភ្លាមៗ
  };

  const handleAttendanceChange = (studentKey, idx, value) => {
    const updated = allData.map(item => {
      if (item.key === studentKey) {
        const newAtt = [...item.attendance];
        newAtt[idx] = value;
        return { ...item, attendance: newAtt };
      }
      return item;
    });
    setAllData(updated);
    // បើកំពុង Filter ក៏ត្រូវ Update ទិន្នន័យក្នុងតារាងដែរ
    setFilteredData(filteredData.map(item => item.key === studentKey ? updated.find(u => u.key === studentKey) : item));
  };

  const calculateDiscipline = (attArray) => {
    const absentCount = attArray.filter(v => v === 'A').length;
    const level = Math.floor(absentCount / 4); 
    return Array.from({ length: 4 }, (_, i) => i < level);
  };

  const calculateScore = (attArray) => {
    const totalSections = attArray.length;
    const attentionCount = attArray.filter(v => v === 'Att').length;
    const finalScore = (attentionCount / totalSections) * 10;
    return finalScore.toFixed(2);
  };

  const attendanceColumns = Array.from({ length: 15 }, (_, weekIdx) => ({
    title: `សប្តាហ៍ ${weekIdx + 1}`,
    children: [1, 2].map(sNum => {
      const idx = (weekIdx * 2) + (sNum - 1);
      return {
        title: `S${sNum}`,
        width: 100,
        align: 'center',
        render: (_, record) => (
          <Radio.Group 
            size="small" 
            disabled={!isEditing(record)}
            className={`att-radio-group selection-${record.attendance[idx]}`}
            value={record.attendance[idx]}
            onChange={(e) => handleAttendanceChange(record.key, idx, e.target.value)}
          >
            <Radio.Button value="Att">Att</Radio.Button>
            <Radio.Button value="P">P</Radio.Button>
            <Radio.Button value="A">A</Radio.Button>
          </Radio.Group>
        )
      };
    }),
  }));

  const columns = [
    { title: "ល.រ", dataIndex: "No", width: 50, align: "center", fixed: 'left' },
    { title: "អត្តលេខ", dataIndex: "ID", width: 90, align: "center", fixed: 'left' },
    { title: "ឈ្មោះនិស្សិត", dataIndex: "nameKhmer", width: 160, fixed: 'left' },
    { 
      title: "ថ្ងៃខែឆ្នាំកំណើត", 
      dataIndex: "dob", 
      width: 140, 
      align: "center", 
      fixed: 'left',
      render: (text, record) => (
        isEditing(record) ? 
        <Input size="small" value={text} onChange={(e) => handleDobChange(record.key, e.target.value)} /> : 
        <span>{text}</span>
      )
    },
    ...attendanceColumns,
    {
      title: "ពិន័យ",
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Space size={2}>
          {calculateDiscipline(record.attendance).map((isBad, i) => (
            <Tag key={i} color={isBad ? "red" : "default"}>{i + 1}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: "ពិន្ទុ (10)",
      width: 85,
      align: 'center',
      render: (_, record) => (
        <strong style={{ color: '#070f7a' }}>{calculateScore(record.attendance)}</strong>
      )
    },
    {
      title: "សកម្មភាព",
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Button type="primary" icon={<SaveOutlined />} size="small" onClick={() => { setEditingKey(""); message.success("Saved!"); }} style={{ backgroundColor: '#52c41a' }}>Save</Button>
        ) : (
          <Space>
            <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => setEditingKey(record.key)} />
            <Popconfirm title="Delete?" onConfirm={() => setAllData(allData.filter(i => i.key !== record.key))}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="att-page-wrapper">
      <div className="search-inner-container" style={{ marginBottom: 20 }}>
        <Form form={form} layout="vertical" style={{ background: token.colorFillAlter, borderRadius: token.borderRadiusLG, padding: "20px" }}>
          <Row gutter={[12, 0]}>
            <Col xs={24} sm={12} md={3}><Form.Item name="batch" label="Batch"><Select allowClear placeholder="Batch" options={[{value: '26', label: 'B26'}, {value: '27', label: 'B27'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="studyYear" label="Year"><Select allowClear placeholder="Year" options={[{value: '1', label: 'Year 1'}, {value: '2', label: 'Year 2'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="semester" label="Semester"><Select allowClear placeholder="Semester" options={[{value: '1', label: 'Sem 1'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={5}><Form.Item name="faculty" label="Faculty"><Select allowClear placeholder="Faculty" options={[{value: 'IT', label: 'IT'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={4}><Form.Item name="major" label="Major"><Select allowClear placeholder="Major" options={[{value: 'English', label: 'English'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="studyDay" label="Study Day"><Select allowClear placeholder="Day" options={[{value: 'mon-fri', label: 'Mon-Fri'}, {value: 'sat-sun', label: 'Sat-Sun'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="shift" label="Shift"><Select allowClear placeholder="Shift" options={[{value: 'morning', label: 'Morning'}, {value: 'afternoon', label: 'Afternoon'}]}/></Form.Item></Col>
          </Row>
          <Flex gap="middle">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ backgroundColor: '#070f7a' }}>Search</Button>
            <Button icon={<ClearOutlined/>} onClick={handleClear}>Clear</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: '#070f7a', color: 'white' }}>Print</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/add-student")} style={{ backgroundColor: '#070f7a' }}>Add New</Button>
          </Flex>
        </Form>
      </div>

      <div className="att-paper-sheet">
        <Skeleton loading={loading} active>
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            pagination={false} 
            bordered 
            size="small" 
            scroll={{ x: 4200 }} 
            className="att-main-table" 
            rowClassName={(record) => isEditing(record) ? 'editing-row' : ''}
          />
        </Skeleton>
      </div>
    </div>
  );
};

export default AttendancePage;
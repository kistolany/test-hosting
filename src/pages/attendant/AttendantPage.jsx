import React, { useState, useEffect } from "react";
import { 
  SearchOutlined, EditOutlined, 
  PrinterOutlined, ClearOutlined,
  EyeOutlined, ArrowLeftOutlined,
  UserOutlined, BookOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Flex, Space, Skeleton, 
  theme, Form, Row, Col, Select, Tag, Radio, message, Typography, Card, Progress, Statistic, Empty
} from "antd";
const { Text, Title } = Typography;
const PRIMARY_COLOR = '#070f7a';

const AttendancePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  
  const [editingKey, setEditingKey] = useState("");
  const [searchSummary, setSearchSummary] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null); 
  const [showMajorReport, setShowMajorReport] = useState(false);

  // --- MOCK ACADEMIC DATA & STUDENT DATA ---
  const academicSetup = [
    { subject: "Web Development", teacher: "លោកគ្រូ សុផល" },
    { subject: "Network Administration", teacher: "អ្នកគ្រូ សុភា" },
    { subject: "Database Management", teacher: "លោកគ្រូ រតនៈ" },
    { subject: "Cyber Security", teacher: "លោកគ្រូ ចាន់ត្រា" },
    { subject: "English for IT", teacher: "អ្នកគ្រូ ម៉ារី" },
  ];

  const studentsBase = [
    { id: "B260013", nameKh: "អាត ភីយ៉ា", nameEn: "At Phiya", gender: "ស្រី", dob: "12-May-2004", batch: "26", year: "1", sem: "1", faculty: "IT", major: "SNA", day: "ចន្ទ-សុក្រ", shift: "ព្រឹក" },
    { id: "B260014", nameKh: "ហានួន ហុយស្នា", nameEn: "Hanoun Hoysna", gender: "ប្រុស", dob: "20-Jan-2005", batch: "26", year: "1", sem: "1", faculty: "IT", major: "SNA", day: "ចន្ទ-សុក្រ", shift: "ព្រឹក" },
    { id: "B260015", nameKh: "ចាន់ សុខា", nameEn: "Chan Sokha", gender: "ប្រុស", dob: "15-Mar-2003", batch: "26", year: "1", sem: "1", faculty: "IT", major: "SNA", day: "ចន្ទ-សុក្រ", shift: "ព្រឹក" },
    { id: "B260016", nameKh: "លី ម៉ារីណា", nameEn: "Ly Marina", gender: "ស្រី", dob: "05-Jul-2004", batch: "26", year: "1", sem: "1", faculty: "IT", major: "SNA", day: "ចន្ទ-សុក្រ", shift: "ព្រឹក" },
    { id: "B260017", nameKh: "សេង ហុង", nameEn: "Seng Hong", gender: "ប្រុស", dob: "30-Nov-2004", batch: "26", year: "1", sem: "1", faculty: "IT", major: "SNA", day: "ចន្ទ-សុក្រ", shift: "ព្រឹក" },
  ];

  // Generating 25 records (5 students x 5 subjects each)
  const initialData = [];
  studentsBase.forEach((std, sIdx) => {
    academicSetup.forEach((course, cIdx) => {
      // Create some random attendance for demo
      const mockAttendance = Array(30).fill('Att');
      if (sIdx === 0 && cIdx === 0) mockAttendance[2] = 'A', mockAttendance[5] = 'A', mockAttendance[8] = 'P', mockAttendance[10] = 'A'; // 4 absences = ណែនាំ
      if (sIdx === 1 && cIdx === 1) { // 9 absences = ធ្វើកិច្ចសន្យា
        for(let i=0; i<9; i++) mockAttendance[i] = 'A';
      }

      initialData.push({
        key: `${std.id}-${cIdx}`,
        No: initialData.length + 1,
        ID: std.id,
        nameKhmer: std.nameKh,
        nameLatin: std.nameEn,
        gender: std.gender,
        dob: std.dob,
        batch: std.batch,
        studyYear: std.year,
        semester: std.sem,
        faculty: std.faculty,
        major: std.major,
        studyDay: std.day,
        shift: std.shift,
        subject: course.subject,
        teacher: course.teacher,
        attendance: mockAttendance
      });
    });
  });

  const [allData, setAllData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(allData);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    const values = form.getFieldsValue(); 
    
    const newFilteredData = allData.filter((item) => {
      return (
        (!values.batch || item.batch === values.batch) &&
        (!values.studyYear || item.studyYear === values.studyYear) &&
        (!values.semester || item.semester === values.semester) &&
        (!values.faculty || item.faculty === values.faculty) &&
        (!values.major || item.major === values.major) &&
        (!values.studyDay || item.studyDay === values.studyDay) &&
        (!values.shift || item.shift === values.shift) &&
        // If subject is not selected, it returns true for all subjects (show all)
        (!values.subject || item.subject === values.subject)
      );
    });

    setTimeout(() => {
      setFilteredData(newFilteredData);
      
      if (Object.values(values).some(v => v)) {
        setSearchSummary({
          batch: values.batch || "...",
          year: values.studyYear || "...",
          semester: values.semester || "...",
          faculty: values.faculty || "...",
          major: values.major || "...",

          subject: values.subject || "គ្រប់មុខវិជ្ជា",
          day: values.studyDay || "...", 
          shift: values.shift || "...",
          teacher: values.subject ? (newFilteredData.length > 0 ? newFilteredData[0].teacher : "N/A") : "គ្រូបង្គោលតាមមុខវិជ្ជា"
        });
      } else {
        setSearchSummary(null);
      }

      setLoading(false);
      if(newFilteredData.length === 0) {
        message.info("មិនមានទិន្នន័យដែលអ្នកស្វែងរកទេ");
      }
    }, 500);
  };

  const handleClear = () => {
    form.resetFields();
    setFilteredData(allData);
    setSearchSummary(null);
  };

  const isEditing = (record) => record.key === editingKey;

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
    setFilteredData(filteredData.map(item => item.key === studentKey ? updated.find(u => u.key === studentKey) : item));
  };

  const getDisciplineStatus = (attArray) => {
    const totalAbsentAndPermit = attArray.filter(v => v === 'A' || v === 'P').length;
    if (totalAbsentAndPermit >= 15) return { text: "ដកសិទ្ធិប្រឡង", color: "#ff4d4f", level: 3 }; 
    if (totalAbsentAndPermit >= 8)  return { text: "ធ្វើកិច្ចសន្យា", color: "#fa8c16", level: 2 }; 
    if (totalAbsentAndPermit >= 4)  return { text: "ណែនាំ", color: "#1890ff", level: 1 };        
    return { text: "", color: "default", level: 0 };
  };

  const calculateScore = (attArray) => {
    const totalSections = attArray.length;
    const attentionCount = attArray.filter(v => v === 'Att').length;
    return ((attentionCount / totalSections) * 10).toFixed(2);
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
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 140, align: "center", fixed: 'left' },
    ...attendanceColumns,
    {
      title: "ពិន័យ",
      width: 120,
      align: 'center',
      render: (_, record) => {
        const status = getDisciplineStatus(record.attendance);
        return (
          <Space direction="vertical" size={0}>
            {status.level > 0 ? (
              <Text style={{ color: status.color, fontWeight: 'bold', fontSize: '11px' }}>{status.text}</Text>
            ) : (
              <Tag color="default">គ្មាន</Tag>
            )}
            <Space size={2} style={{ marginTop: 4 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i <= status.level ? status.color : '#d9d9d9' }} />
              ))}
            </Space>
          </Space>
        );
      }
    },
    { title: "ពិន្ទុ (10)", width: 85, align: 'center', render: (_, record) => <strong style={{ color: PRIMARY_COLOR }}>{calculateScore(record.attendance)}</strong> },
    {
      title: "សកម្មភាព",
      width: 140, 
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: PRIMARY_COLOR }} />} 
            onClick={() => {
                setViewingStudent(record);
                setShowMajorReport(true);
            }} 
          />
          {isEditing(record) ? (
            <Button type="primary" size="small" onClick={() => setEditingKey("")} style={{ backgroundColor: '#52c41a' }}>Save</Button>
          ) : (
            <Button type="text" icon={<EditOutlined style={{ color: '#1677ff' }} />} onClick={() => setEditingKey(record.key)} />
          )}
        </Space>
      )
    },
  ];

  if (showMajorReport) {
    const studentsMap = {};
    const subjectsSet = new Set();
    
    // Process all filtered data to group by student ID
    filteredData.forEach(item => {
      subjectsSet.add(item.subject);
      if (!studentsMap[item.ID]) {
        studentsMap[item.ID] = { ...item, subjectStatus: {} };
      }
      const status = getDisciplineStatus(item.attendance);
      studentsMap[item.ID].subjectStatus[item.subject] = (status.level >= 2) ? status.text : "";
    });

    const reportDataSource = Object.values(studentsMap).map((s, index) => ({ ...s, No: index + 1 }));
    const reportCols = [
        { title: "ល.រ", dataIndex: "No", width: 50, align: 'center' },
        { title: "អត្តលេខ", dataIndex: "ID", width: 100, align: 'center' },
        { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 180 },
        { title: "អក្សរឡាតាំង", dataIndex: "nameLatin", width: 160 },
        { title: "ភេទ", dataIndex: "gender", width: 60, align: 'center' },
        { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 130, align: 'center' },
        ...Array.from(subjectsSet).map(sub => ({
          title: sub,
          dataIndex: ['subjectStatus', sub],
          align: 'center',
          render: (text) => <b style={{ color: text === "ដកសិទ្ធិប្រឡង" ? "#ff4d4f" : "#fa8c16", fontSize: '11px' }}>{text}</b>
        }))
    ];

    return (
      <div style={{ padding: '30px', background: '#fff', minHeight: '100vh' }}>
        <Flex justify="space-between" className="no-print" style={{ marginBottom: 20 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setShowMajorReport(false)}>Back</Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()} style={{ background: PRIMARY_COLOR }}>បោះពុម្ព (Print)</Button>
        </Flex>

      <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="uni-logo-section" style={{ textAlign: 'center' }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: 'bold', color:'#070f7a'}}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: 'center' }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5 }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 25, color: '#070f7a' }}>
    <div style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, fontFamily: 'Khmer OS Muol Light' }}>
        ទម្រង់វត្តមាននិស្សិតឆ្នាំទី {searchSummary?.year} ឆមាសទី {searchSummary?.semester} ជំនាន់ទី {searchSummary?.batch}
    </div>
    <div style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0', fontFamily: 'Khmer OS Muol Light' }}>
        ថ្ងៃសិក្សា {searchSummary?.day} វេនសិក្សា {searchSummary?.shift}
    </div>
    <div style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0', fontFamily: 'Khmer OS Muol Light' }}>
        មហាវិទ្យាល័យ {searchSummary?.faculty}
    </div>
    <div style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, textDecoration: 'underline', fontFamily: 'Khmer OS Muol Light' }}>
        ជំនាញ៖ {searchSummary?.major}
    </div>
</div>

        <Table columns={reportCols} dataSource={reportDataSource} pagination={false} bordered size="small" />
        
        <Flex justify="space-between" style={{ marginTop: 20 }}>
          <Text strong>សម្គាល់៖ បញ្ជីវត្តមានបញ្ចប់ត្រឹមចំនួន {reportDataSource.length.toString().padStart(2, '0')} នាក់</Text>
          <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <div className="signature-area" style={{ textAlign: 'center' }}>
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
          </div>
        </div>
        </Flex>
        <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } }`}</style>
      </div>
    );
  }

  return (
    <div className="att-page-wrapper">
      <div className="att-search-inner-container" style={{background:'white', 
  marginBottom: 20, 
  position: 'sticky', 
  top: 60, 
  zIndex: 1000 
}}>
        <Form form={form} layout="vertical" style={{ background: token.colorFillAlter, borderRadius: token.borderRadiusLG, padding: "20px" }}>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={2}><Form.Item name="batch" label="Batch"><Select allowClear placeholder="Batch" options={[{value: '26', label: 'B26'}, {value: '27', label: 'B27'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={2}><Form.Item name="studyYear" label="Year"><Select allowClear placeholder="Year" options={[{value: '1', label: 'Year 1'}, {value: '2', label: 'Year 2'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={2}><Form.Item name="semester" label="Semester"><Select allowClear placeholder="Semester" options={[{value: '1', label: 'Sem 1'}, {value: '2', label: 'Sem 2'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={4}><Form.Item name="faculty" label="Faculty"><Select allowClear placeholder="Faculty" options={[{value: 'IT', label: 'IT'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={4}><Form.Item name="major" label="Major"><Select allowClear placeholder="Major" options={[{value: 'SNA', label: 'SNA'}, {value: 'English', label: 'English'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={4}><Form.Item name="subject" label="Subject"><Select allowClear placeholder="Subject" options={academicSetup.map(a => ({value: a.subject, label: a.subject}))}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="studyDay" label="Study Day"><Select allowClear placeholder="Day" options={[{value: 'ចន្ទ-សុក្រ', label: 'ចន្ទ-សុក្រ'}, {value: 'សៅរ៍-អាទិត្យ', label: 'សៅរ៍-អាទិត្យ'}]}/></Form.Item></Col>
            <Col xs={24} sm={12} md={3}><Form.Item name="shift" label="Shift"><Select allowClear placeholder="Shift" options={[{value: 'ព្រឹក', label: 'ព្រឹក'}, {value: 'ល្ងាច', label: 'ល្ងាច'}]}/></Form.Item></Col>
          </Row>
          <Flex gap="middle">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ backgroundColor: PRIMARY_COLOR }}>Search Student</Button>
            <Button icon={<EyeOutlined />} onClick={() => setShowMajorReport(true)} disabled={!searchSummary}>View Report</Button>
            <Button icon={<ClearOutlined/>} onClick={handleClear}></Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>Print List</Button>
          </Flex>
        </Form>
      </div>

      {searchSummary && (
        <div style={{ textAlign: 'center', marginBottom: 30, color: '#000' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
            ទម្រង់វត្តមាននិស្សិតឆ្នាំទី {searchSummary.year} ឆមាសទី {searchSummary.semester} ជំនាន់ទី {searchSummary.batch}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
            ថ្ងៃសិក្សា {searchSummary.day} វេនសិក្សា {searchSummary.shift}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
            មហាវិទ្យាល័យ {searchSummary.faculty}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            ជំនាញ៖ {searchSummary.major}
          </div>
          <div style={{ fontSize: '15px', borderTop: '1px solid #000', paddingTop: '8px', marginTop: '10px', display: 'inline-block', minWidth: '500px' }}>
             <Text strong>មុខវិជ្ជា៖ </Text> <span style={{ color: 'red', fontWeight: 'bold' }}>{searchSummary.subject}</span>
             <Text strong style={{ marginLeft: 40 }}>គ្រូបង្រៀន៖ </Text> <Text style={{ fontWeight: 'bold' }}>{searchSummary.teacher}</Text>
          </div>
        </div>
      )}

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
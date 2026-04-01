import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Form, Row, Col, Select, Card, Table, Tag, Space, Pagination,
  Typography, Tooltip, message, Modal, Input,
} from "antd";
import {
  SwapLeftOutlined, SearchOutlined, DeleteOutlined, 
  CheckCircleOutlined, ClearOutlined, UserOutlined, TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SortingPage = () => {
  const navigate = useNavigate();
  const [filterForm] = Form.useForm();
  const [enrollForm] = Form.useForm(); 

  const initialStudents = [
    { key: "1", id: "STU-001", nameKh: "ហេង សុវណ្ណ", nameEn: "Heng Sovann", gender: "M", dob: "2002-05-20", phone: "012 345 678", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "Full Scholarship" },
    { key: "2", id: "STU-002", nameKh: "លី ម៉ារីណា", nameEn: "Ly Marina", gender: "F", dob: "2003-11-12", phone: "098 765 432", faculty: "law", major: "ba", batch: "21", year: "2", class: "B1", type: "Pay", note: "" },
    { key: "3", id: "STU-003", nameKh: "កែវ វិសាល", nameEn: "Keo Visal", gender: "M", dob: "2001-01-30", phone: "010 111 222", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "50% Discount" },
  ];

  const [waitingStudents, setWaitingStudents] = useState(initialStudents); 
  const [enrolledStudents, setEnrolledStudents] = useState([]); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.body.classList.add("student-list-only-table-scroll");
    return () => {
      document.body.classList.remove("student-list-only-table-scroll");
    };
  }, []);

  // Helper for Khmer Numbers
  // const toKhmerNum = (num) => {
  //   const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  //   return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  // };

  const handleOpenEnrollModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning({ content: "សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!", className: "sort-khmer-text" });
      return;
    }
    setIsEnrollModalOpen(true);
  };

  const onConfirmEnroll = async () => {
    try {
      const values = await enrollForm.validateFields();
      const registerValues = filterForm.getFieldsValue(["batch", "year"]);
      const moving = waitingStudents
        .filter((s) => selectedRowKeys.includes(s.key))
        .map((student) => ({
          ...student,
          batch: registerValues.batch || student.batch,
          year: registerValues.year || student.year,
          class: values.class,
        }));

      if (moving.length === 0) {
        message.error({
          content: "Enrollment fail: មិនមាននិស្សិតត្រូវបែងចែក!",
          className: "sort-khmer-text",
        });
        return;
      }

      setEnrolledStudents((prev) => [...prev, ...moving]);
      setWaitingStudents((prev) => prev.filter((s) => !selectedRowKeys.includes(s.key)));

      setSelectedRowKeys([]);
      setIsEnrollModalOpen(false);
      enrollForm.resetFields();

      message.success({
        content: `Enrollment success: បានបែងចែកនិស្សិត ${moving.length} នាក់រួចរាល់!`,
        className: "sort-khmer-text",
      });

      setTimeout(() => {
        navigate("/student");
      }, 900);
    } catch (error) {
      message.error({
        content: "Enrollment fail: សូមពិនិត្យព័ត៌មានហើយព្យាយាមម្តងទៀត!",
        className: "sort-khmer-text",
      });
    }
  };

  const handleSearch = (values) => {
    const { searchText, faculty, major, batch, year, class: className } = values;
    const allData = [...initialStudents, ...enrolledStudents, ...waitingStudents];
    const uniqueData = Array.from(new Map(allData.map(item => [item.key, item])).values());

    const filteredData = uniqueData.filter((s) => {
      const matchSearch = !searchText || 
        s.id.toLowerCase().includes(searchText.toLowerCase()) || 
        s.nameKh.includes(searchText) || 
        s.nameEn.toLowerCase().includes(searchText.toLowerCase());

      return (
        matchSearch &&
        (!faculty || s.faculty === faculty) &&
        (!major || s.major === major) &&
        (!batch || s.batch === batch) &&
        (!year || s.year === year) &&
        (!className || s.class === className)
      );
    });

    setWaitingStudents(filteredData);
    setEnrolledStudents(prev => prev.filter(e => !filteredData.some(f => f.key === e.key)));
    setSelectedRowKeys([]);
    setCurrentPage(1);
  };

  const handleClear = () => {
    filterForm.resetFields();
    setCurrentPage(1);
  };

  const columnTextStyle = { fontSize: '16px', fontWeight: '500' };

  const commonColumns = [
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">អត្តលេខ</Text>, dataIndex: "id", key: "id", width: 100, render: (text) => <Text style={columnTextStyle}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ឈ្មោះខ្មែរ</Text>, dataIndex: "nameKh", key: "nameKh", render: (text) => <Text style={{ ...columnTextStyle, color: '#070f7a' }}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ឈ្មោះឡាតាំង</Text>, dataIndex: "nameEn", key: "nameEn", render: (text) => <Text style={columnTextStyle}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ភេទ</Text>, dataIndex: "gender", key: "gender", width: 80, align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: '14px', padding: '2px 10px' }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ថ្ងៃខែឆ្នាំកំណើត</Text>, dataIndex: "dob", key: "dob", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ជំនាញ</Text>, dataIndex: "major", key: "major", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">លេខទូរស័ព្ទ</Text>, dataIndex: "phone", key: "phone", render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '16px', color: '#ffffff' }} className="sort-khmer-text">ប្រភេទនិស្សិត</Text>, dataIndex: "type", key: "type", width: 140,
      render: (type) => (
        <Tag color={type === "Scholarship" ? "gold" : "cyan"} style={{ fontSize: '14px' }}>
          {type === "Scholarship" ? "Scholarship" : "Pay"}
        </Tag>
      )
    },
  ];

  const waitingColumns = [
    ...commonColumns,
    { key: "action", width: 100, fixed: 'right', align: 'center' }
  ];

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedWaitingStudents = waitingStudents.slice(startIndex, startIndex + PAGE_SIZE);

  const enrolledColumns = [
    ...commonColumns,
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ជំនាន់</Text>, dataIndex: "batch" },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ឆ្នាំសិក្សា</Text>, dataIndex: "year" },
    { title: <Text strong style={{ fontSize: '16px' }} className="sort-khmer-text">ថ្នាក់</Text>, dataIndex: "class" },
  ];

  return (
    <div className="sort-container student-page-wrapper student-list-page-wrapper student-list-auto-bg" style={{ paddingBottom: selectedRowKeys.length > 0 ? 120 : 20 }}>
      {/* Print CSS */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          .content,
          .main-inner-layout,
          .sort-container {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }

          .no-print, .ant-table-selection-column { display: none !important; }

          .sort-container {
            padding: 0 !important;
            background: #ffffff !important;
          }

          .ant-card,
          .ant-card-body,
          .ant-table-wrapper,
          .ant-spin-nested-loading,
          .ant-spin-container,
          .ant-table,
          .ant-table-container,
          .ant-table-content,
          .ant-table-body {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
          }

          .ant-table table {
            width: 100% !important;
            table-layout: auto !important;
          }

          .ant-table-cell {
            white-space: normal !important;
            word-break: break-word !important;
            font-size: 11px !important;
            padding: 6px 8px !important;
          }

          .ant-pagination {
            display: none !important;
          }
        }
      `}</style>

      <div className="sort-header-wrapper">
        <div className="sort-header-left">
          <Button type="default" icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
        </div>
        <div className="sort-header-text">
          <Title className="sort-header-title" level={3}>បញ្ជីឈ្មោះនិស្សិតទាំងអស់</Title>
          <Text type="secondary" className="sort-khmer-text sort-header-subtitle">គ្រប់គ្រង និងចាត់ចែងនិស្សិតចូលតាមផ្នែកនីមួយៗ</Text>
        </div>
        <div className="sort-header-right">
          <div className="sort-pending-inline sort-khmer-text">
            <span className="sort-pending-label">Pending Students</span>
            <span className="sort-pending-value">
              <UserOutlined style={{ fontSize: 16 }} />
              <span>{waitingStudents.length}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="search-inner-container sticky-search no-print" style={{ width: "100%", maxWidth: "1400px", marginBottom: 12 }}>
        <Form className="student-search-form" form={filterForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[12, 12]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label="Search Name / ID" name="searchText">
                <Input placeholder="Search name or student ID..." prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label="Faculty" name="faculty"><Select placeholder="Faculty" allowClear><Select.Option value="it">IT</Select.Option><Select.Option value="law">Law</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label="Major" name="major"><Select placeholder="Major" allowClear><Select.Option value="cs">CS</Select.Option><Select.Option value="ba">BA</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label="Batch" name="batch" rules={[{ required: true, message: "Select Batch" }]}><Select placeholder="Batch" allowClear><Select.Option value="20">20</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label="Year" name="year" rules={[{ required: true, message: "Select Year" }]}><Select placeholder="Year" allowClear><Select.Option value="1">1</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label="Class" name="class"><Select placeholder="Class" allowClear><Select.Option value="A1">A1</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label={<span style={{ visibility: "hidden" }}>Actions</span>} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 10, justifyContent: "space-between", padding: "0 6px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    style={{ backgroundColor: '#070f7a', width: 132 }}
                  >
                    Search
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={handleClear} style={{ width: 132 }}>
                    Clear
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <Modal 
        title={(
          <div className="sort-enroll-modal-title sort-khmer-text">
            <span>បែងចែកនិស្សិតចូលរៀន (Student Enrollment)</span>
            <span className="sort-enroll-modal-count">បានជ្រើសរើស: {selectedRowKeys.length} នាក់</span>
          </div>
        )} 
        open={isEnrollModalOpen} onOk={onConfirmEnroll} onCancel={() => setIsEnrollModalOpen(false)}
        okText="Confirm Enrollment" cancelText="Cancel" width={360}
      >
        <Form form={enrollForm} layout="vertical">
          <Row gutter={16}>
            <Col span={24}><Form.Item label="Class" name="class" rules={[{ required: true }]}><Select placeholder="Class"><Select.Option value="A1">A1</Select.Option><Select.Option value="B1">B1</Select.Option></Select></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

      <Card bordered={false} className="user-card-main student-table-card sort-card" style={{ width: '100%', maxWidth: '1405px' }}>
        <div className="student-table-overflow-x">
          <div className="student-table-overflow" style={{ overflowY: "auto", maxHeight: 390 }}>
            <Table 
              rowSelection={{ 
                selectedRowKeys, 
                onChange: setSelectedRowKeys,
                columnClassName: "no-print",
                fixed: true,
                columnWidth: 56,
              }} 
              columns={waitingColumns} 
              dataSource={pagedWaitingStudents} 
              pagination={false}
              scroll={{ x: "max-content" }} 
              bordered={false}
              style={{ minWidth: 1400 }}
            />
          </div>
        </div>

        <div className="student-table-pagination no-print">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={waitingStudents.length}
            showSizeChanger={false}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </Card>

      {/* FLOATING ACTION BAR: Matches your Result page pop-up */}
      {selectedRowKeys.length > 0 && (
        <div className="no-print" style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          zIndex: 1000
        }}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '1.5px solid #070f7a',
              padding: '4px 0'
            }}
          >
            <Row align="middle" justify="end">
              <Col>
                <Space size="middle" style={{ marginRight: '20px' }}>
                  <Button size="large" onClick={() => setSelectedRowKeys([])}>Cancel</Button>
                  <Button 
                    size="large"
                    type="primary" 
                    icon={<CheckCircleOutlined />} 
                    style={{ backgroundColor: '#070f7a', minWidth: '220px' }}
                    onClick={handleOpenEnrollModal}
                  >
                    Enrollment
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SortingPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Button, Form, Row, Col, Select, Card, Table, Tag,
  Typography, message, Input,
} from "antd";
import {
  SwapLeftOutlined, SearchOutlined,
  ClearOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const SortingPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [filterForm] = Form.useForm();

  const initialStudents = [
    { key: "1", id: "STU-001", nameKh: "ហេង សុវណ្ណ", nameEn: "Heng Sovann", gender: "M", dob: "2002-05-20", phone: "012 345 678", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "Full Scholarship" },
    { key: "2", id: "STU-002", nameKh: "លី ម៉ារីណា", nameEn: "Ly Marina", gender: "F", dob: "2003-11-12", phone: "098 765 432", faculty: "law", major: "ba", batch: "21", year: "2", class: "B1", type: "Pay", note: "" },
    { key: "3", id: "STU-003", nameKh: "កែវ វិសាល", nameEn: "Keo Visal", gender: "M", dob: "2001-01-30", phone: "010 111 222", faculty: "it", major: "cs", batch: "20", year: "1", class: "A1", type: "Scholarship", note: "50% Discount" },
    { key: "4", id: "STU-004", nameKh: "សេង វុទ្ធី", nameEn: "Seng Vuthy", gender: "M", dob: "2002-08-17", phone: "086 222 101", faculty: "law", major: "ba", batch: "22", year: "2", class: "A2", type: "Pay", note: "" },
    { key: "5", id: "STU-005", nameKh: "ផាន ស្រីពៅ", nameEn: "Phan Srey Pov", gender: "F", dob: "2003-02-03", phone: "097 552 116", faculty: "it", major: "cs", batch: "22", year: "2", class: "A3", type: "Scholarship", note: "25% Discount" },
    { key: "6", id: "STU-006", nameKh: "ហួត ចាន់ណា", nameEn: "Huot Channa", gender: "M", dob: "2001-10-09", phone: "012 802 663", faculty: "it", major: "cs", batch: "21", year: "3", class: "A4", type: "Pay", note: "" },
    { key: "7", id: "STU-007", nameKh: "យិន សុភី", nameEn: "Yin Sophea", gender: "F", dob: "2002-04-25", phone: "099 443 250", faculty: "law", major: "ba", batch: "21", year: "1", class: "A5", type: "Scholarship", note: "50% Discount" },
    { key: "8", id: "STU-008", nameKh: "ចិន វាសនា", nameEn: "Chin Veasna", gender: "M", dob: "2003-07-14", phone: "077 114 870", faculty: "it", major: "cs", batch: "23", year: "1", class: "A6", type: "Pay", note: "" },
    { key: "9", id: "STU-009", nameKh: "លីម រតនា", nameEn: "Lim Rattana", gender: "F", dob: "2002-12-01", phone: "015 900 445", faculty: "law", major: "ba", batch: "22", year: "2", class: "A7", type: "Scholarship", note: "Full Scholarship" },
  ];

  const [waitingStudents, setWaitingStudents] = useState(initialStudents); 
  const [enrolledStudents, setEnrolledStudents] = useState([]); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("A1");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const classNameOptions = Array.from({ length: 30 }, (_, index) => `A${index + 1}`);

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

  const onConfirmEnroll = () => {
    if (selectedRowKeys.length === 0) {
      message.warning({ content: "សូមជ្រើសរើសនិស្សិតដើម្បីបន្ត!", className: "sort-khmer-text" });
      return;
    }

    if (!selectedClassName) {
      message.warning({ content: "សូមជ្រើសរើសថ្នាក់!", className: "sort-khmer-text" });
      return;
    }

    const registerValues = filterForm.getFieldsValue(["batch", "year"]);
    const moving = waitingStudents
      .filter((s) => selectedRowKeys.includes(s.key))
      .map((student) => ({
        ...student,
        batch: registerValues.batch || student.batch,
        year: registerValues.year || student.year,
        class: selectedClassName,
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

    message.success({
      content: `Enrollment success: បានបែងចែកនិស្សិត ${moving.length} នាក់រួចរាល់!`,
      className: "sort-khmer-text",
    });

    setTimeout(() => {
      navigate("/classes");
    }, 900);
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

  const columnTextStyle = { fontSize: '13px', fontWeight: '500' };

  const commonColumns = [
    { title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">អត្តលេខ</Text>, dataIndex: "id", key: "id", width: 80, render: (text) => <Text style={columnTextStyle}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">ឈ្មោះខ្មែរ</Text>, dataIndex: "nameKh", key: "nameKh", width: 120, render: (text) => <Text style={{ ...columnTextStyle, color: '#070f7a' }}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">ភេទ</Text>, dataIndex: "gender", key: "gender", width: 60, align: 'center',
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: '12px', padding: '1px 8px' }}>
          {gender === "M" ? "ប្រុស" : "ស្រី"}
        </Tag>
      ),
    },
    { title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">ថ្ងៃខែឆ្នាំកំណើត</Text>, dataIndex: "dob", key: "dob", width: 110, render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">ជំនាញ</Text>, dataIndex: "major", key: "major", width: 70, render: (text) => <Text style={{...columnTextStyle, textTransform: 'uppercase'}}>{text}</Text> },
    { 
      title: <Text strong style={{ fontSize: '13px', color: '#ffffff' }} className="sort-khmer-text">ប្រភេទនិស្សិត</Text>, dataIndex: "type", key: "type", width: 92,
      render: (type) => (
        <Tag color={type === "Scholarship" ? "gold" : "cyan"} style={{ fontSize: '12px' }}>
          {type === "Scholarship" ? "Scholarship" : "Pay"}
        </Tag>
      )
    },
  ];

  const waitingColumns = [...commonColumns];

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedWaitingStudents = waitingStudents.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(waitingStudents.length / PAGE_SIZE));
  const canEnroll = selectedRowKeys.length > 0;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (nextPage) => {
    const safePage = Math.max(1, Math.min(totalPages, nextPage));
    if (safePage === currentPage) return;
    setCurrentPage(safePage);
  };

  const enrolledColumns = [
    ...commonColumns,
    { title: <Text strong style={{ fontSize: '14px' }} className="sort-khmer-text">ជំនាន់</Text>, dataIndex: "batch" },
    { title: <Text strong style={{ fontSize: '14px' }} className="sort-khmer-text">ឆ្នាំសិក្សា</Text>, dataIndex: "year" },
    { title: <Text strong style={{ fontSize: '14px' }} className="sort-khmer-text">ថ្នាក់</Text>, dataIndex: "class" },
  ];

  return (
    <div
      className={`sort-container student-page-wrapper student-list-page-wrapper student-list-auto-bg ${lang === "km" ? "sort-lang-km" : ""}`}
      style={{ paddingBottom: selectedRowKeys.length > 0 ? 120 : 20 }}
    >
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
          <Button type="default" icon={<SwapLeftOutlined />} onClick={() => navigate(-1)}>{t("actions.back")}</Button>
        </div>
        <div className="sort-header-text">
          <Title className="sort-header-title" level={3}>
            {t("sortPage.subtitle")}
          </Title>
        </div>
      </div>

      <div
        className="search-inner-container sticky-search no-print"
        style={{ width: "calc(100% - 40px)", maxWidth: "1400px", margin: "0 auto 12px" }}
      >
        <Form className="student-search-form" form={filterForm} layout="vertical" onFinish={handleSearch}>
          <Row gutter={[5, 5]} align="bottom">
            <Col xs={24} sm={12} md={8} lg={5}>
              <Form.Item label={t("filters.searchNameId")} name="searchText">
                <Input placeholder={t("filters.searchNameOrStudentId")} prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label={t("filters.faculty")} name="faculty"><Select placeholder={t("filters.selectFaculty")} allowClear><Select.Option value="it">IT</Select.Option><Select.Option value="law">Law</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label={t("filters.major")} name="major"><Select placeholder={t("filters.selectMajor")} allowClear><Select.Option value="cs">CS</Select.Option><Select.Option value="ba">BA</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label={t("filters.batch")} name="batch"><Select placeholder={t("filters.selectBatch")} allowClear><Select.Option value="20">20</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label={t("filters.year")} name="year"><Select placeholder={t("filters.selectYear")} allowClear><Select.Option value="1">1</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={3}><Form.Item label={t("filters.class")} name="class"><Select placeholder={t("filters.selectClass")} allowClear><Select.Option value="A1">A1</Select.Option></Select></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Form.Item label={<span style={{ visibility: "hidden" }}>Actions</span>} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 5, justifyContent: "flex-start", paddingRight: 10 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    style={{ backgroundColor: '#070f7a', width: 132 }}
                  >
                    {t("actions.search")}
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={handleClear} style={{ width: 132 }}>
                    {t("actions.clear")}
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <Row
        className="sort-inline-row"
        gutter={[16, 12]}
        align="top"
        style={{ width: "calc(100% - 40px)", maxWidth: "1400px", margin: "20px auto 0" }}
      >
        <Col xs={24} md={16} lg={17}>
          <Card bordered={false} className="user-card-main student-table-card sort-card" style={{ width: '100%', maxWidth: '100%' }}>
            <Table 
              className="sort-waiting-table"
              rowSelection={{ 
                selectedRowKeys, 
                onChange: setSelectedRowKeys,
                columnClassName: "no-print",
                columnWidth: 34,
              }} 
              columns={waitingColumns} 
              dataSource={pagedWaitingStudents} 
              pagination={false}
              bordered={false}
            />

            <div className="student-table-pagination no-print scholar-exam-pagination">
              <Button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="scholar-exam-page-btn scholar-exam-page-btn-arrow"
                aria-label="Previous page"
                icon={<LeftOutlined />}
              />

              <Button
                className="scholar-exam-page-btn scholar-exam-page-btn-current"
                disabled
                aria-current="page"
              >
                {currentPage}
              </Button>

              <Button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="scholar-exam-page-btn scholar-exam-page-btn-arrow"
                aria-label="Next page"
                icon={<RightOutlined />}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8} lg={7} className="no-print">
          <Card className="sort-enroll-side-card shadow-lg shadow-slate-900/10 ring-1 ring-slate-200/80 rounded-xl" bordered={false}>
            <div className="sort-enroll-modal-title sort-khmer-text mb-3">
              <span>{t("navigation.enrollment")}</span>
              <span className="sort-enroll-modal-count" aria-live="polite">
                <UserOutlined className="sort-enroll-count-icon" />
                <span className="sort-enroll-count-number">{selectedRowKeys.length}</span>
                <span className="sort-enroll-count-label">{t("sortPage.selectedLabel")}</span>
              </span>
            </div>

            <div className="sort-class-list-label">
              <span className="sort-class-required">*</span> Class
            </div>

            <div className="sort-class-grid" role="listbox" aria-label="Class list">
              {classNameOptions.map((className) => (
                <button
                  key={className}
                  type="button"
                  className={`sort-class-chip ${selectedClassName === className ? "active" : ""}`}
                  onClick={() => setSelectedClassName(className)}
                  aria-selected={selectedClassName === className}
                >
                  {className}
                </button>
              ))}
            </div>

            <div className="sort-enroll-action-row">
              <Button
                className="sort-enroll-cancel-btn"
                onClick={() => {
                  setSelectedRowKeys([]);
                  setSelectedClassName(null);
                }}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                type="primary"
                className="sort-enroll-submit-btn"
                onClick={onConfirmEnroll}
                disabled={!canEnroll || !selectedClassName}
              >
                {t("navigation.enrollment")}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SortingPage;
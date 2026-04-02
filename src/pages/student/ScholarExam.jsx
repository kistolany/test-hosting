import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SearchOutlined,
  PrinterOutlined,
  ClearOutlined,
  PlusOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Flex,
  Space,
  Tag,
  Popconfirm,
  ConfigProvider,
  Form,
  Row,
  Col,
  Select,
  Card,
  Pagination,
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";
import { pushNotification } from "../../utils/notifications";

const AdvancedSearchForm = ({ onSearch, onClear, onPrint, initialData }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getOptions = (key) => {
    const uniqueValues = [...new Set(initialData.map((item) => item[key]).filter(Boolean))];
    return uniqueValues.map((val) => ({ value: val, label: val }));
  };

  return (
    <div className="search-inner-container sticky-search no-print">
      <Form
        className="student-search-form"
        form={form}
        name="scholar_exam_search"
        layout="vertical"
        onFinish={(values) => {
          onSearch(values);
        }}
      >
        <Row gutter={[12, 10]} align="bottom">
          <Col xs={24} sm={12} md={8} lg={3}>
            <Form.Item name="yearLevel" label={t("filters.year")} style={{ marginBottom: 12 }}>
              <Select
                allowClear
                placeholder={t("filters.selectYear")}
                options={[
                  { value: "១", label: "ឆ្នាំទី១" },
                  { value: "២", label: "ឆ្នាំទី២" },
                  { value: "៣", label: "ឆ្នាំទី៣" },
                  { value: "៤", label: "ឆ្នាំទី៤" },
                ]}
              />
            </Form.Item>
          </Col>

          {[{ name: "batch", label: t("filters.batch") }, { name: "semester", label: t("filters.semester") }].map((field) => (
            <Col xs={24} sm={12} md={8} lg={3} key={field.name}>
              <Form.Item name={field.name} label={field.label} style={{ marginBottom: 12 }}>
                <Select
                  allowClear
                  placeholder={field.name === "batch" ? t("filters.selectBatch") : t("filters.selectSemester")}
                  options={getOptions(field.name)}
                />
              </Form.Item>
            </Col>
          ))}

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="studyYear" label={t("filters.studyYear")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectStudyYear")} options={getOptions("studyYear")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="faculty" label={t("filters.faculty")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectFaculty")} options={getOptions("faculty")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="major" label={t("filters.major")} style={{ marginBottom: 12 }}>
              <Select allowClear placeholder={t("filters.selectMajor")} options={getOptions("major")} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={3}>
            <Form.Item name="shift" label={t("filters.shift")} style={{ marginBottom: 12 }}>
              <Select
                allowClear
                placeholder={t("filters.selectShift")}
                options={[
                  { value: "ព្រឹក", label: "ព្រឹក" },
                  { value: "រសៀល", label: "រសៀល" },
                  { value: "យប់", label: "យប់" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 10]} align="bottom">
          <Col span={24}>
            <Form.Item style={{ marginBottom: 6 }}>
              <Flex className="student-search-actions" justify="flex-start" gap="small" wrap="wrap">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  style={{ backgroundColor: "#070f7a" }}
                >
                  {t("actions.search")}
                </Button>
                <Button
                  icon={<ClearOutlined />}
                  onClick={() => {
                    form.resetFields();
                    onClear();
                  }}
                />
                <Button
                  icon={<PrinterOutlined />}
                  onClick={onPrint}
                  style={{ backgroundColor: "#070f7a", color: "white" }}
                >
                  {t("actions.print")}
                </Button>
                <ConfigProvider theme={{ token: { colorPrimary: "#070f7a" } }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/createStudent", { state: { mode: "create" } })}
                  >
                    {t("actions.addNew")}
                  </Button>
                </ConfigProvider>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const ScholarExam = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const tableTopRef = useRef(null);
  const PAGE_SIZE = 10;
  const textOrDash = (value) => (value === undefined || value === null || value === "" ? "-" : value);
  const [editingStatusKey, setEditingStatusKey] = useState(null);
  const getStatusLabel = (status) => {
    if (status === "PASS") return t("status.pass");
    if (status === "FAIL") return t("status.fail");
    return t("status.pending");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [headerData, setHeaderData] = useState({
    major: "...",
    studyYear: "...",
    examDate: "........................",
    examTime: "........................",
  });

  const [masterData, setMasterData] = useState([
    {
      key: "1",
      ID: "B260013",
      nameKhmer: "អាត ភីយ៉ា",
      name: "ART PHIYA",
      gender: "F",
      dob: "11-Jan-06",
      yearLevel: "១",
      batch: "4",
      major: "បង្រៀនភាសាអង់គ្លេស",
      faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា",
      studyYear: "២០២៨-២០២៩",
      semester: "1",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "2",
      ID: "B260023",
      nameKhmer: "ហានួន ហុយស្នា",
      name: "HARUN HUYSNA",
      gender: "F",
      dob: "28-Apr-06",
      yearLevel: "២",
      batch: "4",
      major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ",
      faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
      studyYear: "២០២៥-២០២៦",
      semester: "1",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "3",
      ID: "B260026",
      nameKhmer: "សុគ្រី សាអ៊ីទី",
      name: "SOKRY SAIDI",
      gender: "M",
      dob: "12-Feb-08",
      yearLevel: "១",
      batch: "4",
      major: "បង្រៀនភាសាអង់គ្លេស",
      faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា",
      studyYear: "២០២៦-២០២៧",
      semester: "2",
      shift: "រសៀល",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "4",
      ID: "B260030",
      nameKhmer: "លីម សុភ័ក្ត្រ",
      name: "LIM SOPHEAK",
      gender: "M",
      dob: "05-May-05",
      yearLevel: "៣",
      batch: "4",
      major: "គ្រប់គ្រងពាណិជ្ជកម្ម",
      faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង",
      studyYear: "២០២៦-២០២៧",
      semester: "1",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "5",
      ID: "B260045",
      nameKhmer: "ឆាយ លីនដា",
      name: "CHHAY LINDA",
      gender: "F",
      dob: "20-Nov-04",
      yearLevel: "១",
      batch: "4",
      major: "សេដ្ឋកិច្ចឌីជីថល",
      faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង",
      studyYear: "២០២៥-២០២៦",
      semester: "1",
      shift: "យប់",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "6",
      ID: "B260052",
      nameKhmer: "ឡុង ចន្ធូ",
      name: "LONG CHANTHOU",
      gender: "M",
      dob: "16-Aug-05",
      yearLevel: "២",
      batch: "5",
      major: "បង្រៀនភាសាអង់គ្លេស",
      faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា",
      studyYear: "២០២៦-២០២៧",
      semester: "2",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "7",
      ID: "B260061",
      nameKhmer: "ពេជ្រ ស្រីពេជ្រ",
      name: "PICH SREYPICH",
      gender: "F",
      dob: "02-Feb-06",
      yearLevel: "៣",
      batch: "5",
      major: "គ្រប់គ្រងពាណិជ្ជកម្ម",
      faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង",
      studyYear: "២០២៧-២០២៨",
      semester: "1",
      shift: "រសៀល",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "8",
      ID: "B260078",
      nameKhmer: "សំអាត វីរៈ",
      name: "SAMATH VEAK",
      gender: "M",
      dob: "09-Sep-06",
      yearLevel: "១",
      batch: "5",
      major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ",
      faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
      studyYear: "២០២៧-២០២៨",
      semester: "1",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "9",
      ID: "B260084",
      nameKhmer: "ម៉ុក មាលីស",
      name: "MOK MALIS",
      gender: "F",
      dob: "23-Jan-05",
      yearLevel: "៤",
      batch: "4",
      major: "សេដ្ឋកិច្ចឌីជីថល",
      faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង",
      studyYear: "២០២៨-២០២៩",
      semester: "2",
      shift: "យប់",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "10",
      ID: "B260099",
      nameKhmer: "ថៃ រ៉ាវី",
      name: "THAI RAVI",
      gender: "M",
      dob: "14-Apr-04",
      yearLevel: "២",
      batch: "6",
      major: "បង្រៀនភាសាអង់គ្លេស",
      faculty: "សិល្បៈ មនុស្សសាស្ត្រ និងភាសា",
      studyYear: "២០២៨-២០២៩",
      semester: "1",
      shift: "ព្រឹក",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "11",
      ID: "B261003",
      nameKhmer: "រិទ្ធ ចន្ទី",
      name: "RITH CHANTHY",
      gender: "M",
      dob: "03-Mar-06",
      yearLevel: "១",
      batch: "6",
      major: "វិទ្យាសាស្ត្សកុំព្យូទ័រ",
      faculty: "វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា",
      studyYear: "២០២៨-២០២៩",
      semester: "2",
      shift: "រសៀល",
      studentType: "scholarship",
      Note: "",
    },
    {
      key: "12",
      ID: "B261012",
      nameKhmer: "ចាន់ ដាលីន",
      name: "CHAN DALIN",
      gender: "F",
      dob: "27-Jul-06",
      yearLevel: "២",
      batch: "6",
      major: "គ្រប់គ្រងពាណិជ្ជកម្ម",
      faculty: "សេដ្ឋកិច្ច និងគ្រប់គ្រង",
      studyYear: "២០២៨-២០២៩",
      semester: "1",
      shift: "យប់",
      studentType: "scholarship",
      Note: "",
    },
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const finalTableData = filteredData !== null ? filteredData : masterData;
  const totalPages = Math.max(1, Math.ceil(finalTableData.length / PAGE_SIZE));

  useEffect(() => {
    document.body.classList.add("student-list-only-table-scroll");
    return () => {
      document.body.classList.remove("student-list-only-table-scroll");
    };
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearch = (values) => {
    const results = masterData
      .filter((item) => {
        return (
          (!values.yearLevel || item.yearLevel === values.yearLevel) &&
          (!values.batch || item.batch === values.batch) &&
          (!values.studyYear || item.studyYear === values.studyYear) &&
          (!values.semester || item.semester === values.semester) &&
          (!values.major || item.major === values.major) &&
          (!values.faculty || item.faculty === values.faculty) &&
          (!values.shift || item.shift === values.shift)
        );
      })
      .sort((a, b) => a.ID.localeCompare(b.ID));

    setFilteredData(results);
    setCurrentPage(1);

    setHeaderData((prev) => ({
      ...prev,
      major: values.major || prev.major,
      studyYear: values.studyYear || prev.studyYear,
    }));
  };

  const handleClear = () => {
    setFilteredData(null);
    setCurrentPage(1);
  };

  const updateStudentStatus = (key, nextStatus) => {
    const targetStudent = masterData.find((item) => item.key === key);
    const previousStatus = targetStudent?.status || "PENDING";

    const applyUpdate = (arr) => arr.map((item) => (item.key === key ? { ...item, status: nextStatus } : item));
    setMasterData((prev) => applyUpdate(prev));
    if (filteredData) {
      setFilteredData((prev) => applyUpdate(prev));
    }

    if (nextStatus === "PASS" && previousStatus !== "PASS") {
      const studentName = targetStudent?.nameKhmer || targetStudent?.name || targetStudent?.ID || "Student";
      pushNotification({
        title: "Sort Student",
        message: `${studentName} passed exam. Please continue in Sort Student.`,
        route: "/sortingpage",
      });
    }
  };

  const onPrint = () => {
    navigate("/scholarExamPrint", {
      state: {
        data: finalTableData,
        headerData,
      },
    });
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedData = useMemo(() => {
    return finalTableData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [finalTableData, startIndex]);

  const columns = [
    {
      title: "ល.រ",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => startIndex + index + 1,
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: 120, align: "center", render: (t) => textOrDash(t) },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 220, render: (t) => textOrDash(t) },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 210, render: (t) => textOrDash(t) },
    {
      title: "ភេទ",
      dataIndex: "gender",
      width: 90,
      align: "center",
      render: (gender) => (
        <Tag color={gender === "M" ? "geekblue" : "volcano"} style={{ fontSize: "12px", border: "none" }}>
          {gender === "M" ? "ប្រុស" : gender === "F" ? "ស្រី" : textOrDash(gender)}
        </Tag>
      ),
    },
    {
      title: "ស្ថានភាព",
      key: "status",
      width: 190,
      align: "center",
      render: (_, record) => {
        const currentStatus = record.status || "PENDING";
        const statusColor =
          currentStatus === "PASS" ? "success" : currentStatus === "FAIL" ? "error" : "processing";

        if (editingStatusKey === record.key) {
          return (
            <Space size={6}>
              <Select
                size="small"
                value={currentStatus}
                style={{ width: 110 }}
                onChange={(value) => {
                  updateStudentStatus(record.key, value);
                  setEditingStatusKey(null);
                }}
                options={[
                  { value: "PENDING", label: getStatusLabel("PENDING") },
                  { value: "FAIL", label: getStatusLabel("FAIL") },
                  { value: "PASS", label: getStatusLabel("PASS") },
                ]}
              />
              <Button
                type="text"
                size="small"
                className="action-edit-btn"
                icon={<EditFilled />}
                onClick={() => setEditingStatusKey(null)}
              />
            </Space>
          );
        }

        return (
          <Space size={6}>
            <Tag color={statusColor} style={{ marginInlineEnd: 0 }}>{getStatusLabel(currentStatus)}</Tag>
            <Button
              type="text"
              size="small"
              className="action-edit-btn"
              icon={<EditFilled />}
              onClick={() => setEditingStatusKey(record.key)}
            />
          </Space>
        );
      },
    },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 160, align: "center", render: (t) => textOrDash(t) },
    {
      title: "ប្រភេទនិស្សិត",
      dataIndex: "studentType",
      width: 170,
      render: (_, r) => {
        const type = r.studentType || r.StudentType;
        if (!type) return "-";
        const isScholar = String(type).toLowerCase().includes("scholar");
        return (
          <Tag color={isScholar ? "gold" : "cyan"} style={{ border: "none" }}>
            {isScholar ? t("studentType.scholarship") : t("studentType.pay")}
          </Tag>
        );
      }
    },
    { title: "Email", dataIndex: "email", width: 210, render: (_, r) => textOrDash(r.email || r.Email) },
    { title: "អត្តសញ្ញាណបណ្ណ", dataIndex: "idCard", width: 190, render: (_, r) => textOrDash(r.idCard || r.IdCard) },
    { title: "លេខទូរស័ព្ទ", dataIndex: "phone", width: 170, render: (_, r) => textOrDash(r.phone || r.Phone) },
    {
      title: "ចុះឈ្មោះថ្ងៃ",
      dataIndex: "registerDate",
      width: 160,
      align: "center",
      render: (_, r) => textOrDash(r.registerDate || r.registrationDate || r.RegDate || r.regDate || r.RegisterDate),
    },
    {
      title: "សកម្មភាព",
      key: "action",
      className: "action-column no-print",
      width: 90,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            className="action-edit-btn"
            icon={<EditFilled />}
            onClick={() => navigate("/createStudent", { state: { mode: "edit", student: record } })}
          />
          <Popconfirm
            title="លុប?"
            onConfirm={() => {
              const updated = masterData.filter((i) => i.key !== record.key);
              setMasterData(updated);
              if (filteredData) {
                setFilteredData(updated.filter((i) => filteredData.some((f) => f.key === i.key)));
              }
            }}
          >
            <Button
              type="text"
              size="small"
              className="action-delete-btn"
              icon={<DeleteFilled />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-page-wrapper student-list-page-wrapper student-list-auto-bg">
      <AdvancedSearchForm
        onSearch={handleSearch}
        onClear={handleClear}
        onPrint={onPrint}
        initialData={masterData}
      />

      <Card
        ref={tableTopRef}
        className="user-card-main student-table-card sort-card"
        bordered={false}
        style={{ width: "100%", maxWidth: "1400px" }}
      >
        <div className="student-table-overflow-x">
          <div className="student-table-overflow" style={{ overflowY: "auto", maxHeight: 390 }}>
            <Table
              columns={columns}
              dataSource={pagedData}
              loading={false}
              bordered={false}
              pagination={false}
              style={{ minWidth: 1860 }}
              rowKey={(record, index) =>
                `${record.ID || "row"}-${startIndex + index}`
              }
            />
          </div>
        </div>

        <div className="student-table-pagination no-print">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={finalTableData.length}
            showSizeChanger={false}
            onChange={(page) => {
              setCurrentPage(page);
              tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default ScholarExam;
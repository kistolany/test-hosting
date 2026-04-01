import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Flex, Space, Typography } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";

const { Text } = Typography;

const defaultHeaderData = {
  major: "...",
  studyYear: "...",
  examDate: "...",
  examTime: "...",
};

const ScholarExamPrintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rows = location.state?.data || [];
  const headerData = location.state?.headerData || defaultHeaderData;

  const toKhmerNum = (num) => {
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split("").map((digit) => khmerNumbers[digit] || digit).join("");
  };

  const femaleCount = rows.filter((item) => item.gender === "F").length;
  const maleCount = rows.filter((item) => item.gender === "M").length;

  const columns = [
    { title: "ល.រ", key: "index", width: 55, align: "center", render: (_, __, index) => index + 1 },
    { title: "អត្តលេខ", dataIndex: "ID", width: 90, align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 180 },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: 180, render: (t) => t?.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender", width: 80, align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: 140, align: "center" },
    {
      title: "ផ្សេងៗ",
      dataIndex: "Note",
      render: (text) => text || "-",
    },
  ];

  return (
    <div className="student-page-wrapper">
      <div className="paper-sheet">
        <div className="web-ui-controls no-print student-print-actions" style={{ marginBottom: 12 }}>
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
            <Space>
              <Button type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: "#070f7a" }} onClick={() => window.print()}>
                Print
              </Button>
            </Space>
          </Flex>
        </div>

        <div className="official-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="uni-logo-section" style={{ textAlign: "center" }}>
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80 }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: "bold", color: "#070f7a" }}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: "center" }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <img src="/src/assets/devider.png" alt="divider" style={{ width: "90px", marginTop: 5 }} />
          </div>
        </div>

        <div className="document-title-block" style={{ textAlign: "center", margin: "20px 0" }}>
          <div className="khmer-moul" style={{ fontSize: 14 }}>បញ្ជីរាយនាមនិស្សិត ប្រឡងអាហារូបកណ៍</div>
          <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ {headerData.major}</div>
          <div style={{ fontSize: 13, fontWeight: "bold", marginTop: 5 }}>កាលបរិច្ឆេទប្រឡង៖ {headerData.examDate}</div>
          <div style={{ fontSize: 13, fontWeight: "bold" }}>ម៉ោងប្រឡង៖ {headerData.examTime}</div>
        </div>

        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: "max-content", y: 420 }}
          bordered
          size="small"
          className="official-table student-screen-table"
          rowKey={(record, index) => `${record.ID || "row"}-${index}`}
        />

        <div className="totalStu" style={{ fontSize: 13, fontWeight: "bold" }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {toKhmerNum(rows.length)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ស្រី ចំនួន {toKhmerNum(femaleCount)} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ប្រុស ចំនួន {toKhmerNum(maleCount)} នាក់។</div>
        </div>

        {rows.length === 0 && (
          <Text type="secondary" className="no-print">No data available for print preview. Go back and filter list first.</Text>
        )}
      </div>
    </div>
  );
};

export default ScholarExamPrintPage;

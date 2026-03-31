import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Table, Button, Flex, Space, Typography } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";

const { Text } = Typography;

const defaultHeaderData = {
  year: "...",
  semester: "...",
  generation: "...",
  shift: "...",
  faculty: "...",
  major: "...",
  studyYear: "...",
};

const StudentPrintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useOutletContext();

  const rows = location.state?.data || [];
  const headerData = location.state?.headerData || defaultHeaderData;

  const femaleCount = rows.filter((item) => item.gender === "F").length;
  const maleCount = rows.filter((item) => item.gender === "M").length;

  const columns = [
    {
      title: "ល.រ",
      key: "index",
      width: "15px",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: "70px", align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: "150px" },
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: "150px", render: (t) => t?.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender", width: "30px", align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "100px", align: "center" },
    { title: "ផ្សេងៗ", dataIndex: "Note" },
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
            <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? "brightness(0) invert(1)" : "none" }} />
            <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
            <div style={{ fontSize: 9, fontWeight: "bold", color: "#070f7a" }}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
          </div>
          <div className="kingdom-section" style={{ textAlign: "center" }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
            <img src="/src/assets/devider.png" alt="divider" style={{ width: "90px", marginTop: 5 }} />
          </div>
        </div>

        <div className="document-title-block" style={{ textAlign: "center", marginTop: "50px" }}>
          <div className="khmer-moul" style={{ fontSize: 14 }}>បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី{headerData.semester} ជំនាន់ទី{headerData.generation} ({headerData.shift})</div>
          <div className="khmer-moul" style={{ fontSize: 14 }}>មហាវិទ្យាល័យ {headerData.faculty}</div>
          <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ {headerData.major}</div>
          <div className="khmer-moul" style={{ fontSize: 14 }}>ឆ្នាំសិក្សា {headerData.studyYear}</div>
        </div>

        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          bordered
          size="small"
          className="official-table student-table"
          rowKey={(record, index) => `${record.ID || "row"}-${index}`}
        />

        <div className="totalStu" style={{ fontSize: 13, fontWeight: "bold" }}>
          <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {rows.length.toLocaleString("km-KH")} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ស្រី ចំនួន {femaleCount.toLocaleString("km-KH")} នាក់។</div>
          <div style={{ marginLeft: 55 }}>ប្រុស ចំនួន {maleCount.toLocaleString("km-KH")} នាក់។</div>
        </div>

        <div className="signature-block" style={{ display: "flex", justifyContent: "flex-end", marginTop: 0 }}>
          <div className="signature-area" style={{ textAlign: "center" }}>
            <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
            <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
            <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
            <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
          </div>
        </div>

        {rows.length === 0 && (
          <Text type="secondary" className="no-print">No data passed from list page. Go back and click Print from List Student.</Text>
        )}
      </div>
    </div>
  );
};

export default StudentPrintPage;

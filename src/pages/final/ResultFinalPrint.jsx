import React from "react";
import { LeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Table, Button, Flex, Typography, ConfigProvider, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

const { Text } = Typography;
const PRIMARY_COLOR = '#070f7a';

const ResultFinalPrint = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure data from navigation state with fallbacks
  const { printData, params } = location.state || { 
    printData: [], 
    params: { subjectNames: [], semester: "", year: "", batch: "", faculty: "", major: "" } 
  };

  // Helper to convert numbers to Khmer script
  const toKhmerNum = (num) => {
    if (num === null || num === undefined || num === "") return "";
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  // Define Columns for the Grade Report
  const reportCols = [
    { 
      title: "ល.រ", 
      width: 50, 
      align: "center", 
      render: (_, __, i) => toKhmerNum(i + 1) 
    },
    { title: "អត្តលេខ", dataIndex: "ID", width: 90, align: "center" },
    { title: "គោត្តនាម និងនាម", dataIndex: "nameKhmer", width: 220 },
    { 
      title: "អក្សរឡាតាំង", 
      dataIndex: "name", 
      width: 200, 
      render: (v) => v?.toUpperCase() 
    },
    { 
      title: "ភេទ", 
      dataIndex: "gender", 
      width: 60, 
      align: "center", 
      render: (g) => (g === "M" || g === "ប្រុស") ? "ប្រុស" : "ស្រី" 
    },
    {
      title: "ពិន្ទុតាមមុខវិជ្ជា",
      children: [
        { title: params.subjectNames?.[0] || "N/A", dataIndex: "s1", width: 90, align: "center" },
        { title: params.subjectNames?.[1] || "N/A", dataIndex: "s2", width: 90, align: "center" },
        { title: params.subjectNames?.[2] || "N/A", dataIndex: "s3", width: 90, align: "center" },
        { title: params.subjectNames?.[3] || "N/A", dataIndex: "s4", width: 90, align: "center" },
        { title: params.subjectNames?.[4] || "N/A", dataIndex: "s5", width: 90, align: "center" },
        { title: "វត្តមាន", dataIndex: "attScore", width: 80, align: "center" },
      ]
    },
    { 
        title: "សរុប", 
        dataIndex: "finalTotal", 
        width: 90, 
        align: "center", 
        render: (val) => <Text strong>{val}</Text> 
    },
    { 
        title: "ចំណាត់ថ្នាក់", 
        dataIndex: "rank", 
        width: 90, 
        align: "center", 
        render: (val) => <Text strong>{toKhmerNum(val)}</Text> 
    },
  ];

  return (
    <ConfigProvider theme={{ token: { borderRadius: 0 } }}>      
        {/* THE PAPER SHEET */}
        <div className="paper-sheet">
          {/* UI CONTROLS - Inside paper-sheet but hidden during print */}
          <div className="no-print student-print-actions" style={{ marginBottom: 20 }}>
            <Flex justify="space-between" align="center">
              <Button
                icon={<LeftOutlined />} // Fixed: Corrected icon name
                onClick={() => navigate(-1)}
              >
                {t ? t("actions.back") : "Back"}
              </Button>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PrinterOutlined />} 
                  style={{ backgroundColor: PRIMARY_COLOR }} 
                  onClick={() => window.print()}
                >
                  {t ? t("actions.print") : "Print"}
                </Button>
              </Space>
            </Flex>
          </div>

          {/* Header Logos & Kingdom Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'center',justifyItems:'center' }}>
              <img src="/asset/image/logo.png" alt="logo" style={{ width: 85 }} />
              <div className="khmer-moul" style={{ fontSize: 12, marginTop: 5 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
              <div style={{ fontSize: 9, fontWeight: 'bold', color: PRIMARY_COLOR }}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
            </div>
            <div style={{ textAlign: 'center',justifyItems: 'center' }}>
              <div className="khmer-moul" style={{ fontSize: 16 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div className="khmer-moul" style={{ fontSize: 16 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5 }} />
            </div>
          </div>

          {/* Official Document Titles */}
          <div style={{ textAlign: 'center', marginTop: 30, marginBottom: 25 }}>
            <div className="khmer-moul" style={{ fontSize: '16px' }}>
              លទ្ធផលប្រឡងបញ្ចប់ឆមាសទី {toKhmerNum(params.semester)} ឆ្នាំទី {toKhmerNum(params.year)} ជំនាន់ទី {toKhmerNum(params.batch)}
            </div>
            <div className="khmer-moul" style={{ fontSize: '16px', marginTop: 8 }}>មហាវិទ្យាល័យ {params.faculty || "....."}</div>
            <div className="khmer-moul" style={{ fontSize: '16px', textDecoration: 'underline', marginTop: 8 }}>ជំនាញ៖ {params.major || "....."}</div>
          </div>

          {/* Data Table */}
          <Table 
            columns={reportCols} 
            dataSource={printData} 
            pagination={false} 
            bordered 
            size="small" 
            className="official-table"
          />

          {/* Report Footer */}
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text strong style={{ fontSize: '15px' }}>សម្គាល់៖ បញ្ជីវត្តមានបញ្ចប់ត្រឹមចំនួន {toKhmerNum(printData.length)} នាក់</Text>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px' }}>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
              <div className="khmer-moul" style={{ marginTop: 10, fontSize: '13px' }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
              <div className="khmer-moul" style={{ marginTop: 80, fontSize: '13px' }}>ប្រធាន</div>
            </div>
          </div>
        </div>

        <style>{`
          .khmer-moul { font-family: 'Khmer OS Muol Light', serif; }
            .paper-sheet { 
              width: 297mm;
              max-width: 1000px;
              min-height: 210mm; 
              padding: 10mm 15mm;
              background: white;
              margin: 40px auto;
              box-shadow: 0 0 10px rgba(0,0,0,0.2);
              border-radius: 4px;
            
          }

          @media print {
            @page { 
              width: 297mm;
              max-width: 1000px;
              min-height: 210mm; 
              margin: 10mm; 
            }
            .no-print { display: none !important; }
            body { background: #fff !important; margin: 0; padding: 0; }
           
            .official-table { width: 100% !important; }
          }
        `}</style>
    </ConfigProvider>
  );
};

export default ResultFinalPrint;
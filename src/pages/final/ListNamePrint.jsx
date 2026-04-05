import React, { useState } from "react";
import { 
  EditFilled, 
  DeleteFilled, 
  PrinterOutlined, 
  LeftOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import {
  Table, Button, Space, Popconfirm, Flex, DatePicker, TimePicker
} from "antd";
import { useLanguage } from "../../i18n/LanguageContext";

const { RangePicker } = DatePicker;

const ListNamePrint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state || {};
  const { t } = useLanguage();
  const { isDark } = useOutletContext();

  const toKhmerNum = (num) => {
    if (num === null || num === undefined) return "";
    const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return num.toString().split('').map(digit => khmerNumbers[digit] || digit).join('');
  };

  // State is initialized from the search results passed via navigate
  const [headerData, setHeaderData] = useState(locationState.headerData || {
    faculty: ".....",
    major: ".....",
    year: ".....",
    semester: ".....",
    generation: ".....",
    shift: ".....",
    startDate: ".....", 
    endDate: ".....",
    startTime: ".....",
    endTime: "....."
  });

  const initialMasterData = locationState.data || [];
  const [masterData, setMasterData] = useState(initialMasterData);
  const finalTableData = masterData;

  const femaleCount = locationState.femaleCount || "០០";
  const totalCount = locationState.totalCount || "០០";

  const handleDateRange = (dates, dateStrings) => {
    if (dates) {
      setHeaderData({ ...headerData, startDate: toKhmerNum(dateStrings[0]), endDate: toKhmerNum(dateStrings[1])});
    }
  };

  const handleTimeRange = (times, timeStrings) => {
    if (times) {
      setHeaderData({ ...headerData, startTime: toKhmerNum(timeStrings[0]), endTime: toKhmerNum(timeStrings[1]) });
    }
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
    { title: "អក្សរឡាតាំង", dataIndex: "name", width: "150px", render: (t) => t?.toUpperCase() },
    { title: "ភេទ", dataIndex: "gender", width: "30px", align: "center" },
    { title: "ថ្ងៃខែឆ្នាំកំណើត", dataIndex: "dob", width: "130px", align: "center" },
    { 
      title: "ផ្សេងៗ", 
      dataIndex: "Note",
      render: (text, record) => (
        <input 
          style={{ width: '70px', border: 'none', background: 'transparent', textAlign: 'center', color:'red', fontWeight: 'bold' }} 
          value={text} 
          onChange={(e) => {
            const updated = masterData.map(item => item.key === record.key ? { ...item, Note: e.target.value } : item);
            setMasterData(updated);
          }}
        />
      )
    },
  ];

  return (
    <div>
      <Flex className="no-print att-search-inner-container" vertical gap="small" style={{ marginBottom: 5,marginTop:'10px',height:'150px', padding: '10px 10px', border: '1px solid #ddd', borderRadius: '8px',alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily:'Arial',fontSize:'30px',color:'#070f7a',marginBottom:'20px',fontWeight:'bold' }}> Please Select Date and Time</div>
        <Space>
          <span>ជ្រើសរើសថ្ងៃ:</span>
          <RangePicker format="DD/MM/YYYY" onChange={handleDateRange} />
          <span>ជ្រើសរើសម៉ោង:</span>
          <TimePicker.RangePicker format="HH:mm" onChange={handleTimeRange} />
        </Space>
      </Flex>
      
      <div className="student-page-wrapper">
        <div className="paper-sheet">
          <div className="web-ui-controls no-print student-print-actions" style={{ marginBottom: 12 }}>
            <Flex justify="space-between" style={{ width: "100%" }}>
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
              >
                {t ? t("actions.back") : "Back"}
              </Button>
              <Space>
                <Button type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: "#070f7a" }} onClick={() => window.print()}>
                  {t ? t("actions.print") : "Print"}
                </Button>
              </Space>
            </Flex>
          </div>

          <div className="official-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="uni-logo-section" style={{ textAlign: 'center' }}>
              <img src="/asset/image/logo.png" alt="logo" className="print-logo" style={{ width: 80, filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
              <div className="khmer-moul" style={{ fontSize: 11 }}>សាកលវិទ្យាល័យកម្ពុជា គ្រប់គ្រង និងបច្ចេកវិទ្យា</div>
              <div style={{ fontSize: 9, fontWeight: 'bold', color:'#070f7a'}}>CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY</div>
            </div>
            <div className="kingdom-section" style={{ textAlign: 'center' }}>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div className="khmer-moul" style={{ fontSize: 14 }}>ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <img src="/src/assets/devider.png" alt="divider" style={{ width: '90px', marginTop: 5 }} />
            </div>
          </div>

          <div className="document-title-block" style={{ textAlign: 'center', marginTop: '30px' }}>
            <div className="khmer-moul" style={{ fontSize: 14 }}>
              បញ្ជីរាយនាមនិស្សិត ឆ្នាំទី{headerData.year} ឆមាសទី{headerData.semester} ជំនាន់ទី{headerData.generation} សិក្សាវគ្គ{headerData.shift}
            </div>
            <div className="khmer-moul" style={{ fontSize: 14, marginTop: 5 }}>មហាវិទ្យាល័យ {headerData.faculty}</div>
            <div className="khmer-moul" style={{ fontSize: 14 }}>ជំនាញ៖ {headerData.major}</div>
            
            <div style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>
              កាលបរិច្ឆេទប្រឡង៖ ចាប់ពីថ្ងៃទី {headerData.startDate} ដល់ថ្ងៃទី {headerData.endDate}
            </div>
            <div style={{ fontSize: 14, fontWeight: 'bold' }}>
              ម៉ោងប្រឡង៖ ចាប់ពីម៉ោង {headerData.startTime} ដល់ម៉ោង {headerData.endTime}
            </div>
          </div>

          <Table 
            columns={columns}
            dataSource={finalTableData}
            pagination={false}
            bordered
            size="small"
            className="official-table"
            style={{ marginTop: 20 }}
          />

          <div style={{ marginTop: 20, fontSize: 15, fontWeight: 'bold' }}>
            <div>សម្គាល់៖ បញ្ជីនិស្សិតបញ្ចប់ត្រឹមចំនួន {totalCount} នាក់ ក្នុងនោះស្រីមានចំនួន {femaleCount} នាក់។</div>
          </div>

          <div className="signature-block" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <div className="signature-area" style={{ textAlign: 'center' }}>
              <div>ថ្ងៃ.................ខែ...........ឆ្នាំ................ស័ក ព.ស...........</div>
              <div>រាជធានីភ្នំពេញ ថ្ងៃទី...........ខែ...........ឆ្នាំ...........</div>
              <div className="khmer-moul" style={{ marginTop: 5 }}>ការិយាល័យសិក្សា និងកិច្ចការនិស្សិត</div>
              <div className="khmer-moul" style={{ marginTop: 60 }}>ប្រធាន</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListNamePrint;
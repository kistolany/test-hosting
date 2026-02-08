import React from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Card, Col, Row, Typography } from "antd";
import "../../component/Main.css"; // Ensure this path matches your folder structure exactly
import sourceData from "../../data/sourceData.json";

const { Title } = Typography;
defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = false;

export const DashboardPage = () => {
  return (
    <div className="layout-content">
    
      <Row gutter={[16]} className="mb-24" align="stretch">
        {[
          { title: "Student", val: "1,200", trend: "+30%", class: "bnb2" },
          { title: "Subject", val: "$45,000", trend: "+12%", class: "bnb2" },
          { title: "Faculty", val: "85%", trend: "-5%", class: "redtext" },
          { title: "Major", val: "342", trend: "Stable", class: "bnb2" },
          { title: "Active", val: "5,000", trend: "+5%", class: "bnb2" },
          { title: "Suspended", val: "120", trend: "Stable", class: "bnb2" },
        ].map((item, index) => (
          <Col
            key={index} xs={24} sm={12} md={8} lg={4} style={{ display: "flex" }}
          >
            <Card
              title={item.title}
              className="criclebox"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {item.val}
              </Title>
              <p
                className={item.class}
                style={{ marginTop: "8px", marginBottom: 0 }}
              >
                {item.trend}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ROW 2: CHART (BOTTOM) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} span={24}>
          <Card
            title="Revenue Source (Bar Chart)"
            className="chartbar"
          >
            <div style={{ height: "400px" }}>
              <Bar
                data={{
                  labels: sourceData.map((data) => data.label),
                  datasets: [
                    {
                      label: "Count",
                      data: sourceData.map((data) => data.value),
                      backgroundColor: [
                        "rgba(43, 63, 229, 0.8)",
                        "rgba(250, 192, 19, 0.8)",
                        "rgba(253, 135, 135, 0.8)",
                        "rgba(229, 43, 186, 0.8)",
                        "rgba(88, 250, 19, 0.8)",
                        "rgba(244, 15, 15, 0.8)",
                      ],
                      borderRadius: 5,
                    },
                  ],
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;

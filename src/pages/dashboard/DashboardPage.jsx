import React, { useEffect, useMemo, useState } from "react";
import { defaults } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  TeamOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { Alert, Card, Col, Empty, Row, Select, Spin, Typography } from "antd";
import { useOutletContext } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "../../component/Main.css";
import "../../component/Dashboard.css";

const { Title, Text } = Typography;

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = false;

const KPI_META = [
  {
    key: "activeStudents",
    icon: TeamOutlined,
    tone: "sky",
    valueType: "number",
    labelKey: "dashboard.kpi.activeStudents"
  },
  {
    key: "inactiveStudents",
    icon: ArrowDownOutlined,
    tone: "rose",
    valueType: "number",
    labelKey: "dashboard.kpi.inactiveStudents"
  },
  {
    key: "newStudents",
    icon: UsergroupAddOutlined,
    tone: "violet",
    valueType: "number",
    labelKey: "dashboard.kpi.newStudents"
  },
  {
    key: "returningStudents",
    icon: ArrowUpOutlined,
    tone: "peach",
    valueType: "number",
    labelKey: "dashboard.kpi.returningStudents"
  }
];

const CHART_COLORS = {
  primary: "#070f7a",
  primaryHover: "#1005a3",
  secondary: "#2563eb",
  secondaryHover: "#3b82f6",
  accent: "#2ec5b6",
  accentHover: "#3ed0c1",
  warm: "#ff8a4f",
  warmHover: "#ff9d72"
};

const DEPARTMENT_RING_COLORS = ["#2f68d8", "#52c41a", "#ff4d4f"];

const PERIOD_PRESETS = {
  week: {
    trendLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    newStudents: [170, 188, 205, 179, 214, 192, 224],
    returningStudents: [132, 141, 149, 138, 154, 146, 161],
    admissionLabels: ["07 am", "08 am", "09 am", "10 am", "11 am", "12 pm", "01 pm"],
    admissionValues: [36, 78, 91, 84, 102, 109, 97],
    genderValues: [59, 41],
    departments: [
      { key: "computerScience", students: 228, trend: 3.8 },
      { key: "businessManagement", students: 143, trend: 1.9 },
      { key: "informationSystems", students: 92, trend: -1.2 }
    ],
    sparklineHeights: [24, 28, 34, 27, 37, 31, 40],
    kpi: {
      activeStudents: { value: 3042, delta: 1.6 },
      inactiveStudents: { value: 214, delta: -2.3 },
      newStudents: { value: 224, delta: 4.2 },
      returningStudents: { value: 161, delta: 2.0 }
    },
    highlightValue: 810
  },
  month: {
    trendLabels: [
      "Oct 2019",
      "Nov 2019",
      "Dec 2019",
      "Jan 2020",
      "Feb 2020",
      "Mar 2020",
      "Apr 2020",
      "May 2020",
      "Jun 2020",
      "Jul 2020",
      "Aug 2020"
    ],
    newStudents: [1200, 1380, 1490, 1220, 1290, 1450, 1510, 1420, 1360, 1480, 1540],
    returningStudents: [880, 980, 1170, 1020, 980, 1110, 1090, 1150, 1070, 1120, 1180],
    admissionLabels: [
      "07 am",
      "08 am",
      "09 am",
      "10 am",
      "11 am",
      "12 pm",
      "01 pm",
      "02 pm",
      "03 pm",
      "04 pm",
      "05 pm"
    ],
    admissionValues: [56, 122, 86, 135, 103, 141, 118, 126, 112, 138, 129],
    genderValues: [62, 48],
    departments: [
      { key: "computerScience", students: 247, trend: 4.3 },
      { key: "businessManagement", students: 164, trend: 2.2 },
      { key: "informationSystems", students: 86, trend: -0.9 }
    ],
    sparklineHeights: [28, 34, 40, 30, 33, 38, 42, 37, 35, 39, 44],
    kpi: {
      activeStudents: { value: 3256, delta: 3.9 },
      inactiveStudents: { value: 186, delta: -1.2 },
      newStudents: { value: 1540, delta: 4.3 },
      returningStudents: { value: 1180, delta: 2.7 }
    },
    highlightValue: 3240
  },
  semester: {
    trendLabels: ["M1", "M2", "M3", "M4", "M5", "M6"],
    newStudents: [2480, 2620, 2790, 2880, 3010, 3150],
    returningStudents: [1980, 2040, 2130, 2210, 2290, 2360],
    admissionLabels: ["07 am", "08 am", "09 am", "10 am", "11 am", "12 pm"],
    admissionValues: [80, 96, 118, 132, 147, 156],
    genderValues: [63, 47],
    departments: [
      { key: "computerScience", students: 451, trend: 5.1 },
      { key: "businessManagement", students: 328, trend: 2.8 },
      { key: "informationSystems", students: 173, trend: -1.3 }
    ],
    sparklineHeights: [30, 34, 39, 42, 45, 48],
    kpi: {
      activeStudents: { value: 3478, delta: 6.2 },
      inactiveStudents: { value: 268, delta: -1.8 },
      newStudents: { value: 3150, delta: 5.7 },
      returningStudents: { value: 2360, delta: 3.8 }
    },
    highlightValue: 952
  },
  year: {
    trendLabels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    newStudents: [5400, 5640, 5880, 6230, 6490, 6820],
    returningStudents: [4310, 4490, 4680, 4970, 5140, 5390],
    admissionLabels: ["Q1", "Q2", "Q3", "Q4"],
    admissionValues: [302, 336, 384, 410],
    genderValues: [61, 49],
    departments: [
      { key: "computerScience", students: 1212, trend: 6.2 },
      { key: "businessManagement", students: 818, trend: 3.4 },
      { key: "informationSystems", students: 427, trend: -1.1 }
    ],
    sparklineHeights: [32, 35, 38, 42, 45, 48],
    kpi: {
      activeStudents: { value: 3820, delta: 9.1 },
      inactiveStudents: { value: 342, delta: -2.1 },
      newStudents: { value: 6820, delta: 8.8 },
      returningStudents: { value: 5390, delta: 5.1 }
    },
    highlightValue: 2457
  }
};

function getPeriodPreset(period) {
  return PERIOD_PRESETS[period] || PERIOD_PRESETS.month;
}

function hasDashboardData(data) {
  return Boolean(
    data &&
      data.kpis?.length &&
      data.trend?.labels?.length &&
      data.trend?.datasets?.some((set) => set.data?.some((value) => Number(value) > 0))
  );
}

function formatDelta(delta) {
  return `${Math.abs(Number(delta || 0)).toFixed(1)}%`;
}

function makeCartesianOptions(axisColor, gridColor, showLegend = true) {
  return {
    interaction: {
      mode: "index",
      intersect: false
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart"
    },
    transitions: {
      active: {
        animation: {
          duration: 240
        }
      }
    },
    plugins: {
      legend: showLegend
        ? {
            position: "bottom",
            labels: {
              color: axisColor,
              usePointStyle: true,
              pointStyle: "circle",
              padding: 15
            }
          }
        : { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        ticks: { color: axisColor },
        grid: { display: false }
      },
      y: {
        ticks: { color: axisColor },
        grid: { color: gridColor }
      }
    }
  };
}

function makeDonutOptions(axisColor) {
  return {
    animation: {
      duration: 700,
      easing: "easeOutQuart"
    },
    transitions: {
      active: {
        animation: {
          duration: 240
        }
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: axisColor,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 15,
          generateLabels: (chart) => {
            const labels = chart.data.labels || [];
            const dataset = chart.data.datasets?.[0] || {};
            const values = Array.isArray(dataset.data) ? dataset.data : [];
            const colors = dataset.backgroundColor;
            const total = values.reduce((sum, value) => sum + Number(value || 0), 0);

            return labels.map((label, index) => {
              const value = Number(values[index] || 0);
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
              const fill = Array.isArray(colors) ? colors[index] : colors;

              return {
                text: `${label} ${percent}%`,
                fillStyle: fill,
                strokeStyle: fill,
                lineWidth: 0,
                hidden: false,
                index,
                pointStyle: "circle"
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = Number(context.raw || 0);
            const points = Array.isArray(context.dataset?.data) ? context.dataset.data : [];
            const total = points.reduce((sum, point) => sum + Number(point || 0), 0);
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

            return `${label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };
}

function toDashboardModel(period) {
  const preset = getPeriodPreset(period);
  const kpis = KPI_META.map((meta) => ({ ...meta, ...preset.kpi[meta.key] }));

  return {
    kpis,
    trend: {
      labels: preset.trendLabels,
      datasets: [
        {
          key: "newStudents",
          labelKey: "dashboard.trend.newStudents",
          data: preset.newStudents,
          borderColor: CHART_COLORS.primary,
          backgroundColor: CHART_COLORS.primary,
          hoverBackgroundColor: CHART_COLORS.primaryHover,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.72,
          borderRadius: 6,
          maxBarThickness: 14
        },
        {
          key: "returningStudents",
          labelKey: "dashboard.trend.returningStudents",
          data: preset.returningStudents,
          borderColor: CHART_COLORS.accent,
          backgroundColor: CHART_COLORS.accent,
          hoverBackgroundColor: CHART_COLORS.accentHover,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.72,
          borderRadius: 6,
          maxBarThickness: 14
        }
      ]
    },
    gender: {
      labels: ["dashboard.gender.female", "dashboard.gender.male"],
      values: preset.genderValues
    },
    admission: {
      labels: preset.admissionLabels,
      values: preset.admissionValues
    },
    departments: preset.departments,
    sparklineHeights: preset.sparklineHeights,
    highlightValue: preset.highlightValue
  };
}

export const DashboardPage = () => {
  const outlet = useOutletContext();
  const { t, lang } = useLanguage();
  const isDark = Boolean(outlet?.isDark);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState("");
  const [dashboardData, setDashboardData] = useState(() => toDashboardModel("month"));

  const axisColor = isDark ? "#94a3b8" : "#64748b";

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(lang === "km" ? "km-KH" : "en-US"),
    [lang]
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(lang === "km" ? "km-KH" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }),
    [lang]
  );

  useEffect(() => {
    setLoading(true);
    setErrorKey("");

    const timerId = setTimeout(() => {
      try {
        setDashboardData(toDashboardModel(period));
      } catch {
        setErrorKey("dashboard.messages.loadError");
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timerId);
  }, [period]);

  const periodOptions = useMemo(
    () => [
      { value: "week", label: t("dashboard.period.week") },
      { value: "month", label: t("dashboard.period.month") },
      { value: "semester", label: t("dashboard.period.semester") },
      { value: "year", label: t("dashboard.period.year") }
    ],
    [t, lang]
  );

  const trendData = useMemo(() => {
    if (!dashboardData) return null;

    return {
      labels: dashboardData.trend.labels,
      datasets: dashboardData.trend.datasets.map((set) => ({
        ...set,
        label: t(set.labelKey)
      }))
    };
  }, [dashboardData, t, lang]);

  const trendOptions = useMemo(() => {
    const classicGrid = isDark ? "rgba(148,163,184,0.22)" : "rgba(148,163,184,0.42)";
    const base = makeCartesianOptions(axisColor, classicGrid, true);

    return {
      ...base,
      layout: {
        padding: {
          top: 4,
          right: 4,
          left: 2,
          bottom: 0
        }
      },
      plugins: {
        ...base.plugins,
        legend: {
          ...base.plugins.legend,
          labels: {
            ...base.plugins.legend.labels,
            padding: 12
          }
        }
      },
      scales: {
        x: {
          ...base.scales.x,
          grid: { display: false }
        },
        y: {
          ...base.scales.y,
          beginAtZero: true,
          ticks: {
            ...base.scales.y.ticks,
            stepSize: 200
          },
          grid: {
            color: classicGrid
          }
        }
      }
    };
  }, [axisColor, isDark]);

  const genderData = useMemo(() => {
    if (!dashboardData) return null;

    return {
      labels: dashboardData.gender.labels.map((labelKey) => t(labelKey)),
      datasets: [
        {
          data: dashboardData.gender.values,
          backgroundColor: [CHART_COLORS.secondary, CHART_COLORS.warm],
          hoverOffset: 10,
          borderWidth: 0,
          cutout: "74%"
        }
      ]
    };
  }, [dashboardData, t, lang]);

  const genderOptions = useMemo(() => makeDonutOptions(axisColor), [axisColor]);

  const departmentRows = useMemo(() => {
    const rows = dashboardData?.departments || [];
    const total = rows.reduce((sum, item) => sum + Number(item.students || 0), 0);

    return rows.map((item, index) => {
      const percent = total > 0 ? (Number(item.students || 0) / total) * 100 : 0;
      return {
        key: item.key,
        label: t(`dashboard.departments.${item.key}`),
        students: item.students,
        percent,
        trend: Number(item.trend ?? (index < 2 ? 1 : -1)),
        color: DEPARTMENT_RING_COLORS[index % DEPARTMENT_RING_COLORS.length]
      };
    });
  }, [dashboardData, t, lang]);

  const showLoading = loading;
  const showError = Boolean(errorKey);
  const showEmpty = !showLoading && !showError && !hasDashboardData(dashboardData);

  const formatKpiValue = (item) => {
    if (item.valueType === "currency") {
      return currencyFormatter.format(item.value);
    }
    return numberFormatter.format(item.value);
  };

  if (showError) {
    return (
      <div className="dashboard-v2">
        <Alert
          type="error"
          showIcon
          message={t("dashboard.messages.errorTitle")}
          description={t(errorKey)}
        />
      </div>
    );
  }

  if (showLoading) {
    return (
      <div className="dashboard-v2">
        <div className="dash-state" role="status" aria-live="polite">
          <Spin size="large" />
          <Text>{t("dashboard.messages.loading")}</Text>
        </div>
      </div>
    );
  }

  if (showEmpty) {
    return (
      <div className="dashboard-v2">
        <div className="dash-state">
          <Empty description={t("dashboard.messages.empty")} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-v2">
      <Row gutter={[20, 20]}>
        {dashboardData.kpis.map((item) => {
          const Icon = item.icon;
          const isUp = Number(item.delta) >= 0;
          return (
            <Col key={item.key} xs={24} sm={12} lg={6}>
              <Card className={`dash-stat-card tone-${item.tone}`} bordered={false}>
                <div className="dash-stat-icon-wrap">
                  <Icon className="dash-stat-icon" />
                </div>
                <div className="dash-stat-copy">
                  <Title level={4}>{formatKpiValue(item)}</Title>
                  <Text>{t(item.labelKey)}</Text>
                  <span
                    className={`dash-kpi-trend ${isUp ? "up" : "down"}`}
                    aria-label={`${isUp ? t("dashboard.kpi.trendUp") : t("dashboard.kpi.trendDown")} ${formatDelta(item.delta)}`}
                  >
                    {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {formatDelta(item.delta)}
                  </span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row gutter={[20, 20]} className="dash-row-gap dash-row-stretch">
        <Col xs={24} xl={17}>
          <Card className="dash-panel dash-panel-stretch dash-trend-panel" bordered={false}>
            <div className="dash-panel-head">
              <Title level={5}>{t("dashboard.titles.trend")}</Title>
              <Select
                size="small"
                value={period}
                onChange={setPeriod}
                options={periodOptions}
                className="dash-head-select"
                aria-label={t("dashboard.a11y.periodSelect")}
              />
            </div>
            <div className="dash-chart-lg dash-trend-chart" aria-label={t("dashboard.a11y.trendChart")}>
              <Bar data={trendData} options={trendOptions} />
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={7} className="dash-right-stack-col">
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Card className="dash-panel" bordered={false}>
                <div className="dash-panel-head solo">
                  <Title level={5}>{t("dashboard.titles.gender")}</Title>
                </div>
                <div className="dash-chart-donut" aria-label={t("dashboard.a11y.genderChart")}>
                  <Doughnut data={genderData} options={genderOptions} />
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card className="dash-highlight" bordered={false}>
                <Title level={2}>{numberFormatter.format(dashboardData.highlightValue)}</Title>
                <Text>{t(`dashboard.highlight.${period}`)}</Text>
                <div
                  className="dash-sparkline"
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(1, dashboardData.sparklineHeights.length)}, minmax(0, 1fr))`
                  }}
                  aria-hidden="true"
                >
                  {dashboardData.sparklineHeights.map((height, index) => (
                    <span key={String(index)} style={{ height }} />
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="dash-row-gap">
        <Col xs={24} xl={24}>
          <Card className="dash-panel" bordered={false}>
            <div className="dash-panel-head solo">
              <Title level={5}>{t("dashboard.titles.byDepartment")}</Title>
            </div>
            <div className="dash-department-wrap">
              {departmentRows.map((row) => {
                const isUp = row.trend >= 0;
                return (
                  <div className="dash-department-col-card dash-department-metric-card" key={row.key}>
                    <div className="dash-department-label-inline">
                      <span className="dash-department-dot" style={{ backgroundColor: row.color }} />
                      <Text className="dash-department-name">{row.label}</Text>
                    </div>
                    <div className="dash-department-meta">
                      <Text className="dash-department-percent">{row.percent.toFixed(0)}%</Text>
                      <span className={`dash-department-trend ${isUp ? "up" : "down"}`}>
                        {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default DashboardPage;

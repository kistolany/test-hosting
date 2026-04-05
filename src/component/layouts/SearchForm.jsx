// src/components/SearchToolbar.jsx
import React from "react";
import { Form, Row, Col, Select, Button, Space } from "antd";
import { SearchOutlined, PrinterOutlined, ClearOutlined } from "@ant-design/icons";
import { useLanguage } from "../../i18n/LanguageContext";

const SearchToolbar = ({ form, onSearch, fields, data, onClear, token }) => {
  const { t } = useLanguage();

  return (
  <div className="sticky-search no-print att-search-inner-container">
    <Form
      form={form}
      onFinish={onSearch}
      layout="vertical"
      className="search-form"
      style={{
        padding: "24px",
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Row gutter={[16, 16]} align="bottom">
        {fields.map((field) => (
          <Col 
            key={field.name} 
            xs={12}          // Full width on Mobile
            sm={12}          // 2 columns on Tablet
            md={6}           // 3 columns on small Laptops
            lg={field.width ? undefined : 6} // 6 columns on Desktop (if no custom width)
            xl={field.width ? undefined : 4} 
            style={field.width ? { flex: `0 0 ${field.width}` } : {}}
          >
            <Form.Item 
              name={field.name} 
              label={t(`filters.${field.name}`) === `filters.${field.name}` ? field.label : t(`filters.${field.name}`)} 
              style={{ marginBottom: 0 }}
            >
              <Select
                showSearch
                allowClear
                placeholder={
                  t(`filters.select${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`) ===
                  `filters.select${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`
                    ? field.placeholder
                    : t(`filters.select${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`)
                }
                options={[...new Set(data.map(s => s[field.name]))]
                  .filter(Boolean)
                  .map(val => ({ value: val, label: val }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        ))}
        
        {/* Button Column */}
        <Col flex="auto">
          <Form.Item style={{ marginBottom: 0 }}>
            <Space 
              wrap 
              style={{ 
                width: '100%', 
                justifyContent: 'flex-start' 
              }}
            >
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />} 
                style={{ backgroundColor: '#070f7a',width: '80px' }}
              >
                {t("actions.search")}
              </Button>
              <Button 
                icon={<PrinterOutlined />} 
                onClick={() => window.print()} 
                style={{ backgroundColor: '#070f7a', color: "white", width: '70px' }}
              >
                {t("actions.print")}
              </Button>
              <Button 
                icon={<ClearOutlined />} 
                onClick={() => { 
                  form.resetFields(); 
                  onClear(); 
                }} 
              />
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
  );
};

export default SearchToolbar;
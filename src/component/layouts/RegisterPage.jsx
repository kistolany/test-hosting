import React from 'react';
import { Button, Form, Input, Card, Typography, Select, Row, Col } from 'antd'; // Added Row and Col
import { UserOutlined, LockOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Register Success:', values);
    // You can add your API call here (e.g., axios.post('/register', values))
    navigate("/"); 
  };

  return (
    <div className='login'>
      <Card className="login-card">
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src="asset/image/logo.png" 
            alt="CUMT Logo" 
            style={{ width: '110px', marginBottom: '10px' }}
          />
          <Title className='loginTitle1' level={4}>ចុះឈ្មោះគណនីថ្មី</Title>
          <Text className='loginTitle2' strong>CREATE NEW ACCOUNT</Text>
        </div>

        <Form
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Row gutter={[16, 0]}>
            {/* First Row: Full Name and Username */}
            <Col span={12}>
              <Form.Item 
                name="fullname" 
                label={<span style={{ color: '#444', fontWeight: 500 }}>Full Name</span>}
                rules={[{ required: true, message: 'Please input full name' }]}
              >
                <Input 
                  className='inputName' 
                  prefix={<IdcardOutlined style={{ color: '#888', marginRight: '10px' }} />} 
                  placeholder="FULL NAME" 
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item 
                name="username" 
                label={<span style={{ color: '#444', fontWeight: 500 }}>Username</span>}
                rules={[{ required: true, message: 'Please input username' }]}
              >
                <Input 
                  className='inputName' 
                  prefix={<UserOutlined style={{ color: '#888', marginRight: '10px' }} />} 
                  placeholder="USERNAME" 
                />
              </Form.Item>
            </Col>

            {/* Second Row: Role and Password */}
            <Col span={12}>
              <Form.Item 
                name="role" 
                label={<span style={{ color: '#444', fontWeight: 500 }}>Role</span>}
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select 
                  className='inputName' 
                  placeholder={
                    <span>
                      <TeamOutlined style={{ color: '#888', marginRight: '10px' }} /> 
                      SELECT ROLE
                    </span>
                  }
                >
                  <Option value="admin">Admin</Option>
                  <Option value="assistant">Assistant</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item 
                name="password" 
                label={<span style={{ color: '#444', fontWeight: 500 }}>Password</span>}
                rules={[{ required: true, message: 'Please input password' }]}
              >
                <Input.Password 
                  className='inputPass' 
                  prefix={<LockOutlined style={{ color: '#888', marginRight: '10px' }} />} 
                  placeholder="PASSWORD" 
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Footer Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent:'end',
            marginTop: '10px',
            padding: '0 10px' 
          }}>
            <Button 
              type="link" 
              onClick={() => navigate("/")} 
              style={{ color: '#666', padding: '10px' }}
            >
              Back to Login
            </Button>
            <Button className='btnSubmit' type="primary" htmlType="submit" style={{ padding: '10px' }}>
              REGISTER
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
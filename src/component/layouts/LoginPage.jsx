import React from 'react';
import { Button, Checkbox, Form, Input, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Login Success:', values);
    localStorage.setItem("token", "fake-token");
    navigate("/dashboard"); 
  };

  return (
    <div className='login'>
      <Card className="login-card">
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '25px',marginTop:'0px' }}>
          <img 
            src="asset/image/logo.png" 
            alt="CUMT Logo" 
            style={{ width: '130px', marginBottom: '10px' }}
          />
          <Title className='loginTitle1' level={4}>
            សាកលវិទ្យាល័យកម្ពុជាគ្រប់គ្រង និងបច្ចេកវិទ្យា
          </Title>
          <Text className='loginTitle2' strong>
            CAMBODIA UNIVERSITY OF MANAGEMENT AND TECHNOLOGY
          </Text>
        </div>

        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          {/* Username Field */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input username' }]}
          >
            <Input 
              className='inputName'
              prefix={<UserOutlined style={{ color: '#888', fontSize: '20px', marginRight: '10px' }} />} 
              placeholder="USERNAME" 
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input password' }]}
          >
            <Input.Password
              className='inputPass'
              prefix={<LockOutlined style={{ color: '#888', fontSize: '20px', marginRight: '10px' }} />}
              placeholder="PASSWORD"
            />
          </Form.Item>

          {/* Remember Me & Login Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '10px 10px 0 10px' 
          }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#444' }}>Remember me</Checkbox>
            </Form.Item>

            <Button className='btnSubmit' type="primary" htmlType="submit">
              LOGIN
            </Button>
          </div>

          {/* --- NEW SIGN UP SECTION --- */}
          {/* <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <Text style={{ color: '#666' }}>Don't have an account? </Text>
            <Button 
              type="link" 
              onClick={() => navigate("/register")} 
              style={{ padding: 0, fontWeight: 'bold', color: '#1a4299' }}
            >
              Sign Up Now
            </Button>
          </div> */}
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
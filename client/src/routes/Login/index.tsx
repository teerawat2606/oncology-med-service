import { Checkbox, Form, Input, Space, Dropdown } from "antd";
import React from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./index.css";
import { Logo } from "../../components/UIComponent/Logo";
import { NavyButton } from "../../components/UIComponent/Button/CustomButton";
import { useNavigate } from "react-router";
import { auth } from "../../api";
import { useAuth } from "../../providers/AuthProvider";

/*dropdown item list*/
const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Bangkok hospital pattaya
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        BNH (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        Phayathai (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

type FieldType = {
  hospital?: string;
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: any) => {
    try {
      const res = await auth.login(values.username, values.password);
      const result = await res.json();
      console.log("🚀 ~ handleLogin ~ result:", result);
      if (result.statusCode === 401) throw Error(result.message);

      // set user data
      localStorage.setItem("access_token", result.access_token);
      login();

      navigate("/homepage", { replace: true });

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div>
        <Logo className="logo"></Logo>
      </div>

      {/* <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Choose your hospital
            <DownOutlined />
          </Space>
        </a>
      </Dropdown> */}

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <NavyButton>Submit</NavyButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

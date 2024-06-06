import { Button, ConfigProvider } from "antd";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { ButtonProps } from "antd";

interface BPrimaryButtonProp extends ButtonProps {
  children: ReactNode;
}

export const NavyButton: React.FC<BPrimaryButtonProp> = ({ children }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          colorPrimary: "#0071BC",
          colorPrimaryHover: "#06264D",
        },
      },
    }}
  >
    <Button type="primary" htmlType="submit" shape="round">
      {children}
    </Button>
  </ConfigProvider>
);

export const RedButton: React.FC<BPrimaryButtonProp> = ({ children }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          colorPrimary: "#940000",
          colorPrimaryHover: "#E30102",
        },
      },
    }}
  >
    <Button type="primary" shape="round">
      {children}
    </Button>
  </ConfigProvider>
);

export const BlueButton: React.FC<BPrimaryButtonProp> = ({ children }) => (
  <ConfigProvider
    theme={{
      components: {
        Button: {
          colorPrimary: "#06264D",
          colorPrimaryHover: "#ffffff",
          colorPrimaryActive: "#333",
          colorPrimaryTextHover: "#333",
        },
      },
    }}
  >
    <Button type="primary" shape="round">
      {children}
    </Button>
  </ConfigProvider>
);

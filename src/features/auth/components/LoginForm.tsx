import { LeftOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Space } from "antd";
import { Form, useActionData, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div
      className="rounded-2xl w-[420px] relative page-enter"
      style={{
        background: "#ffffff",
        border: "1px solid #e8e6e1",
        boxShadow:
          "0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)",
      }}
    >
      <div className="flex flex-col h-full justify-center items-center px-16 py-12 relative">
        <button
          type="button"
          className="absolute flex items-center top-3 left-3 cursor-pointer align-middle transition-colors"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text-tertiary)")
          }
          onClick={() => navigate("/")}
        >
          <LeftOutlined />
          <span className="text-xs ml-1">返回</span>
        </button>
        <Divider>欢迎登录管理系统</Divider>
        <Form method="post" className="w-full">
          <Space direction="vertical" className="w-full mt-3">
            <Input
              name="username"
              placeholder="管理员账号"
              size="large"
            />
            <Input
              name="password"
              type="password"
              placeholder="管理员密码"
              size="large"
            />
          </Space>
          {actionData?.error && (
            <div
              className="text-sm mt-3"
              style={{ color: "var(--color-danger)" }}
            >
              {actionData.error}
            </div>
          )}
          <Button
            className="w-full mt-6 h-10!"
            type="primary"
            htmlType="submit"
            style={{ fontWeight: 600 }}
          >
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
}

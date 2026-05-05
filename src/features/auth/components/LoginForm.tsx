import { LeftOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Input, Space } from "antd";
import { useState } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const actionData = useActionData() as { error?: string } | undefined;
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative w-full max-w-[480px] mx-auto px-6">
      {/* 装饰性圆形 - 右上角 */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%)",
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* 装饰性圆形 - 左下角 */}
      <div
        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* 主卡片 */}
      <div
        className="rounded-3xl relative page-enter"
        style={{
          background: "#ffffff",
          border: "1px solid #e8e6e1",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div className="flex flex-col h-full justify-center items-center px-12 py-14 relative">
          {/* 返回按钮 */}
          <button
            type="button"
            className="absolute flex items-center top-4 left-4 cursor-pointer align-middle transition-colors"
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

          {/* 标题区域 */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "var(--color-text-primary)",
              }}
            >
              欢迎回来
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              登录到 Nine Forum 管理系统
            </p>
          </div>

          {/* 分割线 */}
          <Divider style={{ borderColor: "var(--color-border)", margin: "0 0 24px 0" }} />

          {/* 登录表单 */}
          <Form method="post" className="w-full">
            <Space direction="vertical" className="w-full" size="middle">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  管理员账号
                </label>
                <Input
                  name="username"
                  placeholder="请输入管理员账号"
                  size="large"
                  className="rounded-xl"
                  style={{
                    height: "48px",
                    fontSize: "15px",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  管理员密码
                </label>
                <Input.Password
                  name="password"
                  placeholder="请输入管理员密码"
                  size="large"
                  className="rounded-xl"
                  style={{
                    height: "48px",
                    fontSize: "15px",
                  }}
                />
              </div>

              {/* 记住我 */}
              <div className="flex items-center justify-between">
                <Checkbox name="remember" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="text-sm">记住我</span>
                </Checkbox>
              </div>
            </Space>

            {/* 错误提示 */}
            {actionData?.error && (
              <div
                className="mt-4 p-3 rounded-xl text-sm"
                style={{
                  background: "rgba(225, 29, 72, 0.06)",
                  color: "var(--color-danger)",
                  border: "1px solid rgba(225, 29, 72, 0.1)",
                }}
              >
                {actionData.error}
              </div>
            )}

            {/* 登录按钮 */}
            <Button
              className="w-full mt-6 rounded-xl font-semibold"
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                height: "48px",
                fontSize: "15px",
                background: "var(--color-accent)",
                borderColor: "var(--color-accent)",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-accent-hover)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(217, 119, 6, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-accent)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(217, 119, 6, 0.2)";
              }}
            >
              登录
            </Button>
          </Form>

          {/* 底部信息 */}
          <div
            className="mt-8 text-center text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <p>Nine Forum 管理系统</p>
            <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

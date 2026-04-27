import { LeftOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Space } from "antd";
import { Form, useActionData, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className="rounded-xl bg-white w-120 h-90">
      <div className="flex flex-col h-full justify-center items-center px-20 relative">
        <button
          type="button"
          className="absolute flex items-center top-3 left-3 cursor-pointer align-middle text-neutral-500 hover:text-black transition"
          onClick={() => navigate("/")}
        >
          <LeftOutlined className="text" />
          <span className="text-xs">返回</span>
        </button>
        <Divider>欢迎登录管理系统</Divider>
        <Form method="post" className="w-full">
          <Space direction="vertical" className="w-full mt-3">
            <Input name="username" placeholder="管理员账号" />
            <Input name="password" type="password" placeholder="管理员密码" />
          </Space>
          {actionData?.error && (
            <div className="text-red-500 text-sm mt-2">{actionData.error}</div>
          )}
          <Button className="w-full mt-5" type="primary" htmlType="submit">
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
}

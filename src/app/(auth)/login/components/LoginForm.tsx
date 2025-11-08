"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Space } from "antd";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  return (
    <div className="rounded-xl bg-white w-120 h-90">
      <div className="flex flex-col h-full justify-center items-center px-20 relative">
        <div className="absolute flex items-center top-3 left-3 cursor-pointer align-middle text-neutral-500 hover:text-black transition">
          <LeftOutlined className="text" />
          <span
            className="text-xs"
            onClick={() => {
              router.push("/");
            }}
          >
            返回
          </span>
        </div>
        <Divider>欢迎登录管理系统</Divider>
        <Space direction="vertical" className="w-full mt-3">
          <Input placeholder="管理员账号" />
          <Input type="password" placeholder="管理员密码" />
        </Space>

        <Button className="w-full mt-5" type="primary">
          登录
        </Button>
      </div>
    </div>
  );
}

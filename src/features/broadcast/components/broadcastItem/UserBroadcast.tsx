import { Button, DatePicker, Form, Image, Input, Select, Space } from "antd";
import useApp from "antd/es/app/useApp";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { sendUserBroadcast } from "@/features/broadcast/api";
import { getAccountById } from "@/features/user/api";
import { getImageUrl } from "@/shared/api/image";
import type { AccountVO } from "@/shared/types";

interface SelectOptions {
  label: string;
  value: number;
}

interface FormDataType {
  accountId: number;
  title: string;
  content: string;
}

export default function UserBroadcast() {
  const { options } = useLoaderData() as { options: SelectOptions[] };
  const [account, setAccount] = useState<AccountVO>();
  const { message } = useApp();

  const fetchAccountById = useCallback(async (accountId: number) => {
    const account = await getAccountById(accountId);
    setAccount(account);
  }, []);

  const onFormSubmit = async (data: FormDataType) => {
    await sendUserBroadcast({
      title: data.title,
      message: data.content,
      sendTo: data.accountId,
    });
    message.info("发送成功");
  };

  return (
    <Form<FormDataType> onFinish={onFormSubmit}>
      <Form.Item name="accountId" label="选择用户" required={true}>
        <Select options={options} onChange={(e) => fetchAccountById(e)} />
      </Form.Item>
      {account && (
        <Form.Item label="用户信息">
          <div className="flex h-17 items-center">
            <Image
              src={getImageUrl(account.avatarUrl)}
              className="size-17!"
              alt="avatar"
              preview={false}
            />
            <div className="flex flex-col justify-between ml-3">
              <div>ID: {account.accountId}</div>
              <div>昵称: {account.nickname}</div>
              <div>用户名: {account.username}</div>
            </div>
          </div>
        </Form.Item>
      )}
      <Form.Item name="title" label="标题" required={true}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="通知内容" required={true}>
        <TextArea />
      </Form.Item>
      <Form.Item label="定时发送">
        <DatePicker />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            发送
          </Button>
          <Button>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

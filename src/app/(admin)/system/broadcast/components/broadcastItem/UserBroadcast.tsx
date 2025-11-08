import service from "@/axios";
import { getImageUrl } from "@/axios/ImageService";
import { Button, DatePicker, Form, Input, Select, Space, Image } from "antd";
import useApp from "antd/es/app/useApp";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";

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
  const [options, setOptions] = useState<SelectOptions[]>();
  const [account, setAccount] = useState<Account>();
  const { message } = useApp();

  const fetchAccountData = useCallback(async () => {
    await service.get("/api/account/list_user_options", {}).then((res) => {
      if (res.data.code === 200) {
        setOptions(
          res.data.data.map((item: Account) => ({
            label: item.username,
            value: item.accountId,
          }))
        );
      }
    });
  }, []);

  const fetchAccountById = useCallback(async (accountId: number) => {
    await service
      .get("/api/account/get_account_by_id", {
        params: {
          account_id: accountId,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setAccount(res.data.data);
        }
      });
  }, []);

  const onFormSubmit = async (data: FormDataType) => {
    await service
      .post("/api/broadcast/user", {
        title: data.title,
        message: data.content,
        sendTo: data.accountId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          message.info("发送成功");
        }
      });
  };

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return (
    <>
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
    </>
  );
}

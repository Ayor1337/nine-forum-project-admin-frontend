"use client";

import service from "@/axios";
import { Button, Divider, Form, Input, Modal, Select } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";

interface defineProps {
  accountId: number;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function AccountModal({
  isOpen,
  accountId,
  onOk,
  onCancel,
}: defineProps) {
  const [data, setData] = useState<Account>();
  const [status, setStatus] = useState<number>();
  const [isOnce, setIsOnce] = useState<boolean>(false);

  const { message } = useApp();

  const fetchAccountData = useCallback(async () => {
    await service
      .get("/api/account/get_account_by_id", {
        params: {
          account_id: accountId,
        },
      })
      .then((res) => {
        if (res.data.code === 200) {
          setData(res.data.data);
        }
      });
  }, [accountId]);

  const handleUpload = async (data: Account) => {
    await service.put("/api/account/update", data).then((res) => {
      if (res.data.code === 200) {
        message.success("上传成功");
        handleFinish();
      }
    });
  };

  const handleFinish = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  return (
    data && (
      <Modal open={isOpen} footer={null}>
        <div className="px-5 py-3">
          <Divider>用户信息</Divider>
          <Form<Account> initialValues={data} onFinish={handleUpload}>
            <Form.Item name="accountId" label="用户ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="username" label="用户名">
              <Input disabled />
            </Form.Item>
            <Form.Item name="nickname" label="昵称">
              <Input disabled />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e);
                  setIsOnce(true);
                }}
              >
                <Select.Option value={1}>正常</Select.Option>
                <Select.Option value={2}>禁用</Select.Option>
              </Select>
            </Form.Item>
            {status === 2 && isOnce && (
              <Form.Item label="封禁理由">
                <Input />
              </Form.Item>
            )}
            <Divider>操作</Divider>
            <div className="grid grid-cols-3 gap-x-2">
              <Button type="primary">昵称违规</Button>
              <Button type="primary">头像违规</Button>
              <Button type="primary">背景违规</Button>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </div>
          </Form>
        </div>
      </Modal>
    )
  );
}

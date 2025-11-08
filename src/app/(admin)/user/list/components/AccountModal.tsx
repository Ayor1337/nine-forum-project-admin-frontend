"use client";

import service from "@/axios";
import { Button, Divider, Form, Input, Modal, Select } from "antd";
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
          setStatus(res.data.data.status);
        }
      });
  }, [accountId]);

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
      <Modal open={isOpen} onOk={handleFinish} onCancel={handleCancel}>
        <div className="px-5 py-10">
          <Divider>用户信息</Divider>
          <Form>
            <Form.Item label="用户名">
              <Input value={data.username} disabled />
            </Form.Item>
            <Form.Item label="昵称">
              <Input value={data.nickname} disabled />
            </Form.Item>
            <Form.Item label="状态">
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
          </Form>
          <Divider>操作</Divider>
          <div className="grid grid-cols-3 gap-x-2">
            <Button type="primary">昵称违规</Button>
            <Button type="primary">头像违规</Button>
            <Button type="primary">背景违规</Button>
          </div>
        </div>
      </Modal>
    )
  );
}

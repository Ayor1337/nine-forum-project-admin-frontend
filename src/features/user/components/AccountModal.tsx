import { Button, Divider, Form, Input, Modal, Select } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import {
  getAccountById,
  restoreAccount,
  submitAccountViolation,
  updateAccount,
} from "@/features/user/api";
import type { AccountVO, AccountDTO } from "@/shared/types";

interface AccountModalProps {
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
}: AccountModalProps) {
  const [data, setData] = useState<AccountVO>();
  const [status, setStatus] = useState<number>();
  const [isOnce, setIsOnce] = useState<boolean>(false);

  const { message } = useApp();

  const fetchAccountData = useCallback(async () => {
    const account = await getAccountById(accountId);
    setData(account);
    setStatus(account.status);
  }, [accountId]);

  const handleUpload = async (data: AccountDTO) => {
    await updateAccount(accountId, { accountId, status: data.status });
    message.success("上传成功");
    handleFinish();
  };

  const handleSubmitVioloation = async (type: string) => {
    await submitAccountViolation(accountId, type);
    message.success("提交成功");
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
      <Modal open={isOpen} onCancel={handleCancel} footer={null}>
        <div className="px-5 py-3">
          <Divider>用户信息</Divider>
          <Form<AccountVO> initialValues={data} onFinish={handleUpload}>
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
                <Select.Option value={2}>禁言</Select.Option>
                <Select.Option value={3}>封禁</Select.Option>
              </Select>
            </Form.Item>
            {data.status !== 1 && (
              <div className="mb-4">
                <Button
                  type="primary"
                  danger
                  onClick={async () => {
                    await restoreAccount(accountId);
                    message.success("已恢复为正常");
                    fetchAccountData();
                  }}
                >
                  恢复为正常
                </Button>
              </div>
            )}
            <Divider>操作 - 无须提交</Divider>
            <div className="grid grid-cols-3 gap-x-2">
              <Button
                type="primary"
                onClick={() => handleSubmitVioloation("nickname")}
              >
                昵称违规
              </Button>
              <Button
                type="primary"
                onClick={() => handleSubmitVioloation("avatar")}
              >
                头像违规
              </Button>
              <Button
                type="primary"
                onClick={() => handleSubmitVioloation("banner")}
              >
                背景违规
              </Button>
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

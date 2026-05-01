import { Divider, Form, Input, Modal } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { createTheme, getThemeById, updateTheme } from "@/features/theme/api";
import type { Theme } from "@/shared/types";

interface ThemeModalProps {
  themeId?: number;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function ThemeModal({
  themeId,
  isOpen,
  onOk,
  onCancel,
}: ThemeModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = useApp();
  const isEdit = themeId !== undefined;

  const fetchThemeData = useCallback(async () => {
    if (!themeId) return;
    const data = await getThemeById(themeId);
    form.setFieldsValue({ title: data.title });
  }, [themeId, form]);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      if (isEdit) {
        fetchThemeData();
      }
    }
  }, [isOpen, isEdit, fetchThemeData, form]);

  const handleSubmit = async (values: { title: string }) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateTheme(themeId, { title: values.title });
        message.success("更新成功");
      } else {
        await createTheme({ title: values.title });
        message.success("创建成功");
      }
      onOk();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title={isEdit ? "编辑主题" : "创建主题"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Divider />
      <Form<Theme> form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="主题名称"
          rules={[{ required: true, message: "请输入主题名称" }]}
        >
          <Input placeholder="请输入主题名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

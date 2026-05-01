import { Divider, Form, Input, Modal } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { createTopic, updateTopic } from "@/features/theme/api";

interface TopicModalProps {
  topicId?: number;
  themeId: number;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  initialValues?: {
    title: string;
    description: string;
    coverUrl: string;
  };
}

export default function TopicModal({
  topicId,
  themeId,
  isOpen,
  onOk,
  onCancel,
  initialValues,
}: TopicModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = useApp();
  const isEdit = topicId !== undefined;

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      if (isEdit && initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [isOpen, isEdit, initialValues, form]);

  const handleSubmit = async (values: {
    title: string;
    description?: string;
    coverUrl?: string;
  }) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateTopic(topicId, {
          title: values.title,
          description: values.description,
          coverUrl: values.coverUrl,
        });
        message.success("更新成功");
      } else {
        await createTopic({
          title: values.title,
          description: values.description,
          coverUrl: values.coverUrl,
          themeId,
        });
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
      title={isEdit ? "编辑话题" : "创建话题"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Divider />
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="话题标题"
          rules={[{ required: true, message: "请输入话题标题" }]}
        >
          <Input placeholder="请输入话题标题" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入话题描述" rows={3} />
        </Form.Item>
        <Form.Item name="coverUrl" label="封面 URL">
          <Input placeholder="请输入封面图片地址" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

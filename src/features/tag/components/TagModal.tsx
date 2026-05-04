import { Divider, Form, Input, Modal } from "antd";
import useApp from "antd/es/app/useApp";
import { useCallback, useEffect, useState } from "react";
import { createTag, getTagById, updateTag } from "@/features/tag/api";
import type { Tag } from "@/shared/types";

interface TagModalProps {
  tagId?: number;
  topicId: number;
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function TagModal({
  tagId,
  topicId,
  isOpen,
  onOk,
  onCancel,
}: TagModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = useApp();
  const isEdit = tagId !== undefined;

  const fetchTagData = useCallback(async () => {
    if (!tagId) return;
    const data = await getTagById(tagId);
    form.setFieldsValue({ tag: data.tag });
  }, [tagId, form]);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      if (isEdit) {
        fetchTagData();
      }
    }
  }, [isOpen, isEdit, fetchTagData, form]);

  const handleSubmit = async (values: { tag: string }) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateTag(tagId, { tag: values.tag });
        message.success("更新成功");
      } else {
        await createTag({ tagId: 0, tag: values.tag, topicId, createTime: new Date() } as Tag);
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
      title={isEdit ? "编辑标签" : "创建标签"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Divider />
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="tag"
          label="标签名称"
          rules={[{ required: true, message: "请输入标签名称" }]}
        >
          <Input placeholder="请输入标签名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

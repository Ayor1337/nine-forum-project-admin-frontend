import { PlusOutlined } from "@ant-design/icons";
import { Divider, Form, Image, Input, Modal, Upload, type UploadFile } from "antd";
import useApp from "antd/es/app/useApp";
import { useEffect, useState } from "react";
import { createTopic, updateTopic } from "@/features/theme/api";
import { getBase64WithType, getImageUrl } from "@/shared/api/image";

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

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      if (isEdit && initialValues) {
        form.setFieldsValue(initialValues);
        if (initialValues.coverUrl) {
          setFileList([
            {
              uid: "-1",
              name: "cover.png",
              status: "done",
              url: getImageUrl(initialValues.coverUrl),
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        setFileList([]);
      }
    }
  }, [isOpen, isEdit, initialValues, form]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64WithType(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleSubmit = async (values: {
    title: string;
    description?: string;
  }) => {
    setLoading(true);
    try {
      // 从 fileList 中取 base64 或已有 URL
      let coverUrl = "";
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          coverUrl = await getBase64WithType(file.originFileObj as File);
        } else if (file.url) {
          // 保留原有 URL（去掉 baseURL 前缀）
          coverUrl = initialValues?.coverUrl ?? "";
        }
      }

      if (isEdit) {
        await updateTopic(topicId, {
          title: values.title,
          description: values.description,
          coverUrl,
        });
        message.success("更新成功");
      } else {
        await createTopic({
          title: values.title,
          description: values.description,
          coverUrl,
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
        <Form.Item label="封面图片">
          <Upload
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            beforeUpload={() => false}
            onPreview={handlePreview}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            accept="image/*"
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div className="mt-1 text-xs">上传封面</div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => {
                  if (!visible) setPreviewImage("");
                },
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

import { Alert, Button, Card, Typography } from "antd";
import useApp from "antd/es/app/useApp";
import { useState } from "react";
import { client } from "@/shared/api/client";

export default function SystemSettingPage() {
  const { message } = useApp();
  const [loading, setLoading] = useState(false);

  const handleRepairMissingRecords = async () => {
    setLoading(true);
    try {
      const res = await client.post("/api/data_repairs/missing_related_records");
      if (res.data.code === 200) {
        message.success("修复完成");
      } else {
        message.error(res.data.message || "修复失败");
      }
    } catch {
      message.error("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card title="数据修复">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <Typography.Text strong>补全缺失的关联记录</Typography.Text>
              <Typography.Paragraph type="secondary" className="mb-0!">
                检查并补全帖子、回复等数据中缺失的关联统计记录
              </Typography.Paragraph>
            </div>
            <Button
              type="primary"
              loading={loading}
              onClick={handleRepairMissingRecords}
            >
              执行修复
            </Button>
          </div>
          <Alert
            type="info"
            showIcon
            message="执行后会扫描全量数据并补全缺失的关联记录，数据量较大时可能需要等待一段时间。"
          />
        </div>
      </Card>
    </div>
  );
}

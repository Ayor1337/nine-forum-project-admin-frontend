"use client";

import { Form, DatePicker, Space, Button } from "antd";
import TextArea from "antd/es/input/TextArea";

export default function SystemBroadcast() {
  return (
    <>
      <Form>
        <Form.Item label="通知内容" required={true}>
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

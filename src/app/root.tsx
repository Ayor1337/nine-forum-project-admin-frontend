import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import { Outlet } from "react-router-dom";
import "@/app/globals.css";

export default function Root() {
  dayjs.locale("zh-cn");
  return (
    <ConfigProvider locale={zhCN}>
      <App>
        <Outlet />
      </App>
    </ConfigProvider>
  );
}

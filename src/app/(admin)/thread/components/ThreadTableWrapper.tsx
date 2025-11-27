import { Button, Input } from "antd";
import ThreadTable from "./ThreadTable";

export default function ThreadTableWrapper() {
  return (
    <>
      <div className="mb-3 w-1/3 flex items-center ">
        <div className="text-nowrap mr-2">搜索:</div>
        <Input width={100} />
        <Button type="primary" className="ml-2">
          搜索
        </Button>
      </div>
      <ThreadTable />
    </>
  );
}

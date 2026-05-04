import { client } from "@/shared/api/client";
import type { ReportHandleDTO } from "@/shared/types";

export async function getReportList(params: {
  pageNum: number;
  pageSize: number;
  status?: string;
  targetType?: string;
}) {
  const res = await client.get("/api/reports", {
    params: {
      page_num: params.pageNum,
      page_size: params.pageSize,
      status: params.status,
      target_type: params.targetType,
    },
  });
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function getReportById(reportId: number) {
  const res = await client.get(`/api/reports/${reportId}`);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

export async function handleReport(reportId: number, data: ReportHandleDTO) {
  const res = await client.put(`/api/reports/${reportId}/status`, data);
  if (res.data.code === 200) return res.data.data;
  throw new Error(res.data.message);
}

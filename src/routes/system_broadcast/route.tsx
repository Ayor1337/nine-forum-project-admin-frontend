import { getUserOptions } from "@/features/broadcast/api";
import BroadcastWrapper from "@/features/broadcast/components/BroadcastWrapper";

export async function loader() {
  const options = await getUserOptions();
  return {
    options: options.map((item: { username: string; accountId: number }) => ({
      label: item.username,
      value: item.accountId,
    })),
  };
}

export default function BroadcastPage() {
  return <BroadcastWrapper />;
}

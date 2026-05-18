import type { ActionFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { login } from "@/features/auth/api";
import LoginForm from "@/features/auth/components/LoginForm";
import { storeLocalToken, storeSessionToken } from "@/shared/api/token";
import HyperspaceBackground from "@/shared/components/HyperspaceBackground";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const remember = formData.get("remember") === "on";

  try {
    const result = await login(username, password);
    if (result?.token) {
      if (remember) {
        storeLocalToken(result.token);
      } else {
        storeSessionToken(result.token);
      }
      return redirect("/dashboard");
    }
    return { error: "账号或密码错误" };
  } catch {
    return { error: "账号或密码错误" };
  }
}

export default function LoginPage() {
  return (
    <div
      className="flex h-screen w-screen justify-center items-center relative overflow-hidden"
      style={{ background: "#010102" }}
    >
      <HyperspaceBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.32)_0_18%,transparent_44%),linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.72))]" />

      <LoginForm />
    </div>
  );
}

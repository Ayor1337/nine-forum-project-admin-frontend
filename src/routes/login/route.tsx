import type { ActionFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { login } from "@/features/auth/api";
import LoginForm from "@/features/auth/components/LoginForm";
import { storeLocalToken } from "@/shared/api/token";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const result = await login(username, password);
    if (result?.token) {
      storeLocalToken(result.token);
      return redirect("/dashboard");
    }
    return { error: "登录失败" };
  } catch {
    return { error: "登录失败" };
  }
}

export default function LoginPage() {
  return (
    <div
      className="flex h-screen w-screen justify-center items-center relative overflow-hidden"
      style={{ background: "var(--color-bg-primary)" }}
    >
      {/* Subtle warm gradient accent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(217,119,6,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(79,70,229,0.04) 0%, transparent 50%)",
        }}
      />
      <LoginForm />
    </div>
  );
}

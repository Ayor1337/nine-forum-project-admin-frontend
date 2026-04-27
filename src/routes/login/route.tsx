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
    <div className="flex h-screen w-screen justify-center items-center bg-linear-to-b to-slate-200">
      <LoginForm />
    </div>
  );
}

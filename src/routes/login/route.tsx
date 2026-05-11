import type { ActionFunctionArgs } from "react-router-dom";
import { redirect } from "react-router-dom";
import { login } from "@/features/auth/api";
import LoginForm from "@/features/auth/components/LoginForm";
import { storeLocalToken, storeSessionToken } from "@/shared/api/token";

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
      {/* 深色调渐变背景 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(94, 106, 210, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(130, 143, 255, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(94, 106, 210, 0.02) 0%, transparent 60%)",
        }}
      />

      {/* 装饰性圆形 - 右侧 */}
      <div
        className="absolute hidden lg:block"
        style={{
          right: "-5%",
          top: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(94, 106, 210, 0.08) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite",
        }}
      />

      {/* 装饰性圆形 - 左下 */}
      <div
        className="absolute hidden lg:block"
        style={{
          left: "-8%",
          bottom: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(130, 143, 255, 0.06) 0%, transparent 70%)",
          animation: "float 12s ease-in-out infinite reverse",
        }}
      />

      {/* 装饰性圆形 - 左上 */}
      <div
        className="absolute hidden lg:block"
        style={{
          left: "10%",
          top: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(94, 106, 210, 0.05) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <LoginForm />
    </div>
  );
}

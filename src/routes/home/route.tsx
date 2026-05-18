import {
  AlertOutlined,
  ArrowRightOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import HyperspaceBackground from "@/shared/components/HyperspaceBackground";

const quickLinks = [
  {
    icon: <DashboardOutlined />,
    label: "仪表盘",
    path: "/dashboard",
  },
  {
    icon: <TeamOutlined />,
    label: "用户",
    path: "/user/list",
  },
  {
    icon: <FileTextOutlined />,
    label: "内容",
    path: "/content",
  },
  {
    icon: <AlertOutlined />,
    label: "审查",
    path: "/check",
  },
  {
    icon: <SafetyOutlined />,
    label: "权限",
    path: "/permission/list",
  },
  {
    icon: <SettingOutlined />,
    label: "系统",
    path: "/system/broadcast",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "#010102", color: "var(--color-text-primary)" }}
    >
      <style>
        {`
          @keyframes homeRise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .home-rise {
            animation: homeRise 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .home-link:hover .home-link-arrow {
            transform: translateX(3px);
            opacity: 1;
          }

          .home-link:hover {
            color: #f7f8f8;
            background: rgba(255, 255, 255, 0.055);
            border-color: rgba(245, 158, 11, 0.28);
          }

          @media (prefers-reduced-motion: reduce) {
            .home-rise {
              animation: none;
            }
          }
        `}
      </style>

      <HyperspaceBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.42)_0_20%,transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.68))]" />

      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
        <div className="home-rise relative z-10 mx-auto flex max-w-5xl flex-col items-center">
          <div
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] backdrop-blur-xl"
            style={{ color: "#f59e0b" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_18px_rgba(245,158,11,0.9)]" />
            Console
          </div>

          <h1
            className="mb-6 text-[clamp(4.5rem,13vw,10.5rem)] font-black leading-[0.78] tracking-[-0.09em]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Nine
            <br />
            Forum
          </h1>

          <p
            className="mb-9 max-w-2xl text-base leading-8 md:text-xl"
            style={{ color: "var(--color-text-secondary)" }}
          >
            面向社区运营团队的后台入口。聚合用户、内容、举报与权限，让管理者先看到方向，再进入操作。
          </p>

          <div className="mb-12 flex flex-col gap-3 sm:flex-row">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/dashboard")}
              style={{
                height: 48,
                paddingInline: 28,
                fontWeight: 700,
                boxShadow: "0 18px 50px rgba(94, 106, 210, 0.32)",
              }}
            >
              进入控制台
            </Button>
            <Button
              size="large"
              onClick={() => navigate("/check")}
              style={{
                height: 48,
                paddingInline: 24,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
              }}
            >
              查看举报队列
            </Button>
          </div>

          <nav className="home-rise z-10 flex max-w-3xl flex-wrap justify-center gap-2 [animation-delay:220ms]">
            {quickLinks.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className="home-link group flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-sm transition-all duration-300"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <span className="text-sm transition-colors duration-300 group-hover:text-[#f59e0b]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <ArrowRightOutlined className="home-link-arrow text-[10px] opacity-30 transition-all duration-300" />
              </button>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}

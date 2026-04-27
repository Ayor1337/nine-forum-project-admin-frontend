import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "@/app/admin-layout";
import Root from "@/app/root";
import BroadcastPage, { loader as broadcastLoader } from "@/routes/broadcast";
import CheckPage from "@/routes/check";
import DashboardPage from "@/routes/dashboard";
import HomePage from "@/routes/home";
import LoginPage, { action as loginAction } from "@/routes/login";
import ThemePage, { loader as themeLoader } from "@/routes/theme";
import ThreadPage, { loader as threadLoader } from "@/routes/thread";
import UserListPage, { loader as userListLoader } from "@/routes/user-list";
import UserRolePage from "@/routes/user-role";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage />, action: loginAction },
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          {
            path: "user/list",
            element: <UserListPage />,
            loader: userListLoader,
          },
          { path: "user/role", element: <UserRolePage /> },
          { path: "theme", element: <ThemePage />, loader: themeLoader },
          { path: "thread", element: <ThreadPage />, loader: threadLoader },
          { path: "check", element: <CheckPage /> },
          {
            path: "system/broadcast",
            element: <BroadcastPage />,
            loader: broadcastLoader,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

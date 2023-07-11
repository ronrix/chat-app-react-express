import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// use lazy
const Dashboard = lazy(() => import("./pages/dashboard"));

import { RequireAuth } from "react-auth-kit";

// router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/signin' />,
  },
  {
    path: "/signin",
    Component: lazy(() => import("./pages/login")),
  },
  {
    path: "/register",
    Component: lazy(() => import("./pages/register")),
  },
  {
    path: "/register/upload-avatar",
    Component: lazy(() => import("./pages/upload-avatar")),
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth loginPath='/signin'>
        <Dashboard />
      </RequireAuth>
    ),
    children: [
      {
        path: "inbox",
        Component: lazy(() => import("./pages/inbox")),
      },
      {
        path: "/dashboard/list-of-users",
        Component: lazy(() => import("./pages/list-of-users")),
      },
      {
        path: "/dashboard/create-group",
        Component: lazy(() => import("./pages/create-group-chat")),
      },
      {
        path: "/dashboard/profile-settings",
        Component: lazy(() => import("./pages/profile-settings")),
      },
      {
        path: "/dashboard/inbox/:id",
        Component: lazy(() => import("./pages/chat-composer")),
      },
    ],
  },
  {
    path: "/dashboard/send-message",
    Component: lazy(() => import("./pages/send-message")),
  },
]);

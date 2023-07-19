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
    Component: lazy(() => import("./pages/auth/login")),
  },
  {
    path: "/register",
    Component: lazy(() => import("./pages/auth/register")),
  },
  {
    path: "/register/upload-avatar",
    Component: lazy(() => import("./pages/auth/upload-avatar")),
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
        Component: lazy(() => import("./pages/dashboard/inbox")),
      },
      {
        path: "/dashboard/list-of-users",
        Component: lazy(() => import("./pages/dashboard/list-of-users")),
      },
      {
        path: "/dashboard/create-group",
        Component: lazy(() => import("./pages/dashboard/create-group-chat")),
      },
      {
        path: "/dashboard/profile-settings",
        Component: lazy(() => import("./pages/dashboard/profile")),
      },
      {
        path: "/dashboard/inbox/:id",
        Component: lazy(() => import("./pages/dashboard/chat-composer")),
      },
      {
        path: "/dashboard/notifications",
        Component: lazy(() => import("./pages/dashboard/notifications")),
      },
      {
        path: "/dashboard/groups",
        Component: lazy(() => import("./pages/dashboard/groups")),
      },
      {
        path: "/dashboard/groups/:id",
        Component: lazy(() => import("./pages/dashboard/chat-composer")),
      },
    ],
  },

  {
    path: "/dashboard/send-message",
    Component: lazy(() => import("./pages/dashboard/new-composer")),
  },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import ListOfUsers from "./pages/ListOfUsers";
import { RequireAuth } from "react-auth-kit";
import ChatComposer from "./pages/ChatComposer";

// router
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/signin' />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
        path: "",
        element: <ListOfUsers />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "/dashboard/inbox/:id",
        element: <ChatComposer />,
      },
    ],
  },
]);

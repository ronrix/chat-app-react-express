import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import { RequireAuth } from "react-auth-kit";
import ChatComposer from "./pages/ChatComposer";
import SendMessage from "./pages/SendMessage";
import ListOfUsers from "./pages/ListOfUsers";
import CreateGroupChat from "./pages/CreateGroupChat";

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
        path: "inbox",
        element: <Inbox />,
      },
      {
        path: "/dashboard/list-of-users",
        element: <ListOfUsers />,
      },
      {
        path: "/dashboard/create-group",
        element: <CreateGroupChat />,
      },
      {
        path: "/dashboard/inbox/:id",
        element: <ChatComposer />,
      },
    ],
  },
  {
    path: "/dashboard/send-message",
    element: <SendMessage />,
  },
]);

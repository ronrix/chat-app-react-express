import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cookies from "universal-cookie";
import Inbox from "./pages/Inbox";
import ListOfUsers from "./pages/ListOfUsers";

// get the user id in the cookie
const cookie = new Cookies();
const user = cookie.get("userId");

// router
export const router = createBrowserRouter([
  {
    path: "/",
    element: !user ? <Navigate to='/signin' /> : <Navigate to='/dashboard' />, // redirect user to dashboard if user id found
  },
  {
    path: "/signin",
    element: !user ? <Login /> : <Navigate to='/dashboard' />,
  },
  {
    path: "/register",
    element: !user ? <Register /> : <Navigate to='/dashboard' />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <ListOfUsers />,
      },
      {
        path: "inbox",
        element: <Inbox />,
      },
    ],
  },
]);

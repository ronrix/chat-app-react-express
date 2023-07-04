import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";

// socket
import { io } from "socket.io-client";
import { useIsAuthenticated } from "react-auth-kit";
// initialize the socket connection and export it to use in the whole project
export const socket = io("http://localhost:8000", {
  transports: ["websocket"], // specifying websocket to make it work
});

export default function Dashboard() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    // if user is authenticated then redirect them to '/inbox' to view the contact lists
    if (isAuthenticated()) {
      navigate("/dashboard/inbox");
    }
  }, []);

  return (
    <>
      <div className='flex w-screen'>
        <Sidebar />
        <div className='ml-0 md:ml-[22rem] w-full relative h-[calc(100vh)] p-5 flex flex-col'>
          <Header />
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

import { useEffect } from "react";
import Sidebar from "../../components/ui/sidebar";
import { ToastContainer } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/ui/header";

// socket
import { io } from "socket.io-client";
import { useAuthUser, useIsAuthenticated, useSignOut } from "react-auth-kit";
// initialize the socket connection and export it to use in the whole project
export const socket = io("http://localhost:8000", {
  transports: ["websocket"], // specifying websocket to make it work
});

// when socket connection error, sign out the user
function socketConnectionError(signOut: () => boolean) {
  socket.on("connect_error", (error) => {
    console.log("--------ERROR HERE------");
    console.log(error);
    signOut();
  });
}

export default function Dashboard() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const auth = useAuthUser();

  // connection error
  const signOut = useSignOut();
  socketConnectionError(signOut);

  useEffect(() => {
    // if user is authenticated then redirect them to '/inbox' to view the contact lists
    if (isAuthenticated()) {
      navigate("/dashboard/inbox");
    }
    // check if avatar is does not exists
    // then redirect to 'register/upload-avatar' to completing the setup
    if (!auth()?.avatar) {
      return navigate("/register/upload-avatar");
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

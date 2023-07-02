import { useEffect, useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import GetUser from "../utils/get-user";
import UserContext, { UserContextType } from "../context/user.context";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useSignOut } from "react-auth-kit";

// socket
import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

export default function Dashboard() {
  const userContext = useContext<UserContextType | null>(UserContext);
  const [loading, setLoading] = useState<boolean>(true);
  const signOut = useSignOut();
  const navigate = useNavigate();

  useEffect(() => {
    // IIF: redirect the user on respective page.
    // check for authentication before redirecting to "/dashboard"
    (async () => {
      try {
        const user = await GetUser();
        console.log(user);
        if (user) {
          userContext?.setUser({ id: user.id, username: user.username });
          setLoading(false);
        }
        setLoading(false);
        navigate("/dashboard/inbox");

        // signOut(); // sign out - token has expired
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className='flex w-screen'>
        <Sidebar loading={loading} />
        <div className='ml-0 md:ml-[22rem] w-full relative h-[calc(100vh)] p-5 flex flex-col'>
          <Header />
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

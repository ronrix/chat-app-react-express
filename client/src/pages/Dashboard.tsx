import { useEffect, useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import GetUser from "../utils/get-user";
import UserContext, { UserContextType } from "../context/user.context";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Spinner } from "@material-tailwind/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const userContext = useContext<UserContextType | null>(UserContext);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // IIF: redirect the user on respective page.
    // check for authentication before redirecting to "/dashboard"
    (async () => {
      try {
        const user = await GetUser();
        if (user) {
          userContext?.setUser(user);
          setLoading(false);
          return navigate("/dashboard");
        }
        setLoading(false);
        navigate("/signin");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <div className='flex w-screen'>
        <Sidebar />
        <div className='ml-0 md:ml-[22rem] w-full h-[calc(100vh)] p-5'>
          <Header />
          {loading ? <Spinner className='mx-auto mt-10' /> : <Outlet />}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

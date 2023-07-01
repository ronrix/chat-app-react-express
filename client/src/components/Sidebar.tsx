import { useContext } from "react";
import {
  Card,
  Typography,
  Popover,
  PopoverContent,
  Avatar,
} from "@material-tailwind/react";
import UserContext, { UserContextType } from "../context/user.context";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import NavList from "./NavList";
import Cookies from "universal-cookie";

export default function Sidebar() {
  const navigate = useNavigate();
  const userContext = useContext<UserContextType | null>(UserContext);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/signout");
      console.log(data);
      new Cookies().remove("userId");
      navigate("/signin");
    } catch (error) {
      console.log(error);
      navigate("/signin");
    }
  };

  return (
    <div className='hidden md:block'>
      <Popover placement='bottom-end'>
        <Card className='fixed top-4 left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5'>
          <div className='mb-2 p-4 flex items-center gap-3'>
            <Avatar
              variant='circular'
              alt={userContext?.user}
              src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
            />
            <Typography variant='h5' color='blue-gray' className='capitalize'>
              {userContext?.user}
            </Typography>
          </div>
          <NavList handleLogout={handleLogout} />
        </Card>
        <PopoverContent>Logging out....</PopoverContent>
      </Popover>
    </div>
  );
}

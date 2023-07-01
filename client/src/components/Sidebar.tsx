import { useContext } from "react";
import {
  Card,
  Typography,
  Popover,
  PopoverContent,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import UserContext, { UserContextType } from "../context/user.context";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import NavList from "./NavList";
import { useSignOut } from "react-auth-kit";

type Props = {
  loading: boolean;
};

export default function Sidebar(props: Props) {
  const { loading } = props;
  const navigate = useNavigate();
  const userContext = useContext<UserContextType | null>(UserContext);
  const signOut = useSignOut();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/signout");
      console.log(data);

      signOut();
      navigate("/signin");
    } catch (error) {
      console.log(error);

      signOut();
      navigate("/signin");
    }
  };

  return (
    <div className='hidden md:block'>
      <Popover placement='bottom-end'>
        <Card className='fixed top-4 left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5'>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : (
            <div className='mb-2 p-4 flex items-center gap-3'>
              <Avatar
                variant='circular'
                alt={userContext?.user.username}
                src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
              />
              <Typography variant='h5' color='blue-gray' className='capitalize'>
                {userContext?.user.username}
              </Typography>
            </div>
          )}
          <NavList handleLogout={handleLogout} />
        </Card>
        <PopoverContent>Logging out....</PopoverContent>
      </Popover>
    </div>
  );
}

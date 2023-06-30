import { Navbar, Typography, Button } from "@material-tailwind/react";
import axios from "../utils/axios";
import { useContext } from "react";
import UserContext from "../context/user.context";

export default function Header() {
  const user = useContext(UserContext);
  const handleLogout = async () => {
    try {
      const { data } = await axios.get("/signout");
      console.log(data.msg);
    } catch (error) {
      console.log(error);
    }
    window.location.reload(); // reloading the page to invoke the Protected component
  };

  return (
    <Navbar className='mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4'>
      <div className='container mx-auto flex items-center justify-between text-blue-gray-900'>
        <Typography
          as='a'
          href='#'
          className='mr-4 cursor-pointer py-1.5 font-medium capitalize'
        >
          {user}
        </Typography>
        <Button
          variant='gradient'
          size='sm'
          className='hidden lg:inline-block'
          onClick={handleLogout}
        >
          <span>Logout</span>
        </Button>
      </div>
    </Navbar>
  );
}

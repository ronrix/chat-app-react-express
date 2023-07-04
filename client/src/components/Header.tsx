import { useState, createElement } from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { InboxIcon, UserGroupIcon } from "@heroicons/react/24/solid";

// profile menu component
const profileMenuItems = [
  {
    label: "List of users",
    path: "/dashboard/list-of-users",
    icon: UserGroupIcon,
  },
  {
    label: "Inbox",
    path: "/dashboard/inbox",
    icon: InboxIcon,
  },
  {
    label: "Sign Out",
    path: "",
    icon: PowerIcon,
  },
];

function ProfileMenu({ handleLogout }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navigate = useNavigate();

  const handleNavItem = (type: string, path: string) => {
    if (type === "Sign Out") {
      handleLogout();
      closeMenu();
      return;
    }
    navigate(path); // navigate to pages
  };

  return (
    <div className='block md:hidden'>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement='bottom-end'>
        <MenuHandler>
          <Button
            variant='text'
            color='blue-gray'
            className='flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto'
          >
            <Avatar
              variant='circular'
              size='sm'
              alt='candice wu'
              className='border border-blue-500 p-0.5'
              src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className='p-1'>
          {profileMenuItems.map(({ label, path, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => handleNavItem(label, path)}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as='span'
                  variant='small'
                  className='font-normal'
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}

export default function Header() {
  const auth = useAuthUser();
  const navigate = useNavigate();
  const signOut = useSignOut();

  // function to handle logout
  // calls for '/signou' api to update the fields of the user
  const handleLogout = async () => {
    try {
      await axios.get("/signout");
      signOut(); // clear auth cookies
      navigate("/signin"); // redirect to '/signin'
    } catch (error) {
      console.log(error);
      signOut(); // clear auth cookies
      navigate("/signin"); // redirect to '/signin'
    }
  };

  return (
    <Navbar className='mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6 md:hidden'>
      <div className='relative mx-auto flex items-center text-blue-gray-900'>
        <Typography
          as='a'
          href='#'
          className='mr-4 ml-2 cursor-pointer py-1.5 font-medium capitalize block md:hidden'
        >
          {auth()?.username}
        </Typography>

        <IconButton
          size='sm'
          color='blue-gray'
          variant='text'
          className='ml-auto mr-2 invisible'
        >
          <Bars2Icon className='h-6 w-6' />
        </IconButton>
        <ProfileMenu handleLogout={handleLogout} />
      </div>
    </Navbar>
  );
}

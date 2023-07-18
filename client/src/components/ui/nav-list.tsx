import {
  InboxIcon,
  PowerIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import {
  List,
  ListItem,
  ListItemPrefix,
  PopoverHandler,
} from "@material-tailwind/react";
import React, { createElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  handleLogout: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const sidebarMenus = [
  {
    path: "/dashboard/list-of-users",
    label: "List of users",
    icon: ListBulletIcon,
  },
  {
    path: "/dashboard/notifications",
    label: "Notifications",
    icon: BellAlertIcon,
  },
  {
    path: "/dashboard/groups",
    label: "Group Chats",
    icon: UserGroupIcon,
  },
  {
    path: "/dashboard/inbox",
    label: "Inbox",
    icon: InboxIcon,
  },
  {
    path: "/dashboard/profile-settings",
    label: "Profile settings",
    icon: Cog6ToothIcon,
  },
];

export default function NavList(props: Props) {
  const location = useLocation();
  const { handleLogout } = props;
  const navigate = useNavigate(); // get the location to style the nav list

  return (
    <List>
      <hr className='my-2 border-blue-gray-50' />
      {sidebarMenus.map(({ path, label, icon }, i) => {
        return (
          <ListItem
            key={i}
            onClick={() => navigate(path)}
            className={`${
              location.pathname.split("/")[2] === path.split("/")[2]
                ? "bg-gray-100"
                : ""
            }`}
          >
            <ListItemPrefix>
              {createElement(icon, {
                className: `h-4 w-4`,
                strokeWidth: 2,
              })}
            </ListItemPrefix>
            {label}
          </ListItem>
        );
      })}
      <PopoverHandler onClick={handleLogout}>
        <ListItem>
          <ListItemPrefix>
            <PowerIcon className='h-5 w-5' />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </PopoverHandler>
    </List>
  );
}

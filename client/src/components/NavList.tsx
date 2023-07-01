import {
  InboxIcon,
  PowerIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import {
  Chip,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  PopoverHandler,
} from "@material-tailwind/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  handleLogout: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function NavList(props: Props) {
  const location = useLocation();
  const { handleLogout } = props;
  const navigate = useNavigate(); // get the location to style the nav list

  return (
    <List>
      <hr className='my-2 border-blue-gray-50' />
      <ListItem
        onClick={() => navigate("/dashboard")}
        className={`${!location.pathname.split("/")[2] ? "bg-gray-100" : ""}`}
      >
        <ListItemPrefix>
          <ChatBubbleLeftIcon className='h-5 w-5' />
        </ListItemPrefix>
        Chat Suggestions
      </ListItem>
      <ListItem
        onClick={() => navigate("/dashboard/inbox")}
        className={`${
          location.pathname.split("/")[2] === "inbox" ? "bg-gray-100" : ""
        }`}
      >
        <ListItemPrefix>
          <InboxIcon className='h-5 w-5' />
        </ListItemPrefix>
        Inbox
      </ListItem>
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

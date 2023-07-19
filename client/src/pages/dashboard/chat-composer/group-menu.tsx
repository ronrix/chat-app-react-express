import { useState, useContext } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import MenuDialog from "./modals/menu-dialog";
import {
  MessageContext,
  MessageContextType,
} from "../../../context/message.context";
import { socket } from "..";
import { useNavigate } from "react-router-dom";

const menus = [
  {
    id: 1,
    label: "Change Avatar",
    role: "avatar",
  },
  {
    id: 2,
    label: "See Members",
    role: "members",
  },
  {
    id: 3,
    label: "Invite People",
    role: "invite",
  },
  {
    id: 4,
    label: "Leave",
    color: "red",
    role: "leave",
  },
];

export default function GroupMenu() {
  const [open, setOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const navigate = useNavigate();

  const leaveGroupChat = async () => {
    try {
      // emit event to get the messages by passing the roomId
      socket.emit("leave_group", messageContext?.chatUser.roomId);

      // go out from the groupchat
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (role: string) => {
    if (role === "leave") {
      leaveGroupChat();

      // emit event to update the messages to all group chat members
      socket.emit("update_group_messages", messageContext?.chatUser.roomId);
      return;
    }
    setOpen(!open);
    setRole(role);
  };

  return (
    <Menu>
      <MenuHandler>
        <IconButton variant='text'>
          <EllipsisHorizontalIcon className='h-5 w-5 text-gray-800' />
        </IconButton>
      </MenuHandler>
      <MenuList>
        {menus.map((menu) => {
          return (
            <MenuItem
              key={menu.id}
              className={`text-${menu?.color || "gray"}-700`}
              onClick={() => handleOpen(menu.role)}
            >
              {menu.label}
            </MenuItem>
          );
        })}
      </MenuList>

      <MenuDialog handleOpen={handleOpen} open={open} role={role} />
    </Menu>
  );
}

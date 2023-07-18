import { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import MenuDialog from "./modals/menu-dialog";

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
  const handleOpen = (role: string) => {
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

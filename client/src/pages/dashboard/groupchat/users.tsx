import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { User } from "./types";

type Props = {
  loading: boolean;
  users: User[];
  selectedUsers: User[] | any;
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function UsersLists(props: Props) {
  const { users, loading, selectedUsers, setSelectedUsers } = props;

  const handleSelectUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const valueId = e.target.value;

    // get the index if the selected user was already in the state
    const isSelected = selectedUsers.findIndex((user: User) => {
      return user._id.toString() === valueId.toString();
    });
    const selected = users.find((user) => user._id === valueId); // get the selected user

    // check if user has selected then append it to the state
    if (isChecked && isSelected < 0) {
      setSelectedUsers([...selectedUsers, selected]);
      return;
    }

    // pop or remove the selected user from the state
    selectedUsers.splice(isSelected, 1); // removing the user from the state
    setSelectedUsers([...selectedUsers]);
  };

  // check if user is already selected to checked the checkbox
  const isSelected = (id: string): boolean => {
    if (selectedUsers.find((user: User) => user._id === id)) {
      return true;
    }
    return false;
  };

  return (
    <List className='overflow-auto max-h-[800px]'>
      {loading ? (
        <Spinner className='h-5 w-5 mx-auto' />
      ) : (
        users &&
        users.map((user: User) => {
          return (
            <ListItem key={user._id}>
              <label className='w-full flex items-center'>
                <Checkbox
                  name={user.username}
                  value={user._id}
                  checked={isSelected(user._id)}
                  onChange={handleSelectUser}
                />
                <ListItemPrefix>
                  <Avatar
                    src={import.meta.env.VITE_BACKEND_URL + "/" + user.avatar}
                    alt='user avatar'
                  />
                </ListItemPrefix>
                <Typography
                  variant='h6'
                  color='blue-gray'
                  className='capitalize'
                >
                  {user.username}
                </Typography>
              </label>
            </ListItem>
          );
        })
      )}
    </List>
  );
}

import { User } from "./types";
import { Avatar } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function SelectedUsers(props: Props) {
  const { selectedUsers, setSelectedUsers } = props;

  const removeSelectedUser = (id: string) => {
    const idx = selectedUsers.findIndex((user) => user._id === id); // get the idx of the selected user
    selectedUsers.splice(idx, 1); // remove the 'selected user'
    setSelectedUsers([...selectedUsers]); // update the state
  };

  return (
    <section className='py-5 flex items-center gap-2 flex-wrap'>
      {selectedUsers.map((user) => {
        return (
          <div key={user._id} className='relative'>
            <div
              className='bg-gray-600 text-white h-4 w-4 border flex items-center justify-center rounded-full absolute right-0 z-10 -top-2 hover:bg-red-200 cursor-pointer duration-75'
              onClick={() => removeSelectedUser(user._id)}
            >
              <XMarkIcon className='h-3 w-3 pointer-events-none' />
            </div>
            <Avatar
              src={import.meta.env.VITE_BACKEND_URL + "/" + user.avatar}
              alt={user.username}
            />
          </div>
        );
      })}
    </section>
  );
}

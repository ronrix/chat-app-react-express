import { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { User } from "./types";
import axios from "../../../utils/axios";
import { uid } from "uid";
import { socket } from "..";
import { useAuthUser } from "react-auth-kit";

type Props = {
  selectedUsers: User[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function CreateGroupChatForm(props: Props) {
  const { selectedUsers, setSelectedUsers } = props;
  const [groupChatName, setGroupChatName] = useState<string>("");
  const auth = useAuthUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data } = await axios.post("/create-group-chat", {
      members: selectedUsers,
      name: groupChatName.length ? groupChatName : "Untitled Group",
      roomId: uid(),
    });
    // send notification request (realtime)
    socket.emit("send_request_notification", {
      members: data.pendingInvites,
      name: data.groupName,
      hostname: auth()?.username,
    });

    // reset form state
    setSelectedUsers([]);
    setGroupChatName("");
  };

  return (
    <form className='flex items-center' onSubmit={handleSubmit}>
      <Input
        color='blue'
        label='Group name (optional)'
        className='flex-1'
        variant='standard'
        value={groupChatName}
        onChange={(e) => setGroupChatName(e.target.value)}
      />
      <Button variant='text' color='blue' type='submit'>
        Create
      </Button>
    </form>
  );
}

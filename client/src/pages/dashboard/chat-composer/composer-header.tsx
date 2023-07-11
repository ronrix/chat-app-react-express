import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageContext,
  MessageContextType,
} from "../../../context/message.context";
import { useAuthUser } from "react-auth-kit";
import { socket } from "..";
import { Avatar, Badge, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

export default function ComposerHeader() {
  const navigate = useNavigate();
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const auth = useAuthUser();

  // function when the back is clicked, it will
  // emit disconnection for the user to remove them in the room
  const disconnectSocket = () => {
    socket.emit("disconnect_from_the_room", {
      userId: auth()?.id,
      roomId: messageContext?.chatUser?.roomId,
    });
    navigate(-1); // redirect back
  };

  return (
    <header className='flex items-center gap-3'>
      <IconButton variant='text' onClick={disconnectSocket}>
        <ChevronLeftIcon className='h-5 w-5 text-gray-500' />
      </IconButton>
      <Avatar
        size='sm'
        alt='avatar'
        src={
          messageContext?.chatUser.avatar
            ? `${import.meta.env.VITE_BACKEND_URL}/${
                messageContext?.chatUser.avatar
              }`
            : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
        }
        className='ring-4 ring-green-500/30 border border-green-500 shadow-xl shadow-green-900/20'
      />
      <span className='capitalize font-bold flex items-center gap-4'>
        {messageContext?.chatUser.username}
        <Badge
          color={messageContext?.chatUser.isOnline ? "green" : "gray"}
        ></Badge>
      </span>
    </header>
  );
}

import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Badge,
  ListItemSuffix,
  IconButton,
} from "@material-tailwind/react";
import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MessageContext, MessageContextType } from "../context/message.context";
import { socket } from "../pages/Dashboard";
import { useAuthUser } from "react-auth-kit";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeleteVerification from "./DeleteVerification";
import { DeleteContext, DeleteContextType } from "../context/delete.context";

type Props = {
  username: string;
  currentMsg: string;
  id: string;
  isOnline: boolean;
  roomId: string;
  messageId: string;
};

export default function Chats(props: Props) {
  const { username, currentMsg, id, isOnline, roomId, messageId } = props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);
  const auth = useAuthUser();

  // function to emit joining room event with userId
  // it will store the userId and the socket id to the servers state to use for notifications
  const handleSettingActiveMsg = () => {
    socket.emit("join_room", { roomId, id }); // join the user to the room provided
    socket.emit("store_user_to_room", { userId: auth()?.id, roomId }); // emit event to store the user to the server state

    // set the new message context containing messageId, roomId, and, user information of the recipient
    messageContext?.setChatUser({ id, username, isOnline, roomId });
  };

  useEffect(() => {
    return () => {
      socket.off("join_room"); // remove the listener 'join_room' on unmount
    };
  });

  return (
    <ListItem>
      <Link
        to={`/dashboard/inbox/${roomId}}`}
        onClick={handleSettingActiveMsg}
        className='flex-1 flex m-0 p-0'
      >
        <ListItemPrefix>
          <Avatar
            variant='circular'
            alt='alexander'
            src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
          />
        </ListItemPrefix>
        <div>
          <Typography
            variant='h6'
            color='blue-gray'
            className='capitalize  flex items-center gap-4'
          >
            <span>{username}</span>
            <Badge color={isOnline ? "green" : "gray"}></Badge>
          </Typography>
          <Typography
            variant='small'
            color='gray'
            className='font-normal line-clamp-1'
          >
            <span dangerouslySetInnerHTML={{ __html: currentMsg }}></span>
          </Typography>
        </div>
      </Link>

      {/* add delete button */}
      <ListItemSuffix>
        <IconButton
          onClick={() => deleteContext?.setIsDelete(true)}
          variant='text'
          color='red'
        >
          <TrashIcon className='h-5 w-5' />
        </IconButton>
      </ListItemSuffix>

      {/* delete modal */}
      <DeleteVerification
        messageId={messageId} // this is the message id that's going to be deleted
      />
    </ListItem>
  );
}

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
import { socket } from "../pages/dashboard";
import { useAuthUser } from "react-auth-kit";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeleteVerification from "./delete-verification";
import { DeleteContext, DeleteContextType } from "../context/delete.context";

type Props = {
  username: string;
  currentMsg: string;
  id: string;
  isOnline: boolean;
  roomId: string;
  messageId: string;
  avatar: string;
};

export default function Chats(props: Props) {
  const { username, currentMsg, id, isOnline, roomId, messageId, avatar } =
    props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);
  const auth = useAuthUser();

  // if currentMsg has an image element in it
  // replace it with an icon
  const newCurrentMsg = currentMsg.replace(
    /<img.*?>/g,
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
    `
  );

  // function to emit joining room event with userId
  // it will store the userId and the socket id to the servers state to use for notifications
  const handleSettingActiveMsg = () => {
    socket.emit("join_room", { roomId, id }); // join the user to the room provided
    socket.emit("store_user_to_room", { userId: auth()?.id, roomId }); // emit event to store the user to the server state

    // set the new message context containing messageId, roomId, and, user information of the recipient
    messageContext?.setChatUser({
      id,
      username,
      isOnline,
      roomId,
      avatar,
      msgDocId: messageId,
    });
  };

  useEffect(() => {
    return () => {
      socket.off("join_room"); // remove the listener 'join_room' on unmount
    };
  }, []);

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
            src={
              avatar
                ? `${import.meta.env.VITE_BACKEND_URL}/${avatar}`
                : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            }
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
            <span
              className='chatbox-flex'
              dangerouslySetInnerHTML={{ __html: newCurrentMsg }}
            ></span>
          </Typography>
        </div>
      </Link>

      {/* add delete button */}
      <ListItemSuffix>
        <IconButton
          onClick={() =>
            deleteContext?.setDeleteData({ isDeleting: true, messageId })
          }
          variant='text'
          color='red'
        >
          <TrashIcon className='h-5 w-5' />
        </IconButton>
      </ListItemSuffix>

      {/* delete modal */}
      <DeleteVerification />
    </ListItem>
  );
}

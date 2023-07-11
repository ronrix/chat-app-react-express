import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Badge,
  ListItemSuffix,
  IconButton,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { socket } from "..";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeleteVerification from "../../../components/modals/delete-verification";
import useChat from "../../../hooks/inbox/useChat";

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
  const { roomId, avatar, username, isOnline, messageId } = props;
  const { handleSettingActiveMsg, deleteContext, newCurrentMsg } =
    useChat(props);

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

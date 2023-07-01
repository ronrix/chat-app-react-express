import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Badge,
} from "@material-tailwind/react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MessageContext, MessageContextType } from "../context/message.context";

type Props = {
  username: string;
  currentMsg: string;
  id: string;
  isOnline: boolean;
  roomId: boolean;
};

export default function Chats(props: Props) {
  const { username, currentMsg, id, isOnline, roomId } = props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  const handleSettingActiveMsg = () => {
    messageContext?.setChatUser({ id, username, isOnline, roomId });
  };
  return (
    <Link to={`/dashboard/inbox/${roomId}}`} onClick={handleSettingActiveMsg}>
      <ListItem>
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
            <Badge
              overlap='circular'
              color={isOnline ? "green" : "gray"}
              placement='top-start'
            ></Badge>
          </Typography>
          <Typography
            variant='small'
            color='gray'
            className='font-normal line-clamp-1'
          >
            {currentMsg}
          </Typography>
        </div>
      </ListItem>
    </Link>
  );
}

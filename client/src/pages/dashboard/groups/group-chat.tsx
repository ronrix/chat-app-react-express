import {
  Avatar,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

type Props = {
  roomId: string;
  avatar: string;
  groupName: string;
  currentMessage: string;
};

export default function GroupChat(props: Props) {
  const { roomId, avatar, groupName, currentMessage } = props;
  return (
    <ListItem>
      <Link to={`/dashboard/groups/${roomId}}`} className='flex-1 flex m-0 p-0'>
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
            <span>{groupName}</span>
          </Typography>
          <Typography
            variant='small'
            color='gray'
            className='font-normal line-clamp-1'
          >
            <span
              className='chatbox-flex'
              dangerouslySetInnerHTML={{ __html: currentMessage }}
            ></span>
          </Typography>
        </div>
      </Link>

      {/* leave group chat btn */}
    </ListItem>
  );
}

import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
} from "@material-tailwind/react";

type Props = {
  username: string;
  currentMsg: string;
};

export default function Chats(props: Props) {
  const { username, currentMsg } = props;
  return (
    <ListItem>
      <ListItemPrefix>
        <Avatar
          variant='circular'
          alt='alexander'
          src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
        />
      </ListItemPrefix>
      <div>
        <Typography variant='h6' color='blue-gray' className='capitalize'>
          {username}
        </Typography>
        <Typography variant='small' color='gray' className='font-normal'>
          {currentMsg}
        </Typography>
      </div>
    </ListItem>
  );
}

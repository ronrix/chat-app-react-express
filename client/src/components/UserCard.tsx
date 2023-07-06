import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

type Props = {
  username: string;
  email: string;
  isOnline: boolean;
  avatar: string;
};

export default function UserCard(props: Props) {
  const { username, email, isOnline, avatar } = props;
  const navigate = useNavigate();
  const auth = useAuthUser();

  return (
    <Card className='w-auto'>
      <CardHeader floated={false} className='h-52'>
        <img
          src={
            avatar
              ? `${import.meta.env.VITE_BACKEND_URL}/${avatar}`
              : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
          }
          alt={`avatar of ${username}`}
          className='object-cover h-full w-full'
        />
      </CardHeader>
      <CardBody className='text-center'>
        <Typography
          variant='h4'
          color='blue-gray'
          className='mb-2 capitalize flex items-center justify-center gap-3'
        >
          <Chip color={isOnline ? "green" : "gray"} value='' />
          {username}
        </Typography>
        <Typography color='blue' className='font-medium' textGradient>
          {email}
        </Typography>
      </CardBody>
      <CardFooter className='flex justify-center gap-7 pt-2'>
        <Button
          onClick={() => navigate(`/dashboard/send-message?email=${email}`)} // navigate to '/send-message' with email query to display it to email field
          className='flex items-center'
        >
          <PaperAirplaneIcon className='w-5 h-5' />
          Send message
        </Button>
      </CardFooter>
    </Card>
  );
}

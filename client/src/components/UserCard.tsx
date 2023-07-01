import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Badge,
} from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

type Props = {
  username: string;
  isOnline: boolean;
};

export default function UserCard(props: Props) {
  const { username, isOnline } = props;
  const badgeColor = isOnline ? "green" : "gray";
  return (
    <Card className='w-52'>
      <CardHeader floated={false} className='h-auto'>
        <img
          src='https://www.material-tailwind.com/img/team-3.jpg'
          alt='profile-picture'
        />
      </CardHeader>
      <CardBody className='text-center'>
        <Badge color={badgeColor} placement='top-end'>
          <Typography
            variant='h4'
            color='blue-gray'
            className='mb-2 capitalize'
          >
            {username}
          </Typography>
        </Badge>
      </CardBody>
      <CardFooter className='flex justify-center gap-7 pt-2'>
        <Button variant='filled' className='flex items-center'>
          <PaperAirplaneIcon className='h-5 w-5' />
          Send message
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Avatar, Button, ListItem, Typography } from "@material-tailwind/react";
import { Notification, Notifications } from "./types";
import useInvitationAction from "../../../hooks/notifications/useInvitationAction";
import moment from "moment";

type Props = {
  notif: Notification;
  setNotifications: React.Dispatch<
    React.SetStateAction<Notifications | undefined>
  >;
};

export default function NotificationCard(props: Props) {
  const { notif, setNotifications } = props;
  const { handleAcceptRequest, handleDeclineRequest } = useInvitationAction({
    notif,
    setNotifications,
  });

  return (
    <ListItem
      key={notif._id}
      className='flex flex-col justify-center items-start gap-2'
    >
      <span className='text-[11px] text-gray-400'>
        {moment(notif.createdAt).startOf("hour").fromNow()}
      </span>
      <div>
        <Typography
          variant='h6'
          color='blue-gray'
          className='flex items-center gap-2'
        >
          <Avatar
            src={import.meta.env.VITE_BACKEND_URL + "/" + notif.inviter.avatar}
            alt='inviter avatar'
            className='h-5 w-5'
          />
          <span className='text-sm text-gray-500 font-thin'>from</span>{" "}
          <span className='capitalize'>{notif.inviter.username}</span>
        </Typography>
        <Typography variant='small' color='gray' className='font-normal'>
          Invited you to join their Group Chat{" "}
          <span className='font-bold'>({notif.requestName})</span>
        </Typography>
      </div>

      {notif?.action && (
        <h5 className='font-bold text-lg'>You accepted this group</h5>
      )}
      {notif?.action === undefined && (
        <div className='flex items-center gap-3 w-full'>
          <Button
            onClick={handleDeclineRequest}
            variant='outlined'
            color='blue-gray'
            size='sm'
          >
            Decline
          </Button>
          <Button
            onClick={handleAcceptRequest}
            variant='filled'
            color='blue'
            size='sm'
          >
            Accept
          </Button>
        </div>
      )}
      {notif?.action === false && (
        <h5 className='font-bold text-lg'>You declined this group</h5>
      )}
    </ListItem>
  );
}

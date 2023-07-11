import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function CreateNewBubble() {
  const navigate = useNavigate();

  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
  };

  return (
    <div className='absolute bottom-0 right-0'>
      <SpeedDial>
        <SpeedDialHandler>
          <IconButton size='lg' className='rounded-full'>
            <PlusIcon className='h-5 w-5 transition-transform group-hover:rotate-45' />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent>
          <SpeedDialAction className='relative'>
            <UserGroupIcon
              className='h-5 w-5'
              onClick={() => navigate("/dashboard/create-group")}
            />
            <Typography {...labelProps}>Create Group</Typography>
          </SpeedDialAction>
          <SpeedDialAction className='relative'>
            <PaperAirplaneIcon
              className='h-5 w-5'
              onClick={() => navigate("/dashboard/send-message")}
            />
            <Typography {...labelProps}>Send Message</Typography>
          </SpeedDialAction>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}

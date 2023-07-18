import {
  Notification,
  Notifications,
} from "../../pages/dashboard/notifications/types";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

type Props = {
  notif: Notification;
  setNotifications: React.Dispatch<
    React.SetStateAction<Notifications | undefined>
  >;
};

export default function useInvitationAction(props: Props) {
  const { notif, setNotifications } = props;

  const handleAcceptRequest = async () => {
    try {
      const { data } = await axios.put("/invitation/accept", {
        docId: notif?.groupChatDocId,
        notifId: notif._id,
      });
      setNotifications(data);
      toast.success("Succesfully accepted the request");
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data.msg) {
        toast.error(error?.response?.data.msg);
      }
    }
  };

  const handleDeclineRequest = async () => {
    try {
      const { data } = await axios.put("/invitation/decline", {
        docId: notif?.groupChatDocId,
        notifId: notif._id,
      });
      setNotifications(data);
      toast.success("Succesfully declined the request");
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data.msg) {
        toast.error(error?.response?.data.msg);
      }
    }
  };

  return {
    handleAcceptRequest,
    handleDeclineRequest,
  };
}

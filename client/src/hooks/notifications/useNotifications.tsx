import { useState, useEffect } from "react";
import { Notifications } from "../../pages/dashboard/notifications/types";
import { socket } from "../../pages/dashboard";
import { useAuthUser } from "react-auth-kit";
import { toast } from "react-toastify";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notifications>();
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuthUser();

  useEffect(() => {
    // calling an event with the 'user id'
    socket.emit("notifications", auth()?.id);

    // listening the to server event getting the 'data' response
    socket.on("notifications", (data) => {
      setLoading(false);
      setNotifications(data);
    });

    // listening to the 'notification' to display toaster
    socket.on("notification", (notif) => {
      console.log(notif);
      // Handle the notification as desired
      toast.info(notif);

      // calling the 'notifications' event again to update the notifications state
      socket.emit("notifications", auth()?.id);
    });

    return () => {
      socket.off("notifications");
    };
  }, [loading, setNotifications]);

  return {
    notifications: notifications?.notifications,
    loading,
    setNotifications,
  };
}

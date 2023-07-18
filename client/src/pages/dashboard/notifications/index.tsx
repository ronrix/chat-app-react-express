import { Card, List, Spinner } from "@material-tailwind/react";
import useNotifications from "../../../hooks/notifications/useNotifications";
import { Notification } from "./types";
import NotificationCard from "./notification-card";
import ErrorMessage from "../../../components/errors/error-messages";

export default function Notifications() {
  const { notifications, loading, setNotifications } = useNotifications();

  return (
    <div className='p-5 h-full'>
      <h2 className='mb-5 font-bold text-2xl'>Notifications</h2>

      {/* card lists of notifications */}
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto h-5 w-5' />
          ) : notifications?.length ? (
            notifications?.map((notif: Notification) => {
              return (
                <NotificationCard
                  notif={notif}
                  setNotifications={setNotifications}
                />
              );
            })
          ) : (
            <ErrorMessage msg='No notifications!' />
          )}
        </List>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import ErrorMessage from "../components/ErrorMessage";
import { socket } from "../pages/Dashboard";
import { useAuthUser, useSignOut } from "react-auth-kit";
import CreateNewBubble from "../components/CreateNewBubble";
import { toast } from "react-toastify";

export default function Inbox() {
  const [contactLists, setContactLists] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = useAuthUser();
  const signOut = useSignOut();

  useEffect(() => {
    let isMounted = true;

    // when socket connection error, sign out the user
    socket.on("connect_error", (error) => {
      console.log(error);
      setLoading(false);
      signOut();
    });

    // emit socket event to get all contact lists of the authenticated user
    socket.emit("get_all_contacts", auth()?.id);

    // listen for the event listener to store the data received from the server and display it to the DOM
    socket.on("get_all_contacts", ({ data }) => {
      if (isMounted && data) {
        setContactLists(data);
      }
      setLoading(false);
    });

    // Listen for notification event
    socket.on("notification", (notif) => {
      console.log(notif);
      // Handle the notification as desired
      toast.info(notif);
    });

    // emit an event to store the userId to the server
    socket.emit("store_connected_user", auth()?.id);

    // Clean up the event listener when the component unmounts
    return () => {
      isMounted = false;
      socket.off("get_all_contacts");
      socket.off("notification");
      socket.off("store_connected_user");
    };
  }, []);

  return (
    <div className='p-5 h-full relative'>
      <h3 className='mb-5'>Messages</h3>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : contactLists?.contacts?.length ? (
            contactLists?.contacts?.map((msg: any) => {
              // get the proper sender username of the message
              const username =
                msg.message.to?._id === auth()?.id
                  ? msg.message?.from?.username
                  : msg.message?.to?.username;

              // get the proper sender online status of the message
              const isOnline =
                msg.message.to?._id === auth()?.id
                  ? msg.message?.from?.isOnline
                  : msg.message?.to?.isOnline;

              // get the proper sender id of the message
              const senderId =
                msg.message?.to?._id === auth()?.id
                  ? msg.message?.from?._id
                  : msg.message?.to?._id;

              return (
                <Chat
                  key={msg.message._id}
                  username={username} // display/pass the right username by checking if the userId is not equal to "to" or "from", then that's the thing we want to display
                  currentMsg={
                    msg.message.messages[msg.message.messages?.length - 1].msg
                  } // get the last message to display
                  id={senderId} // sender id
                  isOnline={isOnline}
                  roomId={msg.message.roomId}
                />
              );
            })
          ) : (
            <ErrorMessage msg='No messages found!' />
          )}
        </List>
      </Card>

      <CreateNewBubble />
    </div>
  );
}

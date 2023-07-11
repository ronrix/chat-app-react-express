import { useState, useEffect, useContext } from "react";
import Chat from "../components/Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import ErrorMessage from "../components/error-messages";
import { socket } from "./dashboard";
import { useAuthUser, useSignOut } from "react-auth-kit";
import CreateNewBubble from "../components/create-new-bubble";
import { toast } from "react-toastify";
import { DeleteContext, DeleteContextType } from "../context/delete.context";

export default function Inbox() {
  const [contactLists, setContactLists] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);
  const auth = useAuthUser();
  const signOut = useSignOut();

  useEffect(() => {
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
      if (data) {
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
      socket.off("get_all_contacts");
      socket.off("notification");
      socket.off("store_connected_user");
    };
  }, [socket, deleteContext?.deleteData]);

  return (
    <div className='p-5 h-full relative'>
      <h2 className='mb-5 font-bold text-2xl'>Messages</h2>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : contactLists?.contacts?.length ? (
            contactLists?.contacts?.map((msg: any) => {
              // get the proper recipient to display the user properties
              const recipient =
                msg.message.to?._id === auth()?.id
                  ? msg.message?.from
                  : msg.message?.to;

              return (
                <Chat
                  key={msg.message._id}
                  username={recipient?.username} // display/pass the right username by checking if the userId is not equal to "to" or "from", then that's the thing we want to display
                  currentMsg={
                    msg.message.messages[msg.message.messages?.length - 1].msg
                  } // get the last message to display
                  id={recipient?._id} // sender id
                  isOnline={recipient?.isOnline}
                  roomId={msg.message.roomId}
                  messageId={msg.message._id}
                  avatar={recipient?.avatar}
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

import { useState, useEffect, useContext } from "react";
import Chat from "../components/Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import ErrorMessage from "../components/ErrorMessage";
import UserContext, { UserContextType } from "../context/user.context";
import { socket } from "../pages/Dashboard";
import { useAuthUser, useSignOut } from "react-auth-kit";
import CreateNewBubble from "../components/CreateNewBubble";

export default function Inbox() {
  const [contactLists, setContactLists] = useState<[{ data: any }]>();
  const [loading, setLoading] = useState<boolean>(true);
  const userContext = useContext<UserContextType | null>(UserContext);
  const auth = useAuthUser();
  const signOut = useSignOut();

  // this initialize the event listener
  const socketListener = () => {
    socket.emit("get_all_contacts", auth()?.id);
  };

  useEffect(() => {
    let isMounted = true;
    socket.on("connect_error", (error) => {
      console.log(error);
      setLoading(false);
      signOut();
    });
    socketListener();

    // Set up the event listener
    socket.on("get_all_contacts", ({ data }) => {
      if (isMounted && data) {
        setContactLists(data);
        setLoading(false);
      }
      setLoading(false);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      isMounted = false;
      socket.off("get_all_contacts");
    };
  }, []); // Empty dependency array to run the effect only once during component mount

  return (
    <div className='p-5 mt-10 h-full relative'>
      <h3 className='mb-5'>Messages</h3>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : contactLists?.contacts.length ? (
            contactLists?.contacts.map((msg: any) => {
              const username =
                msg.message.to?._id === userContext?.user.id
                  ? msg.message.from?.username
                  : msg.message.to?.username;

              const isOnline =
                msg.message.to?._id === userContext?.user.id
                  ? msg.message.from?.isOnline
                  : msg.message.to?.isOnline;
              return (
                <Chat
                  key={msg.message._id}
                  username={username} // display/pass the right username by checking if the userId is not equal to "to" or "from", then that's the thing we want to display
                  currentMsg={
                    msg.message.messages[msg.message.messages?.length - 1].msg
                  } // get the last msg
                  id={msg.message.to._id}
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

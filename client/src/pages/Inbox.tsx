import { useState, useEffect, useContext } from "react";
import Chat from "../components/Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import axios from "../utils/axios";
import ErrorMessage from "../components/ErrorMessage";
import UserContext, { UserContextType } from "../context/user.context";

export default function Inbox() {
  const [contactLists, setContactLists] = useState<[{ data: any }]>();
  const [loading, setLoading] = useState<boolean>(true);
  const userContext = useContext<UserContextType | null>(UserContext);

  // get all messages by id
  const getAllMessages = async () => {
    try {
      const { data } = await axios.get("/contacts");

      setContactLists(data.data);
      setLoading(false);
      return;
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMessages();
  }, [loading]);

  return (
    <div className='p-5 mt-10'>
      <h3 className='mb-5'>Messages</h3>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : contactLists?.contacts?.length ? (
            contactLists?.contacts?.map((msg: any) => {
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
                  currentMsg={msg.message.messages[0].msg}
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
    </div>
  );
}

import { useState, useEffect } from "react";
import Chat from "../components/Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import axios from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import ErrorMessage from "../components/ErrorMessage";

export default function Inbox() {
  const [contactLists, setContactLists] = useState<[{ data: any }]>();
  const [loading, setLoading] = useState<boolean>(true);

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
      toast.error(error?.response?.data?.msg);
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
              return (
                <Chat
                  key={msg.message._id}
                  username={msg.message.to?.username}
                  currentMsg={msg.message.messages[0].msg}
                  id={msg.message.to._id}
                  isOnline={msg.message.to.isOnline}
                  roomId={msg.message.roomId}
                />
              );
            })
          ) : (
            <ErrorMessage msg='No messages found!' />
          )}
        </List>
      </Card>
      <ToastContainer />
    </div>
  );
}

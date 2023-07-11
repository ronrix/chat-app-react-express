import Chat from "./Chat";
import { List, Card, Spinner } from "@material-tailwind/react";
import ErrorMessage from "../../../components/errors/error-messages";
import CreateNewBubble from "./create-new-bubble";
import useContacts from "../../../hooks/inbox/useContacts";

export default function Inbox() {
  const { contacts, loading, auth } = useContacts();

  return (
    <div className='p-5 h-full relative'>
      <h2 className='mb-5 font-bold text-2xl'>Messages</h2>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : contacts?.length ? (
            contacts?.map((msg: any) => {
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

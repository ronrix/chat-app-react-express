import { useState, useEffect, useContext } from "react";
import { IconButton } from "@material-tailwind/react";
import BubbleMessages from "../components/BubbleMessages";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import { MessageContext, MessageContextType } from "../context/message.context";
import { socket } from "../pages/Dashboard";
import { useAuthUser } from "react-auth-kit";

// react quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

export default function ChatComposer() {
  const [msgs, setMsgs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  const [composedMsg, setComposedMsg] = useState<string>("");
  const auth = useAuthUser();

  const handleSubmitNewMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (composedMsg.length) {
      // emit event to send the msg
      socket.emit("send_msg", {
        roomId: messageContext?.chatUser.roomId,
        msg: composedMsg,
        userId: auth()?.id,
        idWhereToSend: messageContext?.chatUser.id,
      });

      // emit the event to send the notification to the receiver
      socket.emit("notifications", messageContext?.chatUser.id);

      // reset field
      setComposedMsg("");
    }
    return;
  };

  // this intialize the event listener
  const socketListener = () => {
    socket.emit("get_all_msgs", messageContext?.chatUser.roomId);
  };

  useEffect(() => {
    let isMounted = true;
    socketListener();
    // Set up the event listener
    socket.on("get_all_msgs", ({ data }) => {
      if (isMounted && data) {
        setMsgs(data);
        setLoading(false);
      }
    });

    // // Clean up the event listener when the component unmounts
    return () => {
      isMounted = false;
      socket.off("get_all_msgs");
    };
  }, [socket]); // Empty dependency array to run the effect only once during component mount

  return (
    <main className='mt-8 flex-1 flex flex-col'>
      <BubbleMessages msgs={msgs} loading={loading} />

      {/* composer */}
      <div className='rounded-xl relative border w-full'>
        <form onSubmit={handleSubmitNewMsg}>
          <ReactQuill
            theme='bubble'
            onChange={setComposedMsg}
            value={composedMsg}
            className='shadow'
          />
          <div className='absolute bottom-0 rounded-full right-2'>
            <IconButton type='submit' variant='text'>
              <PaperAirplaneIcon className='text-blue-500 h-8 w-8' />
            </IconButton>
          </div>
        </form>
      </div>
      <ToastContainer />
    </main>
  );
}

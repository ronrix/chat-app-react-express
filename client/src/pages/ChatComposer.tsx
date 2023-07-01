import { useState, useEffect, useContext } from "react";
import { IconButton, Textarea } from "@material-tailwind/react";
import BubbleMessages from "../components/BubbleMessages";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import axios from "../utils/axios";
import { MessageContext, MessageContextType } from "../context/message.context";

export default function Example() {
  const [msgs, setMsgs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  // fetch for all the messages
  const getAllMsgs = async () => {
    try {
      const { data } = await axios.get("/messages", {
        params: {
          roomId: messageContext?.chatUser?.roomId,
        },
      });
      setMsgs(data.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    getAllMsgs();
  }, []);

  return (
    <main className='mt-8 flex-1 flex flex-col'>
      <BubbleMessages msgs={msgs} loading={loading} />

      {/* composer */}
      <div className='rounded-xl relative border w-full'>
        <Textarea label='Message' className='pr-16 w-full' />
        <div className='absolute top-1/2 -translate-y-1/2 rounded-full right-2'>
          <IconButton variant='text'>
            <PaperAirplaneIcon className='text-blue-500 h-8 w-8' />
          </IconButton>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}

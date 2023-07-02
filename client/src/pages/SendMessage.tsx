import { useState } from "react";
import ReactQuill from "react-quill";
import { Button, Input } from "@material-tailwind/react";
import "react-quill/dist/quill.snow.css";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { uid } from "uid";
import { socket } from "./Dashboard";
import { useAuthUser } from "react-auth-kit";

export default function SendMessage() {
  const [email, setEmail] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();
  const auth = useAuthUser();

  const handleSendNewMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevent submitting if email and msg is empty
    if (!email.length || !msg.length) {
      toast.error("Pleas input all the fields");
      return;
    }

    try {
      // emit event to send the msg
      socket.emit("send_new_msg", {
        roomId: uid(),
        msg,
        userId: auth()?.id,
        email,
      });

      toast.success("Message sent!");

      // reset fields
      setEmail("");
      setMsg("");
    } catch (error) {
      toast.error(error?.response.data.msg);
    }
  };

  return (
    <div className='p-5 mt-10 h-full relative border'>
      <Button
        variant='text'
        className='border mb-3'
        onClick={() => navigate(-1)}
      >
        <ChevronLeftIcon className='h-5 w-5' />
      </Button>
      <h3>Create new message</h3>
      <form onSubmit={handleSendNewMsg}>
        <div className='w-full mt-3'>
          <Input
            label='Insert the email where to send ex. (name@email.com)'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <h5 className='mt-10 text-gray-500 text-sm'>Compose a message</h5>
        <ReactQuill
          id='msg'
          theme='snow'
          value={msg}
          onChange={setMsg}
          className='h-[400px]'
        />
        <Button type='submit' className='ml-auto mr-0 mt-20 flex items-center'>
          <PaperAirplaneIcon className='h-5 w-5' />
          Send message
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
}

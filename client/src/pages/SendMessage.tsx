import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { Button, Input } from "@material-tailwind/react";
import "react-quill/dist/quill.snow.css";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { uid } from "uid";
import { socket } from "./Dashboard";
import { useAuthUser } from "react-auth-kit";
import { ValidateEmail } from "../utils/validate-inputs";

export default function SendMessage() {
  const location = useLocation();
  const [email, setEmail] = useState<string>(() =>
    location.search ? location.search.split("=")[1] : ""
  ); // get the email in the query if there is one
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();
  const auth = useAuthUser();

  // function to handle onSubmit of the form
  const handleSendNewMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the default form functionality

    // prevent submitting if email and msg is empty and display error message
    if (!email.length || !msg.length) {
      toast.error("Please input all the fields");
      return;
    }

    // check email if valid
    if (!ValidateEmail(email)) {
      toast.error("Please input valid email (ex. name@email.com)"); // display error message
      setEmail(""); // reset email field
      return;
    }

    try {
      // emit socket event to send the msg
      socket.emit("send_new_msg", {
        roomId: uid(), // generate random string for roomId
        msg,
        userId: auth()?.id, // send the userId
        email,
      });

      // listen for "send_new_msg_response" to display a message
      socket.on("send_new_msg_response", (data) => {
        console.log(data);
        if (data.status === 201) {
          // message is sent to recipient
          toast.success(data.msg);
          return;
        }
        toast.error(data.msg);
      });

      // reset the fields
      setEmail("");
      setMsg("");
    } catch (error: any) {
      toast.error(error?.response.data.msg);
    }
  };

  useEffect(() => {
    // emit socket event to store the userId to the server
    socket.emit("store_connected_user", auth()?.id);

    return () => {
      socket.off("store_user_to_room"); // remove event listener
    };
  });

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

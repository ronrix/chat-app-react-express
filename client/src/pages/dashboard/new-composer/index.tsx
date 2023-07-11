import ReactQuill from "react-quill";
import { Button, Input } from "@material-tailwind/react";
import "react-quill/dist/quill.snow.css";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";
import useComposeNew from "../../../hooks/new-composer/useComposeNew";

export default function ComposeNew() {
  const { navigate, msg, setEmail, setMsg, email, handleSendNewMsg } =
    useComposeNew();

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

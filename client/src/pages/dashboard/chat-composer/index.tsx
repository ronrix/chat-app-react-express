import { IconButton } from "@material-tailwind/react";
import ComposeContainer from "./composer-container";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer } from "react-toastify";

// react quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useComposer from "../../../hooks/chat-composer/useComposer";

export default function ChatComposer() {
  const { msgs, loading, quillRef, onSubmit, setComposedMsg, composedMsg } =
    useComposer();

  return (
    <main className='flex flex-col h-screen'>
      <ComposeContainer msgs={msgs} loading={loading} />

      {/* composer */}
      <div className='rounded-xl relative border w-full'>
        <form onSubmit={onSubmit}>
          <ReactQuill
            ref={quillRef}
            theme='snow'
            modules={{
              toolbar: [
                ["bold", "italic", "strike", "underline"],
                ["code-block"],
                ["link", "image"],
              ],
            }}
            placeholder='Write a message'
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

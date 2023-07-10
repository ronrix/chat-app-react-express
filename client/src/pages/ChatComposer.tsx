import { useState, useEffect, useContext, useRef } from "react";
import { IconButton } from "@material-tailwind/react";
import BubbleMessages from "../components/BubbleMessages";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import { MessageContext, MessageContextType } from "../context/message.context";
import { socket } from "../pages/Dashboard";
import { useAuthUser } from "react-auth-kit";

// react quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../utils/axios";

export default function ChatComposer() {
  const [msgs, setMsgs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const [files, setFiles] = useState<File[]>([]);
  const quillRef = useRef<any>(null);

  const [composedMsg, setComposedMsg] = useState<string>("");
  const auth = useAuthUser();

  const handleSubmitNewMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form default functionality

    // if composeMsg has images inside of it, we expected that the size of that won't be send through
    // sockets. so to overcome that limitation we can send it axios and emit a sockets that calls for the
    // update of the messages

    // send small chunk of data
    if (composedMsg.length < 1875) {
      // emit event to send the message
      socket.emit("send_msg", {
        roomId: messageContext?.chatUser.roomId,
        msg: composedMsg,
        userId: auth()?.id,
        idWhereToSend: messageContext?.chatUser.id,
        username: auth()?.email,
      });

      // reset field
      setComposedMsg("");
      return;
    }

    try {
      // else we can send now through api

      /*
        replace the img src with "img_src". 
        that placeholder will be used inside the backend logic and will get replaced 
        with real image link
      */
      const newComposedString = composedMsg.replace(
        /src="([^"]+)"/g,
        'src="img_src"'
      );
      await axios.post(
        "/message/create",
        {
          roomId: messageContext?.chatUser.roomId,
          msg: newComposedString,
          userId: auth()?.id,
          files: files,
          idWhereToSend: messageContext?.chatUser.id,
          username: auth()?.email,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // emit a socket event to update the msgs state
      socket.emit("get_msgs_update", {
        roomId: messageContext?.chatUser.roomId,
        userId: auth()?.id,
        idWhereToSend: messageContext?.chatUser.id,
        username: auth()?.email,
      });

      // reset field
      setComposedMsg("");
      setFiles([]);
    } catch (error: any) {
      // display error message
      toast.error(error?.response?.data?.msg);
    }
    return;
  };

  useEffect(() => {
    // emit event to get the messages by passing the roomId
    socket.emit("get_all_msgs", messageContext?.chatUser.roomId);

    // listen for the event to store the response "messages" and display to the DOM
    socket.on("get_all_msgs", ({ data }) => {
      if (data) {
        setMsgs(data);
        setLoading(false);
      }
    });

    // image handler for react quill
    // this is a reference to the ReactQuill component handling image event
    // we can get the uploaded image file and set it to our react state to send it to our backend
    quillRef?.current
      .getEditor()
      .getModule("toolbar")
      .addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
          if (!input.files || !input?.files?.length || !input?.files?.[0])
            return;
          const editor = quillRef?.current?.getEditor();
          const file = input.files[0];

          // store the selected files into the state
          setFiles((prev) => [...prev, file]);

          const range = editor.getSelection(true);

          // convert file image to base64 to display the image to the ReactQuill text input
          const reader = new FileReader();
          reader.onload = function (event: ProgressEvent<FileReader>) {
            const base64Image = event?.target?.result;
            editor.insertEmbed(range.index, "image", base64Image);
          };

          reader.readAsDataURL(file); // invoke the function with the file
        };
      });

    // change style of react-quill editor 'ql-editor'
    if (quillRef.current) {
      const editorElement: Element | null =
        document.querySelector(".ql-editor");
      if (editorElement) {
        editorElement.classList?.add(
          "max-h-[200px]",
          "overflow-y-auto",
          "no-scrollbar"
        );
      }
    }

    // // Clean up the event listener when the component unmounts
    return () => {
      socket.off("get_all_msgs");
    };
  }, [socket, quillRef]); // Empty dependency array to run the effect only once during component mount

  return (
    <main className='mt-8 flex-1 flex flex-col'>
      <BubbleMessages msgs={msgs} loading={loading} />

      {/* composer */}
      <div className='rounded-xl relative border w-full'>
        <form onSubmit={handleSubmitNewMsg}>
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

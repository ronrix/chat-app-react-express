import { useState, useEffect, useContext, useRef } from "react";
import {
  MessageContext,
  MessageContextType,
} from "../../context/message.context";
import { useAuthUser } from "react-auth-kit";
import { socket } from "../../pages/dashboard";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";

export default function useComposer() {
  const [msgs, setMsgs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const [files, setFiles] = useState<File[]>([]);
  const quillRef = useRef<ReactQuill>(null);
  const location = useLocation();

  const [composedMsg, setComposedMsg] = useState<string>("");
  const auth = useAuthUser();

  // TODO: add group chat messages, this is just a copy of chat messages
  const handleSubmitNewMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent form default functionality

    // if composeMsg has images inside of it, we expected that the size of that won't be send through
    // sockets. so to overcome that limitation we can send it axios and emit a sockets that calls for the
    // update of the messages

    // send small chunk of data
    if (composedMsg.length < 1875) {
      // emit event to send the message
      socket.emit("group_send_msg", {
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
        "/groups/send-msg",
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

  // events and data for 'PM'
  const singleMessage = () => {
    // emit event to get the messages by passing the roomId
    socket.emit("get_all_msgs", messageContext?.chatUser.roomId);

    // listen for the event to store the response "messages" and display to the DOM
    socket.on("get_all_msgs", ({ data }) => {
      if (data) {
        setMsgs(data);
        setLoading(false);
      }
    });
  };

  const groupMessages = () => {
    // emit event to get the messages by passing the roomId
    socket.emit("group_messages", messageContext?.chatUser.roomId);

    // listen for the event to store the response "messages" and display to the DOM
    socket.on("group_messages", ({ data }) => {
      if (data) {
        setMsgs(data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (location.pathname.split("/")[2] === "inbox") {
      singleMessage();
    } else {
      groupMessages();
    }

    // image handler for react quill
    // this is a reference to the ReactQuill component handling image event
    // we can get the uploaded image file and set it to our react state to send it to our backend
    if (quillRef.current) {
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

            const range = editor?.getSelection(true);

            // convert file image to base64 to display the image to the ReactQuill text input
            const reader = new FileReader();
            reader.onload = function (event: ProgressEvent<FileReader>) {
              const base64Image = event?.target?.result;
              editor?.insertEmbed(range.index, "image", base64Image);
            };

            reader.readAsDataURL(file); // invoke the function with the file
          };
        });

      // change style of react-quill editor 'ql-editor'
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

  return {
    loading,
    msgs,
    quillRef,
    handleSubmitNewMsg,
    setComposedMsg,
    composedMsg,
  };
}

import { Avatar, Badge, IconButton, Spinner } from "@material-tailwind/react";
import { useContext, useRef, useEffect } from "react";
import { MessageContext, MessageContextType } from "../context/message.context";
import ErrorMessage from "./error-messages";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { socket } from "../pages/dashboard";
import Bubble from "./bubble";

type Props = {
  msgs: [];
  loading: boolean;
};

// extract src from img tag
function extractSrcFromImgTag(imgTag: string) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = imgTag;
  const imgElement = tempElement.querySelector("img");

  return imgElement?.getAttribute("src") || "";
}

export default function BubbleMessages(props: Props) {
  const { msgs, loading } = props;
  const navigate = useNavigate();
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const chatboxRef = useRef<HTMLElement>(null);
  const auth = useAuthUser();

  // function when the back is clicked, it will
  // emit disconnection for the user to remove them in the room
  const disconnectSocket = () => {
    socket.emit("disconnect_from_the_room", {
      userId: auth()?.id,
      roomId: messageContext?.chatUser?.roomId,
    });
    navigate(-1); // redirect back
  };

  useEffect(() => {
    // scroll chat box to the bottom
    if (chatboxRef.current && chatboxRef.current?.scrollHeight > 600) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatboxRef, loading, msgs]);

  return (
    <div className='h-full flex flex-col'>
      <header className='flex items-center gap-3'>
        <IconButton variant='text' onClick={disconnectSocket}>
          <ChevronLeftIcon className='h-5 w-5 text-gray-500' />
        </IconButton>
        <Avatar
          size='sm'
          alt='avatar'
          src={
            messageContext?.chatUser.avatar
              ? `${import.meta.env.VITE_BACKEND_URL}/${
                  messageContext?.chatUser.avatar
                }`
              : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
          }
          className='ring-4 ring-green-500/30 border border-green-500 shadow-xl shadow-green-900/20'
        />
        <span className='capitalize font-bold flex items-center gap-4'>
          {messageContext?.chatUser.username}
          <Badge
            color={messageContext?.chatUser.isOnline ? "green" : "gray"}
          ></Badge>
        </span>
      </header>

      {/* body */}
      <section
        ref={chatboxRef}
        className='flex-1 flex flex-col gap-5 mt-10 overflow-auto max-h-[600px]'
      >
        {loading ? (
          <Spinner className='mx-auto mt-10' />
        ) : msgs.length ? (
          msgs.map(
            (
              msg: {
                _id: string;
                msg: string;
                sender: string;
                reactions: [];
                createdAt: string;
              },
              i: number
            ) => {
              const imgRegex = /<img.*?>/g; // regex to match <img /> tags
              const imgTags = msg.msg.match(imgRegex); // get the img tags from string msg
              const imgSrcs = imgTags?.map(
                (
                  imgTag // extract the src from img tags, returns an array of src
                ) => extractSrcFromImgTag(imgTag)
              );

              const text = msg.msg.replace(imgRegex, ""); // replace <img /> with empty string to exclude it from the message text
              return (
                <Bubble
                  key={i}
                  text={text}
                  msg={msg}
                  imgSrcs={imgSrcs}
                  msgId={msg._id}
                  msgReactions={msg.reactions}
                />
              );
            }
          )
        ) : (
          <ErrorMessage msg='No mesasge yet' />
        )}
      </section>
    </div>
  );
}

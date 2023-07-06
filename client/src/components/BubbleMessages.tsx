import { Avatar, Badge, IconButton, Spinner } from "@material-tailwind/react";
import { useContext, useRef, useEffect } from "react";
import { MessageContext, MessageContextType } from "../context/message.context";
import ErrorMessage from "./ErrorMessage";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import { socket } from "../pages/Dashboard";

type Props = {
  msgs: [];
  loading: boolean;
};

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
          msgs.map((msg: any, i: number) => {
            return (
              <div
                key={i}
                className={`w-fit tracking-wider flex items-center gap-3 ${
                  msg.sender == auth()?.id ? "self-end" : "self-start"
                }`}
              >
                <div
                  className={`${
                    msg.sender === auth()?.id ? "order-1" : "order-2"
                  }`}
                >
                  <span className='text-[12px] text-gray-300'>
                    {moment(msg.createdAt).startOf("hour").fromNow()}
                  </span>
                  <div
                    className={`font-poppins p-2 shadow rounded-md ${
                      msg.sender === auth()?.id ? "bg-blue-300" : ""
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: msg.msg }}></span>
                  </div>
                </div>
                <Avatar
                  size='sm'
                  alt='avatar'
                  src={
                    msg.sender === auth()?.id
                      ? `${import.meta.env.VITE_BACKEND_URL}/${auth()?.avatar}`
                      : messageContext?.chatUser.avatar
                      ? `${import.meta.env.VITE_BACKEND_URL}/${
                          messageContext?.chatUser.avatar
                        }`
                      : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  }
                  className={`ring-4 ring-green-500/30 border border-green-500 shadow-xl shadow-green-900/20
                  ${msg.sender === auth()?.id ? "order-2" : "order-1"}`}
                />
              </div>
            );
          })
        ) : (
          <ErrorMessage msg='No mesasge yet' />
        )}
      </section>
    </div>
  );
}

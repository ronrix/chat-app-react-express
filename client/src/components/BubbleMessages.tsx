import { Avatar, Badge, IconButton, Spinner } from "@material-tailwind/react";
import { useContext, useRef, useEffect } from "react";
import { MessageContext, MessageContextType } from "../context/message.context";
import ErrorMessage from "./ErrorMessage";
import UserContext, { UserContextType } from "../context/user.context";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import moment from "moment";

type Props = {
  msgs: [];
  loading: boolean;
};

export default function BubbleMessages(props: Props) {
  const { msgs, loading } = props;
  const navigate = useNavigate();
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const userContext = useContext<UserContextType | null>(UserContext);
  const chatboxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // scroll chat box to the bottom
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current?.scrollHeight;
    }
  });

  return (
    <div className='h-full flex flex-col'>
      <header className='flex items-center gap-3'>
        <IconButton variant='text' onClick={() => navigate(-1)}>
          <ChevronLeftIcon className='h-5 w-5 text-gray-500' />
        </IconButton>
        <Avatar
          size='sm'
          alt='avatar'
          src='https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
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
                className={`w-fit tracking-wider ${
                  msg.sender == userContext?.user.id ? "self-end" : "self-start"
                }`}
              >
                <span className='text-[12px] text-gray-300'>
                  {moment(msg.createdAt).startOf("hour").fromNow()}
                </span>
                <div
                  className={`font-poppins p-2 shadow rounded-md ${
                    msg.sender === userContext?.user.id ? "bg-blue-300" : ""
                  }`}
                >
                  <span dangerouslySetInnerHTML={{ __html: msg.msg }}></span>
                </div>
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

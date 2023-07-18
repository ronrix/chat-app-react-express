import ImageViewer from "../../../components/ui/image-viewer";
import moment from "moment";
import { Avatar } from "@material-tailwind/react";
import DisplayReactions from "./display-reaction";
import useBubble from "../../../hooks/chat-composer/useBubble";
import { IMessageType } from "./types";
import Reactions from "./reactions";
import EmojiBtn from "./emoji-button";

type Props = {
  msg: IMessageType;
  imgSrcs: string[] | undefined;
  text: string;
  msgId: string;
  msgReactions: [];
};

export default function Bubble(props: Props) {
  const { msg, imgSrcs, text, msgId, msgReactions } = props;
  const {
    handleOpen,
    reactions,
    removeReaction,
    toggleEmojiPicker,
    auth,
    messageContext,
    open,
  } = useBubble({ msgId, msgReactions });

  return (
    <div
      className={`w-fit tracking-wider flex items-center gap-3 relative ${
        msg.sender == auth()?.id || msg.sender._id == auth()?.id
          ? "self-end"
          : "self-start"
      }`}
    >
      {/* display emoji reactions */}
      <DisplayReactions
        open={open}
        handleOpen={handleOpen}
        reactions={reactions}
        removeReaction={removeReaction}
      />
      <Reactions
        msg={msg}
        reactions={reactions}
        removeReaction={removeReaction}
        handleOpen={handleOpen}
      />
      <EmojiBtn msg={msg} toggleEmojiPicker={toggleEmojiPicker} />

      {/* message content */}
      <div
        className={`${
          msg.sender === auth()?.id || msg.sender._id == auth()?.id
            ? "order-1"
            : "order-2"
        }`}
      >
        <span className='text-[12px] text-gray-300'>
          {moment(msg.createdAt).startOf("hour").fromNow()}
        </span>
        <div
          className={`font-poppins p-2 shadow rounded-md ${
            msg.sender === auth()?.id || msg.sender._id == auth()?.id
              ? "bg-blue-300"
              : ""
          }`}
        >
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
          {imgSrcs?.map((src, i) => (
            <ImageViewer key={i} imgSrc={src} /> // render the ImageViewer component for each image to have image viewer functionality
          ))}
        </div>
      </div>

      {/* sender avatar */}
      {!messageContext?.chatUser.isGroupChat ? (
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
      ) : (
        <Avatar
          size='sm'
          alt='avatar'
          src={
            msg.sender?.avatar
              ? `${import.meta.env.VITE_BACKEND_URL}/${msg.sender?.avatar}`
              : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
          }
          className={`ring-4 ring-green-500/30 border border-green-500 shadow-xl shadow-green-900/20
                  ${msg.sender === auth()?.id ? "order-2" : "order-1"}`}
        />
      )}
    </div>
  );
}

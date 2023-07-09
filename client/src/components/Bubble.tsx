import { useContext, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { MessageContext, MessageContextType } from "../context/message.context";
import ImageViewer from "./ImageViewer";
import moment from "moment";
import { Avatar } from "@material-tailwind/react";
import { EmojiButton } from "@joeattardi/emoji-button";
import DisplayReactions from "./DisplayReactions";

type Props = {
  msg: { msg: string; sender: string; createdAt: string };
  imgSrcs: string[] | undefined;
  text: string;
};

export default function Bubble(props: Props) {
  const { msg, imgSrcs, text } = props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const auth = useAuthUser();
  const [reactions, setReactions] = useState<string[]>([]);
  const picker = new EmojiButton({
    categories: ["smileys", "flags"],
  }); // for emoji icons

  // state for opening hte modal of displaying the reactions
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  // emoji picker event store the emoji selected to our state
  picker.on("emoji", (selection) => {
    if (reactions.includes(selection.emoji)) return; // return if reactions array already have the emoji selected
    setReactions((prev) => [...prev, selection.emoji]); // store the reactions in the client

    // TODO: add the reaction to the DB with an api/socket
  });

  //  display emoji picker
  const toggleEmojiPicker = (e: React.MouseEvent<HTMLDivElement>) => {
    picker.togglePicker(e.currentTarget);
  };

  // remove reaction from "reactions" state once the emoji was clicked
  const removeReaction = (react: string) => {
    const idx = reactions.indexOf(react); // get the index of the 'react' emoji
    reactions.splice(idx, 1); // remove the 'react' emoji from the state
    setReactions(() => [...reactions]); // set the new reactions in a state. this will re-render the componet to display the updated reactions

    // TODO: remove the reaction from the DB with an api/socket
  };

  return (
    <div
      className={`w-fit tracking-wider flex items-center gap-3 relative ${
        msg.sender == auth()?.id ? "self-end" : "self-start"
      }`}
    >
      {/* display emoji reactions */}
      <DisplayReactions
        open={open}
        handleOpen={handleOpen}
        reactions={reactions}
        removeReaction={removeReaction}
      />
      <div
        className={`absolute -bottom-5 p-1 rounded-full flex items-center ${
          msg.sender == auth()?.id ? "right-12" : "left-12"
        }`}
      >
        {reactions.length ? (
          <>
            {reactions?.slice(0, 3).map((react: string, i: number) => (
              <span
                key={i}
                className='text-[12px] cursor-pointer'
                onClick={() => removeReaction(react)}
              >
                {react}
              </span>
            ))}
            {/* display the count of reactions after displaying the first 3 emojis */}
            {reactions.length > 3 && (
              <div
                onClick={handleOpen}
                className='text-[8px] bg-gray-500 max-w-6 max-h-6 w-4 h-4 rounded-full flex items-center justify-center text-white cursor-pointer'
              >
                <span>{reactions.slice(3).length}+</span>
              </div>
            )}
          </>
        ) : (
          ""
        )}
      </div>
      {/* emoji button */}
      <div
        className={`absolute top-4 p-1 bg-white h-6 w-6 flex items-center justify-center rounded-full cursor-pointer ${
          msg.sender == auth()?.id ? "-left-5" : "-right-5"
        }`}
        onClick={toggleEmojiPicker}
      >
        <img
          src='../../public/emoji-plus.png'
          alt='emoji plus button'
          className='h-4 w-4 filter grayscale opacity-75'
        />
      </div>

      <div className={`${msg.sender === auth()?.id ? "order-1" : "order-2"}`}>
        <span className='text-[12px] text-gray-300'>
          {moment(msg.createdAt).startOf("hour").fromNow()}
        </span>
        <div
          className={`font-poppins p-2 shadow rounded-md ${
            msg.sender === auth()?.id ? "bg-blue-300" : ""
          }`}
        >
          <span dangerouslySetInnerHTML={{ __html: text }}></span>
          {imgSrcs?.map((src, i) => (
            <ImageViewer key={i} imgSrc={src} /> // render the ImageViewer component for each image to have image viewer functionality
          ))}
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
}

import { useContext, useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";
import { MessageContext, MessageContextType } from "../context/message.context";
import ImageViewer from "./image-viewer";
import moment from "moment";
import { Avatar } from "@material-tailwind/react";
import { EmojiButton } from "@joeattardi/emoji-button";
import DisplayReactions from "./display-reaction";
import { socket } from "../pages/dashboard";

type Props = {
  msg: { msg: string; sender: string; createdAt: string };
  imgSrcs: string[] | undefined;
  text: string;
  msgId: string;
  msgReactions: [];
};

const picker = new EmojiButton({
  categories: ["smileys", "flags"],
}); // for emoji icons

export default function Bubble(props: Props) {
  const { msg, imgSrcs, text, msgId, msgReactions } = props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const auth = useAuthUser();
  const [reactions, setReactions] =
    useState<{ _id: string; reactor: string; reaction: string }[]>(
      msgReactions
    );
  const [emojiPickerEnabled, setEmojiPickerEnabled] = useState<boolean>(false);

  // state for opening hte modal of displaying the reactions
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  //  display emoji picker
  const toggleEmojiPicker = (e: React.MouseEvent<HTMLDivElement>) => {
    picker.togglePicker(e.currentTarget);
    setEmojiPickerEnabled((prev) => !prev);
  };

  // remove reaction from "reactions" state once the emoji was clicked
  const removeReaction = (react: {
    _id: string;
    reaction: string;
    reactor: string;
  }) => {
    // return if the reactor is the caller, then just return
    if (react.reactor !== auth()?.id) return;

    const idx = reactions.map((r) => r.reaction).indexOf(react.reaction); // get the index of the 'react' emoji
    reactions.splice(idx, 1); // remove the 'react' emoji from the state
    setReactions(() => [...reactions]); // set the new reactions in a state. this will re-render the componet to display the updated reactions

    // TODO: remove the reaction from the DB with an api/socket
    socket.emit("delete_react", {
      docId: messageContext?.chatUser.msgDocId,
      msgId,
      reactionId: react._id,
    });
  };

  // emoji picker event handler
  const handleEmojiSelection = (selection: { text: string; emoji: string }) => {
    // check if the selected emoji was already exists in the array of reactions
    const isEmojiExists = reactions.some(
      (react: { reactor: string; reaction: string }) => {
        react.reaction.includes(selection.emoji);
      }
    );

    if (isEmojiExists) return; // return if reactions array already have the emoji selected

    // TODO: add the reaction to the DB with an api/socket
    setEmojiPickerEnabled(false); // set emoji picker enabled to false after emoji selection
    socket.emit("message_react", {
      docId: messageContext?.chatUser.msgDocId,
      msgId,
      reaction: { reaction: selection.emoji, reactor: auth()?.id },
    });
  };

  useEffect(() => {
    // TODO: listen to socket events for getting the reactions of a message
    socket.on("reactions", (data) => {
      // update the state to have the reactions
      setReactions(data);
    });

    // emoji picker event store the emoji selected to our state
    if (emojiPickerEnabled) {
      picker.on("emoji", handleEmojiSelection);
    } else {
      picker.off("emoji", handleEmojiSelection);
    }

    // clean up function. remove socket events on unmount
    return () => {
      socket.off("reactions");
      socket.off("message_react");
      picker.off("emoji", handleEmojiSelection);
    };
  }, [emojiPickerEnabled]);

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
            {reactions
              ?.slice(0, 3)
              .map(
                (
                  react: { _id: string; reaction: string; reactor: string },
                  i: number
                ) => (
                  <span
                    key={i}
                    className='text-[12px] cursor-pointer'
                    onClick={() => removeReaction(react)}
                  >
                    {react.reaction}
                  </span>
                )
              )}
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

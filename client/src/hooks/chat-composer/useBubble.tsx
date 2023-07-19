import { useState, useContext, useEffect, useCallback } from "react";
import { useAuthUser } from "react-auth-kit";
import { socket } from "../../pages/dashboard";
import {
  MessageContext,
  MessageContextType,
} from "../../context/message.context";
import { IReaction } from "../../pages/dashboard/chat-composer/types";
import { EmojiButton } from "@joeattardi/emoji-button";

interface IProps {
  msgReactions: any;
  msgId: any;
}

const picker = new EmojiButton({
  categories: ["smileys", "flags"],
}); // for emoji icons

export default function useBubble(props: IProps) {
  const { msgReactions, msgId } = props;
  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const auth = useAuthUser();
  const [reactions, setReactions] = useState<IReaction[]>(msgReactions);
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
  const removeReaction = (react: IReaction) => {
    // return if the reactor is the caller, then just return
    if (react.reactor._id !== auth()?.id) return;

    const idx = reactions.map((r) => r.reaction).indexOf(react.reaction); // get the index of the 'react' emoji
    reactions.splice(idx, 1); // remove the 'react' emoji from the state
    setReactions(() => [...reactions]); // set the new reactions in a state. this will re-render the componet to display the updated reactions

    // TODO: remove the reaction from the DB with an api/socket
    // check if 'isGroupChat' or not
    if (messageContext?.chatUser.isGroupChat) {
      socket.emit("group_delete_react", {
        docId: messageContext?.chatUser.msgDocId,
        msgId,
        reactionId: react._id,
        roomId: messageContext.chatUser.roomId,
      });
      return;
    }
    // 'private message' socket reaction event
    socket.emit("delete_react", {
      docId: messageContext?.chatUser.msgDocId,
      msgId,
      reactionId: react._id,
    });
  };

  // emoji picker event handler
  const handleEmojiSelection = useCallback(
    (selection: { text: string; emoji: string }) => {
      // check if the selected emoji was already exists in the array of reactions
      const isEmojiExists = reactions.some((react: IReaction) => {
        react.reaction.includes(selection.emoji);
      });

      if (isEmojiExists) return; // return if reactions array already have the emoji selected

      // TODO: add the reaction to the DB with an api/socket
      setEmojiPickerEnabled(false); // set emoji picker enabled to false after emoji selection
      // check if 'isGropuChat' or not
      if (messageContext?.chatUser.isGroupChat) {
        socket.emit("group_message_react", {
          docId: messageContext?.chatUser.msgDocId,
          msgId,
          reaction: { reaction: selection.emoji, reactor: auth()?.id },
          roomId: messageContext.chatUser.roomId,
        });
        return;
      }
      // 'private message' socket reaction event
      socket.emit("message_react", {
        docId: messageContext?.chatUser.msgDocId,
        msgId,
        reaction: { reaction: selection.emoji, reactor: auth()?.id },
      });
    },
    [emojiPickerEnabled, reactions]
  );

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
  }, [emojiPickerEnabled, handleEmojiSelection]);

  return {
    handleOpen,
    reactions,
    removeReaction,
    toggleEmojiPicker,
    auth,
    messageContext,
    open,
  };
}

import { useContext } from "react";
import { useAuthUser } from "react-auth-kit";
import { IMessageType, IReaction } from "./types";
import {
  MessageContext,
  MessageContextType,
} from "../../../context/message.context";

type Props = {
  reactions: IReaction[];
  msg: IMessageType;
  removeReaction: (react: IReaction) => void;
  handleOpen: () => void;
};

export default function Reactions(props: Props) {
  const { reactions, msg, handleOpen, removeReaction } = props;
  const auth = useAuthUser();
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  return (
    <div
      className={`absolute -bottom-5 p-1 rounded-full flex items-center ${
        msg.sender == auth()?.id || msg.sender._id == auth()?.id
          ? "right-12"
          : "left-12"
      }`}
    >
      {reactions?.length ? (
        <>
          {reactions?.slice(0, 3).map((react: IReaction) => (
            <span
              key={react._id}
              className='text-[12px] cursor-pointer'
              onClick={() =>
                !messageContext?.chatUser.isGroupChat
                  ? removeReaction(react)
                  : handleOpen()
              }
            >
              {react.reaction}
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
  );
}

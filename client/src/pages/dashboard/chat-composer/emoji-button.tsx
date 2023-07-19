import { useAuthUser } from "react-auth-kit";
import { IMessageType } from "./types";
import { FaceSmileIcon } from "@heroicons/react/24/solid";

type Props = {
  msg: IMessageType;
  toggleEmojiPicker: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function EmojiBtn(props: Props) {
  const { msg, toggleEmojiPicker } = props;
  const auth = useAuthUser();

  return (
    <div
      className={`absolute cursor-pointer ${
        msg.sender == auth()?.id || msg.sender._id == auth()?.id
          ? "-left-5"
          : "-right-5"
      }`}
      onClick={toggleEmojiPicker}
    >
      <FaceSmileIcon className='h-4 w-4 text-gray-400' />
    </div>
  );
}

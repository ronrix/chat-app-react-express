import { useAuthUser } from "react-auth-kit";
import { IMessageType } from "./types";

type Props = {
  msg: IMessageType;
  toggleEmojiPicker: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function EmojiBtn(props: Props) {
  const { msg, toggleEmojiPicker } = props;
  const auth = useAuthUser();

  return (
    <div
      className={`absolute top-4 p-1 bg-white h-6 w-6 flex items-center justify-center rounded-full cursor-pointer ${
        msg.sender == auth()?.id || msg.sender._id == auth()?.id
          ? "-left-5"
          : "-right-5"
      }`}
      onClick={toggleEmojiPicker}
    >
      <img
        src='../../public/emoji-plus.png'
        alt='emoji plus button'
        className='h-4 w-4 filter grayscale opacity-75'
      />
    </div>
  );
}

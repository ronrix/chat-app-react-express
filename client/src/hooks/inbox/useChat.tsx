import { useContext } from "react";
import {
  MessageContext,
  MessageContextType,
} from "../../context/message.context";
import { DeleteContext, DeleteContextType } from "../../context/delete.context";
import { useAuthUser } from "react-auth-kit";
import { socket } from "../../pages/dashboard";

type Props = {
  username: string;
  currentMsg: string;
  id: string;
  isOnline: boolean;
  roomId: string;
  messageId: string;
  avatar: string;
};

export default function useChat(props: Props) {
  const { currentMsg, id, avatar, username, isOnline, roomId, messageId } =
    props;

  const messageContext = useContext<MessageContextType | null>(MessageContext);
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);
  const auth = useAuthUser();

  // if currentMsg has an image element in it
  // replace it with an icon
  const newCurrentMsg = currentMsg.replace(
    /<img.*?>/g,
    `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
    `
  );

  // function to emit joining room event with userId
  // it will store the userId and the socket id to the servers state to use for notifications
  const handleSettingActiveMsg = () => {
    socket.emit("join_room", { roomId, id }); // join the user to the room provided
    socket.emit("store_user_to_room", { userId: auth()?.id, roomId }); // emit event to store the user to the server state

    // set the new message context containing messageId, roomId, and, user information of the recipient
    messageContext?.setChatUser({
      id,
      username,
      isOnline,
      roomId,
      avatar,
      msgDocId: messageId,
      isGroupChat: false,
    });
  };

  return { handleSettingActiveMsg, newCurrentMsg, deleteContext };
}

import { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import {
  MessageContext,
  MessageContextType,
} from "../../context/message.context";

export default function useMembersLists() {
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<
    { _id: string; username: string; avatar: string; online: boolean }[]
  >([]);
  const messageContext = useContext<MessageContextType | null>(MessageContext);

  //   get members lists
  const getMembersLists = async () => {
    try {
      const { data } = await axios.get("/groups/members-list", {
        params: { docId: messageContext?.chatUser.msgDocId },
      });
      setMembers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMembersLists();
  }, []);
  return { loading, members };
}

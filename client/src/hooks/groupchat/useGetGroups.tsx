import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { IGroupChat } from "../../pages/dashboard/groups/types";
import { socket } from "../../pages/dashboard";

export default function useGetGroups() {
  const [loading, setLoading] = useState<boolean>(true);
  const signOut = useSignOut();
  const [groupChats, setGroupChats] = useState<IGroupChat[]>([]);

  const getAllGroupChats = async () => {
    try {
      socket.emit("group_chats");
      socket.on("group_chats", (data) => {
        setLoading(false);
        setGroupChats(data);
      });
    } catch (error: any) {
      if (error.response.status === 403) {
        // means the token has expired
        signOut(); // sign out or clear the cookies
      }
    }
  };

  useEffect(() => {
    getAllGroupChats();
  }, [loading]);

  return {
    groupChats,
    loading,
  };
}

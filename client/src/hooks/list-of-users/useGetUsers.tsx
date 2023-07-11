import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import axios from "../../utils/axios";
import { socket } from "../../pages/dashboard";
import { toast } from "react-toastify";

export default function useGetUsers() {
  const [users, setUsers] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const signOut = useSignOut();

  // fetch an api to get the lists of users
  const getListsOfUsers = async () => {
    try {
      const { data } = await axios.get("/users");
      setLoading(false); // set the loading to false
      setUsers(data);
    } catch (error: any) {
      if (error.response.status === 403) {
        // means the token has expired
        signOut(); // sign out or clear the cookies
      }
    }
  };

  useEffect(() => {
    // Listen for notification event
    socket.on("notification", (notif) => {
      console.log(notif);
      // Handle the notification as desired
      toast.info(notif);
    });

    getListsOfUsers(); // call the fetch api

    return () => {
      socket.off("notification");
    };
  }, []);

  return { users, loading };
}

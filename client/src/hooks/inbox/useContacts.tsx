import { useEffect, useState, useContext } from "react";
import { DeleteContext, DeleteContextType } from "../../context/delete.context";
import { useAuthUser, useSignOut } from "react-auth-kit";
import { socket } from "../../pages/dashboard";
import { toast } from "react-toastify";

export default function useContacts() {
  const [contacts, setContacts] = useState<{ contacts: [] }>();
  const [loading, setLoading] = useState<boolean>(true);
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);
  const auth = useAuthUser();
  const signOut = useSignOut();

  useEffect(() => {
    // when socket connection error, sign out the user
    socket.on("connect_error", (error) => {
      console.log(error);
      setLoading(false);
      signOut();
    });

    // emit socket event to get all contact lists of the authenticated user
    socket.emit("get_all_contacts", auth()?.id);

    // listen for the event listener to store the data received from the server and display it to the DOM
    socket.on("get_all_contacts", ({ data }) => {
      if (data) {
        setContacts(data);
      }
      setLoading(false);
    });

    // Listen for notification event
    socket.on("notification", (notif) => {
      console.log(notif);
      // Handle the notification as desired
      toast.info(notif);
    });

    // emit an event to store the userId to the server
    socket.emit("store_connected_user", auth()?.id);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("get_all_contacts");
      socket.off("notification");
      socket.off("store_connected_user");
    };
  }, [socket, deleteContext?.deleteData]);

  return { loading, contacts: contacts?.contacts, auth };
}

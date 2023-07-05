import { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import axios from "../utils/axios";
import { Spinner } from "@material-tailwind/react";
import ErrorMessage from "../components/ErrorMessage";
import { useSignOut } from "react-auth-kit";
import { socket } from "./Dashboard";
import { toast } from "react-toastify";

export default function ListOfUsers() {
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

  return (
    <div className='p-5 h-full relative'>
      <h2 className='font-bold text-2xl'>Users</h2>

      <div className='grid gap-16 grid-cols-fluid mt-5'>
        {loading ? (
          <Spinner className='mx-auto h-5 w-5' />
        ) : users.length ? (
          users.map((user: any) => {
            return (
              <UserCard
                key={user._id}
                username={user.username}
                email={user.email}
                isOnline={user.isOnline}
                avatar={user.avatar}
              />
            );
          })
        ) : (
          <ErrorMessage msg='No lists of users found' />
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import axios from "../utils/axios";
import ErrorMessage from "../components/ErrorMessage";
import { Badge } from "@material-tailwind/react";

export default function ListOfUsers() {
  const [userLists, setUserLists] = useState<[]>([]);

  const getAllUsers = async () => {
    const { data } = await axios.get("/users");
    setUserLists(data);
    console.log(data);
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <main className='p-5 mt-8 '>
      <h3 className='font-bold text-2xl'>Users</h3>
      <div className='grid grid-cols-fluid gap-4'>
        {userLists.length ? (
          userLists?.map((user: any) => {
            return (
              <UserCard
                key={user._id}
                username={user?.username}
                isOnline={user.isOnline}
              />
            );
          })
        ) : (
          <ErrorMessage msg='No users found' />
        )}
      </div>
    </main>
  );
}

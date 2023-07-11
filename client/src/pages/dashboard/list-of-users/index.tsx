import UserCard from "./user-card";
import { Spinner } from "@material-tailwind/react";
import ErrorMessage from "../../../components/errors/error-messages";
import useGetUsers from "../../../hooks/list-of-users/useGetUsers";

export default function ListOfUsers() {
  const { loading, users } = useGetUsers();
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
                avatar={user?.avatar}
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

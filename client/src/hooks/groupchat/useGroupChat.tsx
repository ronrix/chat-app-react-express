import { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { User } from "../../pages/dashboard/groupchat/types";
import { GetListsOfUsers } from "../../utils/get-users";

export default function useGroupChat() {
  const [loading, setLoading] = useState<boolean>(true);
  const signOut = useSignOut();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[] | any>([]);
  const [originalUsers, setOriginalUsers] = useState<User[] | any>([]);

  useEffect(() => {
    GetListsOfUsers({ setUsers, setOriginalUsers, setLoading, signOut }); // invoke the fetch api
  }, [loading]);

  return {
    users,
    setUsers,
    loading,
    selectedUsers,
    setSelectedUsers,
    originalUsers,
  };
}

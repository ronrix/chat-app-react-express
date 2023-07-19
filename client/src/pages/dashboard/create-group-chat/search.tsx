import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { User } from "./types";

type Props = {
  users: User[];
  originalUsers: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export default function Search(props: Props) {
  const { setUsers, users, originalUsers } = props;

  const [inputSearch, setInputSearch] = useState<string>("");
  const handleSearchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);

    if (e.target.value === "") {
      setUsers(originalUsers); // set the default users
      return;
    }

    // else filter the users state
    const searchedUsers = users.filter((u) =>
      u.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUsers(searchedUsers);
  };

  return (
    <>
      {/* search box */}
      <div className='relative flex w-full border p-2 mt-2'>
        <MagnifyingGlassIcon className='h-5 w-5' />
        <input
          type='text'
          className='pl-5 w-full outline-none rounded-md'
          placeholder='Search'
          value={inputSearch}
          onChange={handleSearchUsers}
        />
      </div>
    </>
  );
}

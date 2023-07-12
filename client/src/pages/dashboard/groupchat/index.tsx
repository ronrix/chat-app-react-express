import useGroupChat from "../../../hooks/groupchat/useGroupChat";
import GroupForm from "./group-form";
import Search from "./search";
import SelectedUsers from "./selected-users";
import UsersLists from "./users";

// TODO: create group chat
export default function CreateGroupChat() {
  const {
    users,
    setUsers,
    originalUsers,
    loading,
    setSelectedUsers,
    selectedUsers,
  } = useGroupChat();

  const selectedUsersComponent = () => {
    if (selectedUsers.length) {
      return (
        <SelectedUsers
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      );
    }
  };

  return (
    <div className='p-5 mt-10 h-full relative'>
      <h2 className='mb-5 font-bold text-2xl'>Create Group Chat</h2>
      <GroupForm />
      {selectedUsersComponent()}
      <Search users={users} setUsers={setUsers} originalUsers={originalUsers} />
      <UsersLists
        loading={loading}
        users={users}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    </div>
  );
}

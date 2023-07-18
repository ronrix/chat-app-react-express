import { Card, List, Spinner } from "@material-tailwind/react";
import useGetGroups from "../../../hooks/groupchat/useGetGroups";
import ErrorMessage from "../../../components/errors/error-messages";
import { IGroupChat } from "./types";
import GroupChat from "./group-chat";

export default function Groups() {
  const { loading, groupChats } = useGetGroups();
  return (
    <div className='p-5 h-full'>
      <h2 className='mb-5 font-bold text-2xl'>Group Chats</h2>
      <Card className='w-full'>
        <List>
          {loading ? (
            <Spinner className='mx-auto mt-10' />
          ) : groupChats?.length ? (
            groupChats?.map((group: IGroupChat) => {
              return (
                <GroupChat
                  key={group._id}
                  avatar={group.groupAvatar}
                  currentMessage='hello'
                  groupName={group.groupName}
                  roomId={group.roomId}
                />
              );
            })
          ) : (
            <ErrorMessage msg='No messages found!' />
          )}
        </List>
      </Card>
    </div>
  );
}

import {
  Avatar,
  Badge,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import useMembersLists from "../../../../hooks/chat-composer/useMembersLists";
import ErrorMessage from "../../../../components/errors/error-messages";

export default function Members() {
  const { loading, members } = useMembersLists();
  return (
    <div>
      {loading ? (
        <Spinner className='mx-auto mt-10' />
      ) : (
        <Card className='w-full'>
          <List>
            {members?.length ? (
              members.map((member) => {
                return (
                  <ListItem key={member._id}>
                    <ListItemPrefix>
                      <Avatar
                        variant='circular'
                        alt='candice'
                        src={
                          member.avatar
                            ? import.meta.env.VITE_BACKEND_URL +
                              "/" +
                              member.avatar
                            : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                        }
                      />
                    </ListItemPrefix>
                    <div className='flex items-center gap-3'>
                      <Typography
                        variant='h6'
                        color='blue-gray'
                        className='capitalize'
                      >
                        {member.username}
                      </Typography>
                      <Badge color={member.online ? "green" : "gray"}></Badge>
                    </div>
                  </ListItem>
                );
              })
            ) : (
              <ErrorMessage msg='No members yet' />
            )}
          </List>
        </Card>
      )}
    </div>
  );
}

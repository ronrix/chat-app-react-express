import { Avatar, Badge } from "@material-tailwind/react";
import ImageMenu from "./image-menu";
import { useAuthUser } from "react-auth-kit";

export default function ChangeAvatar() {
  const auth = useAuthUser();
  return (
    <section className='flex flex-col items-startstart gap-5'>
      <h5 className='font-bold text-sm'>Profile picture</h5>
      <div>
        <Badge
          content={<ImageMenu />}
          placement='bottom-end'
          className='right-10 px-3 rounded-md cursor-pointer border-black'
          color='white'
          withBorder
        >
          <Avatar
            size='xxl'
            alt='avatar'
            src={
              auth()?.avatar
                ? `${import.meta.env.VITE_BACKEND_URL}/${auth()?.avatar}`
                : "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
            }
            className='ring-4 ring-green-500/30 border border-green-500 shadow-xl shadow-green-900/20 w-[200px] h-[200px]'
          />
        </Badge>
      </div>
    </section>
  );
}

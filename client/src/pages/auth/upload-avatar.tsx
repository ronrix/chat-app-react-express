import { CheckIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Typography } from "@material-tailwind/react";
// image
import defaultAvatar from "../assets/default-avatar.jpg";
import useFormCompleting from "../../hooks/auth/useFormCompleting";

export default function UploadAvatar() {
  const {
    handleChangePhoto,
    handleSubmit,
    avatar,
    avatarDisplay,
    inputFileRef,
  } = useFormCompleting();

  return (
    <main className='container mx-auto flex items-center justify-center h-screen'>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <CheckIcon className='h-10 w-10 text-green-500 border rounded-full border-green-300 p-1' />
        <Typography
          variant='h1'
          color='blue-gray'
          className='text-2xl flex items-center gap-2'
        >
          You are now Registered!
        </Typography>
        <Typography variant='paragraph' color='gray' size='sm'>
          You can upload new avatar for your reference.
        </Typography>

        <Badge
          content={!avatar ? "Default Avatar" : "New avatar"}
          withBorder
          className='px-2'
          color={!avatar ? "blue-gray" : "amber"}
        >
          <img
            src={avatarDisplay || defaultAvatar}
            alt='default avatar'
            className='h-96 w-96 rounded-full mt-5 object-cover'
          />
        </Badge>
        <input
          type='file'
          className='hidden'
          ref={inputFileRef}
          onChange={handleChangePhoto}
        />
        <Button
          variant='outlined'
          className='block mx-auto capitalize font-poppins mt-3'
          color='blue-gray'
          onClick={() => inputFileRef.current?.click()}
        >
          Upload photo
        </Button>

        <div className='self-end mt-10 flex flex-col justify-end'>
          <span className='text-[11px] text-gray-500'>
            Will redirect you to dashboard.
          </span>
          <Button type='submit' variant='gradient' className='font-poppins'>
            Finish
          </Button>
        </div>
      </form>
    </main>
  );
}

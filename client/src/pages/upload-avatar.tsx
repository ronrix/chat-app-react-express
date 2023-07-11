import { CheckIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Typography } from "@material-tailwind/react";
// image
import defaultAvatar from "../assets/default-avatar.jpg";
import React, { useRef, useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { useCookies } from "react-cookie";

export default function UploadAvatar() {
  const [avatar, setAvatar] = useState<File>();
  const [avatarDisplay, setAvatarDisplay] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [cookies, setCookie] = useCookies(["_auth_state"]);
  const auth = useAuthUser();

  // function to set the new image. one for form and a state for displaying the new image
  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target?.files[0]);
    setAvatarDisplay(URL.createObjectURL(e.target?.files[0]));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // send or upload avatar, either use avatar is empty or not
    // on the backend side, we will just store the default avatar if no avatar was uploaded
    if (avatar) {
      formData.append("avatar", avatar);
    }
    const { data } = await axios.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // server respond with 200 or 204 status code
    // 200 for success with no uploaded avatar
    // 204 for success with uploaded avatar
    if (data.data.status === 204 || data.data.status === 200) {
      // update the _auth cookie state with avatar value
      // react-auth-kit authState is stored in a path '/'. so to update it we have to set the same path
      const authState = JSON.stringify({
        ...cookies._auth_state,
        avatar: data.avatar,
      });
      // setCookie automatically encodes the value of the cookie
      setCookie("_auth_state", authState, {
        path: "/",
        expires: new Date(Date.now() + 1 * (86400 * 1000)),
      });
      // this redirects to the dashboard with loading the page, to refresh the cookies too
      window.location.href = "/dashboard";
    }
  };

  // check if user already created an account before proceeding
  // if not redirect back to '/register'
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/register");
    }
    // check if avatar is already set, redirect to dashboard if avatar is already set up
    if (auth()?.avatar) {
      navigate("/dashboard");
    }
  }, []);

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

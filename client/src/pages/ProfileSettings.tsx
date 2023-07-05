import { useState, useEffect } from "react";
import { Avatar, Badge, Button, Input } from "@material-tailwind/react";
import { useAuthUser } from "react-auth-kit";
import ImageMenu from "../components/ImageMenu";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

export default function ProfileSettings() {
  const [cookies, setCookie] = useCookies(["_auth_state"]);
  const auth = useAuthUser();
  const [fields, setFields] = useState<{
    username: string;
    email: string;
    password: string;
  }>({ username: auth()?.username, email: auth()?.email, password: "" });

  // call an api to update the user information
  const handleUpdateProfileInfo = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // input validation - prevent if none of the fields are filled
    if (
      (!fields.email.length &&
        !fields.username.length &&
        !fields.password.length) ||
      fields.email === auth()?.email ||
      fields.username === auth()?.username
    ) {
      return;
    }

    try {
      // call the api to update the user information
      const { data } = await axios.put("/user/update-info", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });
      // 204 means the information updated
      if (data.data.status === 204) {
        // display message
        setCookie("_auth_state", {
          ...cookies,
          username: data.data.username,
          email: data.data.email,
        });
        toast.success(data.data.msg);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg); // display the error
    }
  };

  const handleOnChangeFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  useEffect(() => {}, []);

  return (
    <form
      onSubmit={handleUpdateProfileInfo}
      className='p-5 flex flex-col gap-10'
    >
      <section>
        <h2 className='capitalize font-bold text-2xl'>
          Personal profile settings
        </h2>
        <p className=''>You can modify your profile here</p>
      </section>

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

      <section>
        <div>
          <label>
            <span className='font-bold capitalize'>name</span>
            <Input
              type='text'
              placeholder='username'
              name='username'
              onChange={handleOnChangeFields}
              defaultValue={auth()?.username}
              containerProps={{ className: "min-w-[100px] mt-1" }}
            />
            <p className='text-[11px] text-gray-600 mt-1'>
              Your name will be your identity from other users.
            </p>
          </label>
          <label className='mt-5 block'>
            <span className='font-bold capitalize'>email</span>
            <Input
              type='email'
              placeholder='email'
              name='email'
              onChange={handleOnChangeFields}
              defaultValue={auth()?.email}
              containerProps={{ className: "min-w-[100px] mt-1" }}
            />
            <p className='text-[11px] text-gray-600 mt-1'>
              Your email will be your login credential, you will use this to
              login your account.
            </p>
          </label>
          <label className='mt-5 block'>
            <span className='font-bold capitalize'>password</span>
            <Input
              type='password'
              placeholder='******'
              name='password'
              onChange={handleOnChangeFields}
              disabled
              containerProps={{ className: "min-w-[100px] mt-1" }}
            />
            <p className='text-[11px] text-gray-600 mt-1'>
              Note: remember your password before clicking the update button
            </p>
          </label>
        </div>
      </section>

      <section>
        <p className='text-[11px] text-gray-600 my-1'>
          All of the fields on this page are able to be updated. By filling them
          out it will update profile information of this account.
        </p>
        <Button type='submit' variant='filled' size='sm' className='w-fit'>
          Update profile
        </Button>
      </section>
    </form>
  );
}

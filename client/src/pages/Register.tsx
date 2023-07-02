import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";

export default function Register() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<{
    email: string;
    password: string;
    username: string;
  }>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // set the loading to true

    try {
      // fetch login
      const { data } = await axios.post("/register", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });

      // redirect to dashboard if there is a token in the response
      if (data.token) {
        // store the id to cookie
        cookies.set("userId", data.id);
        // store the id to cookie
        signIn({
          token: data.token,
          expiresIn: 3600 * 2,
          tokenType: "Bearer",
          authState: { email: fields.email, id: data.id },
        });

        setLoading(false); // set the loading to false
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);
      console.log(error);
      setLoading(false); // set the loading to false
    }
  };

  useEffect(() => {
    // check auth status then redirect to '/dashboard'
    if (isAuthenticated()) {
      return navigate("/dashboard");
    }
  }, []);

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card color='transparent' shadow={false}>
        <Typography variant='h4' color='blue-gray'>
          Sign up
        </Typography>
        <Typography color='gray' className='mt-1 font-normal'>
          Enter your details to register.
        </Typography>
        <form
          onSubmit={handleRegister}
          className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96'
        >
          <div className='mb-4 flex flex-col gap-6'>
            <Input
              size='lg'
              label='Username'
              name='username'
              onChange={handleChange}
              value={fields.username}
            />
            <Input
              size='lg'
              label='Email'
              name='email'
              onChange={handleChange}
              value={fields.email}
            />
            <Input
              type='password'
              size='lg'
              label='Password'
              name='password'
              onChange={handleChange}
              value={fields.password}
            />
          </div>
          <Button type='submit' className='mt-6' fullWidth>
            {loading ? <Spinner className='mx-auto h-4 w-4' /> : "Register"}
          </Button>
          <Typography color='gray' className='mt-4 text-center font-normal'>
            Already have an account?
            <Link
              to='/signin'
              className='font-medium text-blue-500 transition-colors hover:text-blue-700 ml-2'
            >
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>

      <ToastContainer />
    </div>
  );
}

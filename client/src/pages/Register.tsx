import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";

export default function Register() {
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

  // function to handle input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // function to hande onSubmit of the form
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the default form functionality
    setLoading(true); // set the loading to true

    try {
      // fetch register api
      // get the data response
      const { data } = await axios.post("/register", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });

      // redirect to dashboard if there is a token in the response
      if (data.token) {
        // sign in the user, storing the user data to cookies
        signIn({
          token: data.token,
          expiresIn: 3600 * 2, // 2 hours expiration
          tokenType: "Bearer",
          authState: {
            email: fields.email,
            id: data.id,
            username: data.username,
          }, // store some data of the user to the cookie
        });

        setLoading(false); // set the loading to false

        // this redirects to the dashboard with loading the page, to refresh the cookies too
        // this prevents the redirecting loops from '/dashboard' to '/signin'
        window.location.href = "/register/upload-avatar";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);

      // reset password fields
      setFields({ ...fields, password: "" });
      setLoading(false); // set the loading to false
    }
  };

  useEffect(() => {
    // check auth status then redirect to '/dashboard'
    if (isAuthenticated()) {
      navigate("/dashboard");
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
          <Button type='submit' className='mt-6 font-poppins' fullWidth>
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

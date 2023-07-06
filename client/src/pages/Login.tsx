import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import { useSignIn } from "react-auth-kit";
import { useIsAuthenticated } from "react-auth-kit";

export default function Login() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  // function to handle input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // function to hande onSubmit of the form
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // preven the default functionality of forms

    // validate input fields
    if (!fields.email.length || !fields.password.length) {
      toast.error("Please fill up email and password fields");
      return;
    }
    setLoading(true); // set the loading to true

    try {
      // fetch login api
      // get the data response
      const { data } = await axios.post("/signin", {
        email: fields.email,
        password: fields.password,
      });

      // redirect to dashboard if there is a token in the response
      if (data?.token) {
        // store the id to cookie using signIn function of 'react-auth-kit'
        signIn({
          token: data.token,
          expiresIn: 3600 * 2, // 2 hours expiration
          tokenType: "Bearer",
          authState: {
            email: fields.email,
            id: data.id,
            username: data.username,
            avatar: data.avatar,
          }, // store some data of the user to the cookie
        });

        setLoading(false); // set the loading to false

        // this redirects to the dashboard with loading the page, to refresh the cookies too
        // this prevents the redirecting loops from '/dashboard' to '/signin'
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg); // display the error

      // reset password fields
      setFields({ ...fields, password: "" });
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
          Sign In
        </Typography>
        <Typography color='gray' className='mt-1 font-normal'>
          Enter your details to signin.
        </Typography>
        <form
          onSubmit={handleLogin}
          className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96'
        >
          <div className='mb-4 flex flex-col gap-6'>
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
            {loading ? <Spinner className='mx-auto h-4 w-4' /> : "Sign in"}
          </Button>
          <Typography color='gray' className='mt-4 text-center font-normal'>
            Don't have an account?
            <Link
              to='/register'
              className='font-medium text-blue-500 transition-colors hover:text-blue-700 ml-2'
            >
              Sign Up
            </Link>
          </Typography>
        </form>
      </Card>

      {/* display error message */}
      <ToastContainer />
    </div>
  );
}

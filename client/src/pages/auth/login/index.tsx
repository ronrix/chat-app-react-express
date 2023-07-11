import {
  Input,
  Button,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useForm from "../../../hooks/auth/useFormLogin";

export default function Login() {
  const { handleChange, handleLogin, loading, fields } = useForm();

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

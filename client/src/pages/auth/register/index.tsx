import {
  Input,
  Button,
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import useFormRegister from "../../../hooks/auth/useFormRegister";

export default function Register() {
  const { fields, handleChange, handleRegister, loading } = useFormRegister();

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

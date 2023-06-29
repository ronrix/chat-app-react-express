import React from "react";
import { Input, Button, Card, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Card color='transparent' shadow={false}>
        <Typography variant='h4' color='blue-gray'>
          Sign up
        </Typography>
        <Typography color='gray' className='mt-1 font-normal'>
          Enter your details to register.
        </Typography>
        <form className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96'>
          <div className='mb-4 flex flex-col gap-6'>
            <Input size='lg' label='Email' />
            <Input type='password' size='lg' label='Password' />
          </div>
          <Button className='mt-6' fullWidth>
            register
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
    </div>
  );
}

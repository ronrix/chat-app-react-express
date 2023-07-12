import { Button, Input } from "@material-tailwind/react";

export default function GroupForm() {
  return (
    <>
      {/* form and list of accounts to send an invitation for group chat */}
      <form className='flex items-center'>
        <Input
          color='blue'
          label='Group name (optional)'
          className='flex-1'
          variant='standard'
        />
        <Button variant='text' color='blue'>
          Create
        </Button>
      </form>
    </>
  );
}

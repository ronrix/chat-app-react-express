import { Button } from "@material-tailwind/react";

export default function SubmitBtn() {
  return (
    <section>
      <p className='text-[11px] text-gray-600 my-1'>
        All of the fields on this page are able to be updated. By filling them
        out it will update profile information of this account.
      </p>
      <Button type='submit' variant='filled' size='sm' className='w-fit'>
        Update profile
      </Button>
    </section>
  );
}

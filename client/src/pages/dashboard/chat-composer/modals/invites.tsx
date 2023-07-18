import { Spinner } from "@material-tailwind/react";

export default function Invites() {
  const loading = false;
  return (
    <div>
      {/* TODO: display users to invite */}
      {loading ? <Spinner className='mx-auto mt-10' /> : <div>invites</div>}
    </div>
  );
}

import { Spinner } from "@material-tailwind/react";

export default function ChangeAvatar() {
  const loading = false;
  return (
    <div>
      {/* TODO: display form to update the avatar */}
      {loading ? (
        <Spinner className='mx-auto mt-10' />
      ) : (
        <div>change avatar</div>
      )}
    </div>
  );
}

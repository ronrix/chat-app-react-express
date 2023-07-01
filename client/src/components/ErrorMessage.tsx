import { XCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  msg: string;
};

export default function ErrorMessage(props: Props) {
  const { msg } = props;
  return (
    <div className='flex flex-col items-center gap-4 justify-center mt-5'>
      <XCircleIcon className='h-8 w-8 text-gray-300' />
      <p className='text-gray-600'>{msg}</p>
    </div>
  );
}

import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";

type Props = {
  open: boolean;
  handleOpen: () => void;
  reactions: string[];
  removeReaction: (react: string) => void;
};

export default function DisplayReactions(props: Props) {
  const { open, handleOpen, reactions, removeReaction } = props;

  if (!open) return;

  return (
    <Fragment>
      <Dialog open={open} handler={handleOpen} size='xs'>
        <DialogHeader>Message Reactions.</DialogHeader>
        <DialogBody divider>
          <section className='flex flex-col items-center justify-center'>
            {reactions.length &&
              reactions.map((react, i) => {
                return (
                  <div className='flex items-center justify-between'>
                    <span key={i} className='text-3xl'>
                      {react}
                    </span>
                    <Button
                      className='flex items-center rounded-md px-2'
                      color='red'
                      variant='outlined'
                      onClick={() => removeReaction(react)}
                    >
                      <XMarkIcon className='h-5 w-5' />
                      remove
                    </Button>
                  </div>
                );
              })}
          </section>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
}

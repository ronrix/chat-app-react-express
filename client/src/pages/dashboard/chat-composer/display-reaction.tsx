import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { useAuthUser } from "react-auth-kit";

type Props = {
  open: boolean;
  handleOpen: () => void;
  reactions: { _id: string; reactor: string; reaction: string }[];
  removeReaction: (react: {
    _id: string;
    reaction: string;
    reactor: string;
  }) => void;
};

export default function DisplayReactions(props: Props) {
  const { open, handleOpen, reactions, removeReaction } = props;
  const auth = useAuthUser();

  if (!open) return;

  return (
    <Fragment>
      <Dialog open={open} handler={handleOpen} size='xs'>
        <DialogHeader>Reactions.</DialogHeader>
        <DialogBody divider>
          <section className='flex flex-col items-center justify-center'>
            {reactions.length &&
              reactions.map(
                (
                  react: { _id: string; reactor: string; reaction: string },
                  i
                ) => {
                  return (
                    <div key={i} className='flex items-center justify-between'>
                      <span key={i} className='text-3xl'>
                        {react.reaction}
                      </span>
                      {react?.reactor === auth()?.id && (
                        <Button
                          className='flex items-center rounded-md px-2'
                          color='red'
                          variant='outlined'
                          onClick={() => removeReaction(react)}
                        >
                          <XMarkIcon className='h-5 w-5' />
                          remove
                        </Button>
                      )}
                    </div>
                  );
                }
              )}
          </section>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
}

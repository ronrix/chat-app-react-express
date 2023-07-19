import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Avatar,
} from "@material-tailwind/react";
import { useAuthUser } from "react-auth-kit";
import { IReaction } from "./types";

type Props = {
  open: boolean;
  handleOpen: () => void;
  reactions: IReaction[];
  removeReaction: (react: IReaction) => void;
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
              reactions.map((react: IReaction) => {
                return (
                  <section
                    key={react._id}
                    className='flex items-center justify-between w-full'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar
                        src={
                          import.meta.env.VITE_BACKEND_URL +
                          "/" +
                          react.reactor.avatar
                        }
                        alt={`${react.reactor.username} avatar`}
                        size='sm'
                      />
                      <span className='text-xl capitalize'>
                        {react.reactor.username}
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-3xl'>{react.reaction}</span>
                      <Button
                        className={`flex items-center rounded-md px-2 ${
                          react?.reactor._id !== auth()?.id && "invisible"
                        }`}
                        color='red'
                        variant='outlined'
                        size='sm'
                        onClick={() => removeReaction(react)}
                      >
                        <XMarkIcon className='h-5 w-5' />
                      </Button>
                    </div>
                  </section>
                );
              })}
          </section>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
}

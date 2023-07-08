import React from "react";
import { Dialog, DialogBody, Card } from "@material-tailwind/react";

type Props = {
  imgSrc: string;
};

export default function ImageViewer(props: Props) {
  const { imgSrc } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <React.Fragment>
      <Card
        className='h-64 w-96 cursor-pointer overflow-hidden transition-opacity hover:opacity-90'
        onClick={handleOpen}
      >
        <img
          alt='nature'
          className='h-full w-full object-cover object-center'
          src={imgSrc}
        />
      </Card>
      <Dialog size='xl' open={open} handler={handleOpen}>
        <DialogBody divider={true} className='p-0'>
          <img
            alt='nature'
            className='w-full object-contain object-center'
            src={imgSrc}
          />
        </DialogBody>
      </Dialog>
    </React.Fragment>
  );
}

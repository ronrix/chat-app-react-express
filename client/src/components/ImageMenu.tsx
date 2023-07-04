import {
  Dialog,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";

export default function ImageMenu() {
  const [newPhoto, setNewPhoto] = useState<any>();

  const handleUploadPhoto = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setNewPhoto("feature");
    // const inputFile = document.createElement("input");
    // inputFile.type = "file";
    // inputFile.click();
    // inputFile.onchange = (ev) => {
    //   setNewPhoto(ev);
    // };
  };

  const handleRemovePhoto = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setNewPhoto("feature");
  };

  return (
    <>
      <Menu>
        <MenuHandler>
          <span className='flex items-center gap-1'>
            <PencilIcon className='h-3 w-3' />
            Edit
          </span>
        </MenuHandler>
        <MenuList>
          <MenuItem onClick={handleUploadPhoto}>Upload a photo</MenuItem>
          <MenuItem onClick={handleRemovePhoto}>Remove photo</MenuItem>
        </MenuList>
      </Menu>

      <Dialog open={newPhoto} handler={() => setNewPhoto(null)}>
        <DialogBody className='font-bold text-2xl'>Coming soon!</DialogBody>
      </Dialog>
    </>
  );
}

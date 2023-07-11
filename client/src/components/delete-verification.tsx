import { useContext } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { DeleteContext, DeleteContextType } from "../context/delete.context";

export default function DeleteVerification() {
  const deleteContext = useContext<DeleteContextType | null>(DeleteContext);

  const handleProceedDeleting = async () => {
    try {
      const { data } = await axios.delete("/message/delete", {
        data: { messageId: deleteContext?.deleteData.messageId },
      });
      console.log(data);
      if (data.data.status === 204) {
        toast.success(data.data.msg);
      }
      deleteContext?.setDeleteData({ isDeleting: false, messageId: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);
    }
  };

  const closeModal = () =>
    deleteContext?.setDeleteData({ isDeleting: false, messageId: "" });

  return (
    <Dialog open={deleteContext?.deleteData.isDeleting} handler={closeModal}>
      <DialogHeader>
        <Typography variant='h5' color='blue-gray'>
          Are you sure?
        </Typography>
      </DialogHeader>
      <DialogBody divider className='grid place-items-center gap-4'>
        <Typography className='text-center font-normal'>
          Do you really want to delete this message? This process cannot be
          undone.
        </Typography>
      </DialogBody>
      <DialogFooter className='space-x-2'>
        <Button variant='text' color='blue-gray' onClick={closeModal}>
          No, cancel it.
        </Button>
        <Button variant='gradient' onClick={handleProceedDeleting} color='red'>
          Yes, delete it.
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Members from "./members";
import Invites from "./invites";
import ChangeAvatar from "./change-avatar";

type Props = {
  handleOpen: (role: string) => void;
  open: boolean;
  role: string;
};

function determineHeaderText(role: string) {
  /* eslint indent: */
  switch (role) {
    case "members":
      return "Members Lists";
    case "avatar":
      return "Change Avatar";
    case "invite":
      return "Invite People";
    default:
      return "Default Dialog";
  }
}

function renderDialogBody(role: string) {
  /* eslint indent: */
  switch (role) {
    case "members":
      return <Members />;
    case "avatar":
      return <ChangeAvatar />;
    case "invite":
      return <Invites />;
    default:
      return "Default Dialog";
  }
}

export default function MenuDialog(props: Props) {
  const { open, handleOpen, role } = props;

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>{determineHeaderText(role)}</DialogHeader>
      <DialogBody divider>{renderDialogBody(role)}</DialogBody>
    </Dialog>
  );
}

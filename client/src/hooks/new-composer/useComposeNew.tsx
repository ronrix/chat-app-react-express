import { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ValidateEmail } from "../../utils/validate-inputs";
import { socket } from "../../pages/dashboard";
import { uid } from "uid";

export default function useComposeNew() {
  const location = useLocation();
  const [email, setEmail] = useState<string>(() =>
    location.search ? location.search.split("=")[1] : ""
  ); // get the email in the query if there is one
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();
  const auth = useAuthUser();

  // function to handle onSubmit of the form
  const handleSendNewMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the default form functionality

    // prevent submitting if email and msg is empty and display error message
    if (!email.length || !msg.length) {
      toast.error("Please input all the fields");
      return;
    }

    // check email if valid
    if (!ValidateEmail(email)) {
      toast.error("Please input valid email (ex. name@email.com)"); // display error message
      setEmail(""); // reset email field
      return;
    }

    try {
      // emit socket event to send the msg
      socket.emit("send_new_msg", {
        roomId: uid(), // generate random string for roomId
        msg,
        userId: auth()?.id, // send the userId
        email,
      });
    } catch (error: any) {
      toast.error(error?.response.data.msg);
    }
  };

  useEffect(() => {
    // emit socket event to store the userId to the server
    socket.emit("store_connected_user", auth()?.id);

    // listen for "send_new_msg_response" to display a message
    socket.on("send_new_msg_response", (data) => {
      if (data.status === 201) {
        // message is sent to recipient
        toast.success(data.msg);
        // reset the fields only when message was successfully sent
        setMsg("");
        return;
      }
      toast.error(data.msg);
    });

    return () => {
      socket.off("store_user_to_room"); // remove event listener
      socket.off("send_new_msg"); // remove event listener
      socket.off("send_new_msg_response"); // remove event listener
    };
  }, []);

  return { navigate, handleSendNewMsg, email, setEmail, msg, setMsg };
}

import { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { useCookies } from "react-cookie";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export default function useProfile() {
  const [cookies, setCookie] = useCookies(["_auth_state"]);
  const auth = useAuthUser();
  const [fields, setFields] = useState<{
    username: string;
    email: string;
    password: string;
  }>({ username: auth()?.username, email: auth()?.email, password: "" });

  // call an api to update the user information
  const handleUpdateProfileInfo = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // input validation - prevent if none of the fields are filled
    if (
      (!fields.email.length &&
        !fields.username.length &&
        !fields.password.length) ||
      (fields.email === auth()?.email && fields.username === auth()?.username)
    ) {
      return;
    }

    try {
      // call the api to update the user information
      const { data } = await axios.put("/user/update-info", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });
      // 204 means the information updated
      if (data.data.status === 204) {
        // setCookie automatically encodes the value of the cookie
        // update the auth cookie with the new user data
        const authState = JSON.stringify({
          ...cookies._auth_state,
          username: data.data.username,
          email: data.data.email,
        });
        setCookie("_auth_state", authState, {
          path: "/",
          expires: new Date(Date.now() + 1 * (86400 * 1000)),
        });

        // display message
        toast.success(data.data.msg);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg); // display the error
    }
  };

  const handleOnChangeFields = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("mounted.");
  }, [cookies]);

  return { handleOnChangeFields, handleUpdateProfileInfo };
}

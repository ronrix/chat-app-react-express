import { useState, useRef, useEffect } from "react";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

export default function useFormCompleting() {
  const [avatar, setAvatar] = useState<File>();
  const [avatarDisplay, setAvatarDisplay] = useState<string>("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [cookies, setCookie] = useCookies(["_auth_state"]);
  const auth = useAuthUser();

  // function to set the new image. one for form and a state for displaying the new image
  const handleChangePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target?.files[0]);
    setAvatarDisplay(URL.createObjectURL(e.target?.files[0]));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    // send or upload avatar, either use avatar is empty or not
    // on the backend side, we will just store the default avatar if no avatar was uploaded
    if (avatar) {
      formData.append("avatar", avatar);
    }
    const { data } = await axios.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // server respond with 200 or 204 status code
    // 200 for success with no uploaded avatar
    // 204 for success with uploaded avatar
    if (data.data.status === 204 || data.data.status === 200) {
      // update the _auth cookie state with avatar value
      // react-auth-kit authState is stored in a path '/'. so to update it we have to set the same path
      const authState = JSON.stringify({
        ...cookies._auth_state,
        avatar: data.avatar,
      });
      // setCookie automatically encodes the value of the cookie
      setCookie("_auth_state", authState, {
        path: "/",
        expires: new Date(Date.now() + 1 * (86400 * 1000)),
      });
      // this redirects to the dashboard with loading the page, to refresh the cookies too
      window.location.href = "/dashboard";
    }
  };

  // check if user already created an account before proceeding
  // if not redirect back to '/register'
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/register");
    }
    // check if avatar is already set, redirect to dashboard if avatar is already set up
    if (auth()?.avatar) {
      navigate("/dashboard");
    }
  }, []);

  return {
    handleChangePhoto,
    handleSubmit,
    avatar,
    avatarDisplay,
    inputFileRef,
  };
}

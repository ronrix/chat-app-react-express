import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import UserContext from "../context/user.context";

export default function Protected({ children }: any) {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [user, setUser] = useState<string>("");

  const [verified, setVerified] = useState<boolean>(() =>
    cookies.get("userId")
  );

  const getTheuser = async () => {
    try {
      const { data } = await axios.get("/user");
      if (data.msg === "Success") {
        setVerified(true); // return auth
        setUser(data.username);
      }
    } catch (error) {
      toast.warn(error.response.statusText);
      setVerified(false);
    }
  };

  useEffect(() => {
    // if no userId found return and not fetch the api
    if (!verified) {
      navigate("/signin");
      return;
    }

    setTimeout(getTheuser, 0);
    navigate("/dashboard");
  }, [verified]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

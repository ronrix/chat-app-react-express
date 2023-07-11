import React, { useEffect, useState } from "react";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

export default function useFormRegister() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<{
    email: string;
    password: string;
    username: string;
  }>({
    username: "",
    email: "",
    password: "",
  });

  // function to handle input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // function to hande onSubmit of the form
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the default form functionality
    setLoading(true); // set the loading to true

    try {
      // fetch register api
      // get the data response
      const { data } = await axios.post("/register", {
        username: fields.username,
        email: fields.email,
        password: fields.password,
      });

      // redirect to dashboard if there is a token in the response
      if (data.token) {
        // sign in the user, storing the user data to cookies
        signIn({
          token: data.token,
          expiresIn: 3600 * 2, // 2 hours expiration
          tokenType: "Bearer",
          authState: {
            email: fields.email,
            id: data.id,
            username: data.username,
          }, // store some data of the user to the cookie
        });

        setLoading(false); // set the loading to false

        // this redirects to the dashboard with loading the page, to refresh the cookies too
        // this prevents the redirecting loops from '/dashboard' to '/signin'
        window.location.href = "/register/upload-avatar";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);

      // reset password fields
      setFields({ ...fields, password: "" });
      setLoading(false); // set the loading to false
    }
  };

  useEffect(() => {
    // check auth status then redirect to '/dashboard'
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  return { handleRegister, handleChange, fields, loading };
}

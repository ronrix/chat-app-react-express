import { useState, useEffect } from "react";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

export default function useFormLogin() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  // function to handle input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // function to hande onSubmit of the form
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // preven the default functionality of forms

    // validate input fields
    if (!fields.email.length || !fields.password.length) {
      toast.error("Please fill up email and password fields");
      return;
    }
    setLoading(true); // set the loading to true

    try {
      // fetch login api
      // get the data response
      const { data } = await axios.post("/signin", {
        email: fields.email,
        password: fields.password,
      });

      // redirect to dashboard if there is a token in the response
      if (data?.token) {
        // store the id to cookie using signIn function of 'react-auth-kit'
        signIn({
          token: data.token,
          expiresIn: 3600 * 2, // 2 hours expiration
          tokenType: "Bearer",
          authState: {
            email: fields.email,
            id: data.id,
            username: data.username,
            avatar: data.avatar,
          }, // store some data of the user to the cookie
        });

        setLoading(false); // set the loading to false

        // this redirects to the dashboard with loading the page, to refresh the cookies too
        // this prevents the redirecting loops from '/dashboard' to '/signin'
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.msg); // display the error

      // reset password fields
      setFields({ ...fields, password: "" });
      setLoading(false); // set the loading to false
    }
  };

  useEffect(() => {
    // check auth status then redirect to '/dashboard'
    if (isAuthenticated()) {
      return navigate("/dashboard");
    }
  }, []);

  return { loading, handleChange, handleLogin, fields };
}

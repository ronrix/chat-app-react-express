import Cookies from "universal-cookie";
import axios from "./axios";

 // get the user auth
export default async function GetUser() {
    try {
      const { data } = await axios.get("/user");
      if (data.msg === "Success") {
        return data.username;
      }
    } catch (error: any) {
      console.log(error);
      new Cookies().remove('userId'); // remove the userId
      new Cookies().remove('session'); // remove the session
      return false;
    }
  }

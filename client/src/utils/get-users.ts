import axios from "./axios";

// GET api to get the lists of users
export const GetListsOfUsers = async ({
  setUsers,
  setOriginalUsers,
  setLoading,
  signOut,
}: any) => {
  try {
    const { data } = await axios.get("/users");
    setLoading(false); // set the loading to false
    setOriginalUsers(data); // this can't be modified state
    setUsers(data);
  } catch (error: any) {
    if (error.response.status === 403) {
      // means the token has expired
      signOut(); // sign out or clear the cookies
    }
  }
};
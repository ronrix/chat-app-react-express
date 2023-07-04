import { useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "react-auth-kit";
import { MessageContext } from "./context/message.context";
import { DeleteContext } from "./context/delete.context";

const App = () => {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [chatUser, setChatUser] = useState<{
    id: string;
    username: string;
    roomId: string;
    isOnline: boolean;
  }>({
    id: "",
    username: "",
    roomId: "",
    isOnline: false,
  });
  return (
    <ThemeProvider>
      <AuthProvider
        authType='cookie'
        authName='_auth'
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <MessageContext.Provider value={{ chatUser, setChatUser }}>
          <DeleteContext.Provider value={{ isDelete, setIsDelete }}>
            <RouterProvider router={router} />
          </DeleteContext.Provider>
        </MessageContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

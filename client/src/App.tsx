import { useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "react-auth-kit";
import {
  MessageContext,
  MessageContextStateType,
} from "./context/message.context";
import { DeleteContext } from "./context/delete.context";

const App = () => {
  const [deleteData, setDeleteData] = useState<{
    isDeleting: boolean;
    messageId: string;
  }>({ isDeleting: false, messageId: "" });
  const [chatUser, setChatUser] = useState<MessageContextStateType>({
    id: "",
    username: "",
    roomId: "",
    isOnline: false,
    avatar: "",
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
          <DeleteContext.Provider value={{ deleteData, setDeleteData }}>
            <RouterProvider router={router} />
          </DeleteContext.Provider>
        </MessageContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

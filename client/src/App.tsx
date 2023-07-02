import { useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "react-auth-kit";
import UserContext from "./context/user.context";
import { MessageContext } from "./context/message.context";

// socket
import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  transports: ["websocket"],
});

const App = () => {
  const [user, setUser] = useState<{ username: string; id: string }>({
    username: "",
    id: "",
  });
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
        <UserContext.Provider value={{ user, setUser }}>
          <MessageContext.Provider value={{ chatUser, setChatUser }}>
            <RouterProvider router={router} />
          </MessageContext.Provider>
        </UserContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

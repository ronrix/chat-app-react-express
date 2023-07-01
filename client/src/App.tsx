import { useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "react-auth-kit";
import UserContext from "./context/user.context";

const App = () => {
  const [user, setUser] = useState<string>("");
  return (
    <ThemeProvider>
      <AuthProvider
        authType='cookie'
        authName='_auth'
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <UserContext.Provider value={{ user, setUser }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

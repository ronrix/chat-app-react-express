import { ThemeProvider } from "@material-tailwind/react";
import { useState } from "react";
import UserContext from "./context/user.context";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const App = () => {
  const [user, setUser] = useState<string>("");
  return (
    <ThemeProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </ThemeProvider>
  );
};

export default App;

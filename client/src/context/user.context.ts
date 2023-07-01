import { createContext } from "react";

export type UserContextType = { 
    user: { username: string; id: string }; 
    setUser: React.Dispatch<React.SetStateAction<{ username: string; id: string }>>
} 
const UserContext = createContext<UserContextType | null>(null);
export default UserContext;
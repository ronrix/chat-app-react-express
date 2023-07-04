import {createContext} from 'react';

export type DeleteContextType = {
    isDelete: boolean;
    setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
 }

// store user data for the chat composer
export const DeleteContext = createContext<DeleteContextType | null>(null);
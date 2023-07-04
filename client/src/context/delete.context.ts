import {createContext} from 'react';

export type DeleteContextType = {
    deleteData: { isDeleting: boolean, messageId: string };
    setDeleteData: React.Dispatch<React.SetStateAction<{ isDeleting: boolean, messageId: string }>>;
 }

// store user data for the chat composer
export const DeleteContext = createContext<DeleteContextType | null>(null);
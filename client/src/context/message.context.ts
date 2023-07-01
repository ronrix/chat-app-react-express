import {createContext} from 'react';

export type MessageContextType = {
    chatUser: { id: string; username: string; roomId: string; isOnline: boolean };
    setChatUser: React.Dispatch<React.SetStateAction<{
        id: string;
        username: string;
        roomId: string;
        isOnline: boolean;
    }>>;
 }

// store user data for the chat composer
export const MessageContext = createContext<MessageContextType | null>(null);
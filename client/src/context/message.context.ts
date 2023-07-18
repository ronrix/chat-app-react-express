import {createContext} from 'react';

export type MessageContextStateType = {
        id: string;
        username: string;
        roomId: string;
        isOnline: boolean;
        avatar: string;
        msgDocId: string;
        isGroupChat: boolean;
}

export type MessageContextType = {
    chatUser: MessageContextStateType,
    setChatUser: React.Dispatch<React.SetStateAction<MessageContextStateType>>;
 }

// store user data for the chat composer
export const MessageContext = createContext<MessageContextType | null>(null);
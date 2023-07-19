export interface IMessageType {
    _id: string;
    msg: string;
    sender: string;
    reactions: [];
    createdAt: string;
}

export interface IReaction { 
    _id: string; 
    reactor: { _id: string; username: string; avatar: string }; 
    reaction: string 
}
export interface IGroupChat {
    _id: string;
    groupName: string;
    messages: {msg: string; _id: string; reactions: []; isDeletedBy: []}[];
    groupAvatar: string;
    roomId: string;
    host: string;
    createdAt: string;
}
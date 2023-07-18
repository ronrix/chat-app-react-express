export interface Notifications {
    notifications: Notification[],
    user: string;
    createdAt: Date;
}

export interface Notification {
    inviter: { username: string; avatar: string };
    requestName: string;
    action?: boolean;
    groupChatDocId: string;
    _id: string;
}
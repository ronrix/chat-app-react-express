const GroupChatModel = require("../database/models/group.model");
const { FormatData } = require("../utils");

class GroupChatService {
    constructor() {
        this.group = new GroupChatModel();
    }

    // insert new message service
    async InsertMessage({roomId, msg, userId}) {
        try {
            const result = await this.group.Insert({roomId, msg, userId});
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    async CreateGroupChat({ name, members, roomId, userId }) {
        try {
            const result = await this.group.CreateNewGroupChat({name, members, roomId, userId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // get all groupchat messages
    async GetAllGroupChat({ userId }) {
        try {
            const result = await this.group.GetAll({ userId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // accept request invitation
    async AcceptRequest({ userId, docId, notifId }) {
        try {
            const result = await this.group.Accept({ userId, docId, notifId  });
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // accept request invitation
    async DeclineRequest({ userId, docId, notifId }) {
        try {
            const result = await this.group.Decline({ userId, docId, notifId  });
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // get messages by room id
    async GetMessagesByRoomId(roomId, userId) {
        try {
            const result = await this.group.GetMessagesByRoomId(roomId, userId);
            return FormatData(result);
        } catch (error) {
            throw new Error(error);
        }
    }

    // insert message reaction 
    async InsertReactionOnMsg({ docId, msgId, reaction }) {
        try {
            const result = await this.group.InsertReaction({ docId, msgId, reaction });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // delete message reaction
    async DeleteReactionOnMsg({ docId, msgId, reactionId }) {
        try {
            const result = await this.group.DeleteReaction({ docId, msgId, reactionId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // get the group chat members
    async GetMembersList({ userId, docId }) {
        try {
            const result = await this.group.GetMembers({ userId, docId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }

    // invite more people
    async InvitePeople({ people, docId, userId }) {
        try {
            const result = await this.group.Invite({ people, docId, userId });
            return FormatData(result);
        } catch (error) {
            throw new Error(error) ;
        }
    }
}

module.exports = GroupChatService;
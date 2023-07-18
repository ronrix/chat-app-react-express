const GroupChatModel = require("../database/models/group.model");
const { FormatData } = require("../utils");

class GroupChatService {
    constructor() {
        this.group = new GroupChatModel();
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
}

module.exports = GroupChatService;
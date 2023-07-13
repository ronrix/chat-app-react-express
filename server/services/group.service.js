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
}

module.exports = GroupChatService;
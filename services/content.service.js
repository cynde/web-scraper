const { content: contentModel } = require('../models');

class ContentService {
    static create = async (content) => {
        try {
            const { url, checksum } = content;
            const existingContent = await contentModel.find({ url }).sort({ createdAt: -1 });
            const latestContent = existingContent[0];
            if (latestContent) {
                if (latestContent.checksum === checksum) {
                    console.log(`Content document for ${url} exists and nothing is changed (Same checksum)`);
                    return latestContent;
                }
                console.log(`Content for ${url} has changed (New Content document is created with checksum: ${newChecksum})`);
                return await contentModel.create(content);
            }
            console.log(`New Content document for ${url} is created`);
            return await contentModel.create(content);
        } catch (error) {
            throw('Error creating Content document:', error);
        }
    };
}

module.exports = ContentService;
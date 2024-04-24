const { content: contentModel } = require('../models');

class ContentService {
    static create = async (content) => {
        return await contentModel.create(content);
    };
}

module.exports = ContentService;
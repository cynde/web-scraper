const { website: websiteModel } = require('../models');

class WebsiteService {
    static create = async (website) => {
        return await websiteModel.create(website);
    };

    static findOneByUrl = async (url) => {
        return await websiteModel.findOne({ url });
    }
}

module.exports = WebsiteService;
const { website } = require('../models');

class WebsiteService {
    static create = async (name, url, description) => {
        return await website.create({ name, url, description });
    };

    static findOneByUrl = async (url) => {
        return await website.findOne({ url });
    }
}

module.exports = WebsiteService;
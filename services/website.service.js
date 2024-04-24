const { website: websiteModel } = require('../models');

class WebsiteService {
    static create = async (website) => {
        return await websiteModel.create(website);
    };

    static findOneByUrl = async (url) => {
        return await websiteModel.findOne({ url });
    };

    static addJobById = async (id, newJobId) => {
        const { jobs } = await websiteModel.findById(id);
        const existingJobs = jobs || [];
        await websiteModel.updateOne({ _id: id }, { $set: { jobs: [...existingJobs, newJobId] } });
    };

    static addContentById = async (id, newContentId) => {
        const { content } = await websiteModel.findById(id);
        const existingContent = content || [];
        await websiteModel.updateOne({ _id: id }, { $set: { content: [...existingContent, newContentId] } });
    };
}

module.exports = WebsiteService;
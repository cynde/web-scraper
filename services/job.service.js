const { job: jobModel } = require('../models');

class JobService {
    static create = async (job) => {
        return await jobModel.create(job);
    };

    static updateProgressById = async (id, newProgress) => {
        await jobModel.updateOne({ _id: id }, { $set: { progress: newProgress } })
    };

    static addScrapedPage = async (id, scrapedPage) => {
        const { pages } = await jobModel.findById(id);
        const existingPages = pages || [];
        await jobModel.updateOne({ _id: id }, {$set: { pages: [...existingPages, scrapedPage] } })
    };

    static updateStatusById = async (id, newStatus) => {
        await jobModel.updateOne({ _id: id }, { $set: { status: newStatus } });
    };

    static updateErrorById = async (id, newError) => {
        await jobModel.updateOne({ _id: id }, { $set: { error: newError } });
    };

    static updateEndTimeById = async (id) => {
        await jobModel.updateOne({ _id: id }, { $set: { endTime: new Date() } });
    };
}

module.exports = JobService;
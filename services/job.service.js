const { job: jobModel } = require('../models');

class JobService {
    static create = async (job) => {
        return await jobModel.create(job);
    };
}

module.exports = JobService;
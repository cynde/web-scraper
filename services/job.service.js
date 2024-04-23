const { Job } = require('./models');

const create = async (job) => {
    return await Job.create(job);
};

module.exports = {
    create
}
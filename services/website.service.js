const { Website } = require('./models');

const create = async (website) => {
    return await Website.create(website);
};

module.exports = {
    create
}
const { Content } = require('./models');

const create = async (content) => {
    return await Content.create(content);
};

module.exports = {
    create
}
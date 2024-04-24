const WebsiteService = require('./website.service.js');
const JobService = require('./job.service.js');
const ContentService = require('./content.service.js');

const services = {};
services.website = WebsiteService; 
services.job = JobService;  
services.content = ContentService;  

module.exports = services;
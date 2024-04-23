const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const { Website } = require("./website.model.js");
const { Job } = require("./job.model.js");
const { Content } = require("./content.model.js");

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
//db.temperature = require("./sensor/temp.model.js")(mongoose);
db.website = Website; 
db.job = Job;  
db.content = Content;  

module.exports = db;
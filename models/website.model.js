
const { Schema, model } = require('mongoose');

const websiteSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	url: String,
	description: String,  
	jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
	content: [{ type: Schema.Types.ObjectId, ref: 'Content' }]
});

const Website = model('Website', websiteSchema);

module.exports = { Website, websiteSchema}; 

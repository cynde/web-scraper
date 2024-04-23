const { Schema, model } = require('mongoose');

const contentSchema = new Schema({
    url:String, 
    refNo: String, 
    title: String, 
	contentType: String, 
    documentType: {
        type: String, 
        enum:['pdf', 'html', 'docx', 'json']
    },
    parentDocument: { type: Schema.Types.ObjectId, ref: 'Content' }, 
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    website:{ type: Schema.Types.ObjectId, ref: 'Website' },
    content: String,
    date: Date, 
    checksum: String
}
);


const Content = model('Content', contentSchema);

module.exports = { Content, contentSchema}; 
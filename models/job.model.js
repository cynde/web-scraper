
const { Schema, model } = require('mongoose');



const jobSchema = new Schema({
  website:{ type: Schema.Types.ObjectId, ref: 'Website' },
  startTime: { type: Date, default: Date.now }, 
  endTime: Date, 
  status: {
    type : String,
    enum : ["ongoing", "stopped", "finished", "error"],
    default: "ongoing"
  },
  error: {
        code: String,
        message: String
  }, 
  links: [{
    type: Schema.Types.Mixed,
    default: {}
  }],
  progress : {
    phase: {
      type: String, 
      enum : ["links", "pages"],
      default: "links"
    },
    current: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  pages: Array
});


const Job = model('Job', jobSchema);

module.exports = { Job, jobSchema}; 

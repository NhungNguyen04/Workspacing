const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: { type: String, required: true, default: 'Basic board' },
  backgroundImg: {type: String, required: true, default: 'https://images/unsplash.com/photo-123456'},
  teamspace: {type: mongoose.Schema.Types.ObjectId, ref: 'Teamspace'},
  columns: [{
    columnId: {type: mongoose.Schema.Types.ObjectId, ref: 'Column'},
    columnName: { type: String, required: true },
    tasks: [{
     taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
     taskName: { type: String, required: true}
    }],
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String},
  category: { type: String, enum: ['Work', 'Personal', 'Urgent'], default: 'Personal' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedTo: [{type: Schema.Types.ObjectId, ref: 'User'}],
  belongTo: {type: Schema.Types.ObjectId, ref: 'Teamspace'},
  boardId: {type: Schema.Types.ObjectId, ref: 'Board'},
  columnId: {type: Schema.Types.ObjectId, ref: 'Column'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

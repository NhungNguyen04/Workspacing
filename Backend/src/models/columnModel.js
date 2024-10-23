const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnSchema = new Schema({
  name: { type: String, required: true, default: 'Untitled' },
  boardId: { type: Number },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  display:  {type: Boolean, default: true},
  isDeletable: { type: Boolean, default: true}

}, { timestamps: true });

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;

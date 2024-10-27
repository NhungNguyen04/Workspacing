const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnSchema = new Schema({
  name: { type: String, required: true, default: 'Untitled' },
  boardId: { type: Schema.Types.ObjectId, ref: 'Board'},
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  display:  {type: Boolean, default: true},
  isDeletable: { type: Boolean, default: true}

}, { timestamps: true });

const Column = mongoose.model('Column', columnSchema);
module.exports = Column;

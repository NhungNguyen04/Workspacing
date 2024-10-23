const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamspaceSchema = new Schema({
  id: {type: Number, autoIncrement: true},
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Reference to owner of the teamspace
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], // Members of the teamspace
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Tasks belonging to the teamspace
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  avatar: { type: String },
  violateRule: {type: Boolean, default: false},
}, { timestamps: true });

const Teamspace = mongoose.model('Teamspace', teamspaceSchema);
module.exports = Teamspace;

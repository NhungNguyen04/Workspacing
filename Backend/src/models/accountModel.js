const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  id: {type: Number, autoIncrement: true},
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true},
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Reference to tasks created by the user
  isAdmin: { type: Boolean, default: false },
  violateRule: { type: Boolean, default: false },
  teamspaces_owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teamspace'}], // Reference to teamspace owned by the user
  teamspaces_member: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teamspace'}], // Reference to teamspace members of the user
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;

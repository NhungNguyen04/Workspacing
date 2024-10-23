const moongoose = require('mongoose');
const schema = require('moongoose').Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    account: {
        type: schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    task: {
        type: schema.Types.ObjectId,
        ref: 'Task',
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
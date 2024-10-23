const Task = require('../models/taskModel');
const Account = require('../models/accountModel');
const Teamspace = require('../models/teamspaceModel');

exports.assignTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // Update each account's tasks array
      const updatedTask = await task.save();
      for (const accountId of req.body.assignedTo) {
        const account = await Account.findById(accountId);
        if (account) {
          account.tasks.push(task._id);
          await account.save();
        }
      }
       // Update each teamspace's tasks array
      for (const teamspaceId of task.belongTo) {
        const teamspace = await Teamspace.findById(teamspaceId);
        if (teamspace) {
          teamspace.tasks.push(task._id);
          await teamspace.save();
        }
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error assigning task', error });
    }
};

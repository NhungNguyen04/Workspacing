const Teamspace = require('../models/teamspaceModel');

// Create a new teamspace
exports.createTeamspace = async (req, res) => {
  try {
    const newTeamspace = new Teamspace({
      ...req.body, // name, description, etc.
      owner: req.user._id, // Assuming the user creating it is the owner
      members: [req.user._id], // Add the owner as the first member
    });
    const savedTeamspace = await newTeamspace.save();
    res.status(201).json(savedTeamspace);
  } catch (error) {
    res.status(500).json({ message: 'Error creating teamspace', error });
  }
};

// Get all teamspaces
exports.getAllTeamspaces = async (req, res) => {
  try {
    const teamspaces = await Teamspace.find()
      .populate('owner members tasks');
    res.status(200).json(teamspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teamspaces', error });
  }
};

// Get teamspace by ID
exports.getTeamspaceById = async (req, res) => {
  try {
    const teamspace = await Teamspace.findById(req.params.id)
      .populate('owner members tasks');
    if (!teamspace) {
      return res.status(404).json({ message: 'Teamspace not found' });
    }
    res.status(200).json(teamspace);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teamspace', error });
  }
};

// Update teamspace details
exports.updateTeamspace = async (req, res) => {
  try {
    const updatedTeamspace = await Teamspace.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('owner members tasks');
    if (!updatedTeamspace) {
      return res.status(404).json({ message: 'Teamspace not found' });
    }
    res.status(200).json(updatedTeamspace);
  } catch (error) {
    res.status(500).json({ message: 'Error updating teamspace', error });
  }
};

// Delete teamspace
exports.deleteTeamspace = async (req, res) => {
  try {
    const deletedTeamspace = await Teamspace.findByIdAndDelete(req.params.id);
    if (!deletedTeamspace) {
      return res.status(404).json({ message: 'Teamspace not found' });
    }
    res.status(200).json({ message: 'Teamspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teamspace', error });
  }
};

// Add a member to teamspace
exports.addMemberToTeamspace = async (req, res) => {
  try {
    const teamspace = await Teamspace.findById(req.params.teamspaceId);
    if (!teamspace.members.includes(req.body.memberId)) {
      teamspace.members.push(req.body.memberId);
      await teamspace.save();
      res.status(200).json(teamspace);
    } else {
      res.status(400).json({ message: 'Member already in teamspace' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding member to teamspace', error });
  }
};

// Remove a member from teamspace
exports.removeMemberFromTeamspace = async (req, res) => {
  try {
    const teamspace = await Teamspace.findById(req.params.teamspaceId);
    const memberIndex = teamspace.members.indexOf(req.body.memberId);
    if (memberIndex > -1) {
      teamspace.members.splice(memberIndex, 1);
      await teamspace.save();
      res.status(200).json(teamspace);
    } else {
      res.status(400).json({ message: 'Member not found in teamspace' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing member from teamspace', error });
  }
};

const Account = require('../models/accountModel');
const bcrypt = require('bcryptjs');

// Create new account (signup)
exports.createAccount = async (req, res) => {
  try {
    let newAccount;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newAccount = new Account({
    ...req.body, // name, email, etc.
    password: hashedPassword
    });
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
};

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find()
      .populate('tasks teamspaces_owner teamspaces_member');
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
};

// Get account details
exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.user._id).populate('tasks teamspaces_owner teamspaces_member'); // Assuming req.user contains the authenticated user ID
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account', error });
  }
};

// Update account details
exports.updateAccount = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.body.password) {
      updatedData.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedAccount = await Account.findByIdAndUpdate(req.user._id, updatedData, { new: true });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: 'Error updating account', error });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error });
  }
};

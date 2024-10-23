const Board = require('../models/boardModel');
const Column = require('../models/columnModel');
const Task = require('../models/taskModel');
// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const board = new Board(req.body);
    const toDoCreate = new Column({name: 'To Do', boardId: board._id});
    const inProgressCreate = new Column({name: 'In Progress', boardId: board._id});
    const doneCreate = new Column({name: 'Done', boardId: board._id});
    board.columns.push(toDoCreate, doneCreate, inProgressCreate);
    board.contents.push({columnName: toDoCreate.name, items: []});
    board.contents.push({columnName: inProgressCreate.name, items: []});
    board.contents.push({columnName: doneCreate.name, items: []});
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all boards
exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find().populate('teamspace').populate('columns');
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single board by ID
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('teamspace').populate('columns');
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a board by ID
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a board by ID
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addColumn = async (req, res) => {
  try {
    const boardId = req.params.id;
    const newColumn = new Column();

    const board = await Board.findById(boardId);
    board.contents.push({ columnName:newColumn.name, items: [] }); // Assuming contents is an array of objects with columnId and items

    res.status(200).json({ message: 'Column added successfully', board });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addTask = async (req, res) => {
  try {
    const boardId = req.params.id;
    const pos = req.params.pos;
    const newTaskName = req.body;
    const board = await Board.findById(boardId);
    const newTask = new Task({ name: newTaskName, boardId: boardId, columnId: board.contents[pos].columnId});

    board.contents[pos].items.push(newTaskName);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
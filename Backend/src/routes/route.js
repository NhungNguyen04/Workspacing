'use strict';
const cors = require('cors');


module.exports = function(app) {
  const taskController = require('../controllers/taskController');
  const accountController = require('../controllers/accountController');
  const teamspaceController = require('../controllers/teamspaceController');
  const taskAssignController = require('../controllers/taskAssignController');
  const boardController = require('../controllers/boardController');

  app.use(cors());
  // Task Routes
  app.route('/tasks')
    .get(taskController.getAllTasks)
    .post(taskController.createTask);

  app.route('/tasks/:userId')
    .get(taskController.getTasksByUser)
    
  app.route('/tasks/:taskId')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

  // Account Routes
  app.route('/accounts')
    .post(accountController.createAccount)
    .get(accountController.getAllAccounts);

  app.route('/accounts/:accountId')
    .get(accountController.getAccount)
    .put(accountController.updateAccount)
    .delete(accountController.deleteAccount);

  // Teamspace Routes
  app.route('/teamspaces')
    .get(teamspaceController.getAllTeamspaces)
    .post(teamspaceController.createTeamspace);

  app.route('/teamspaces/:teamspaceId')
    .get(teamspaceController.getTeamspaceById)
    .put(teamspaceController.updateTeamspace)
    .delete(teamspaceController.deleteTeamspace);

  app.route('/teamspaces/:teamspaceId/members')
    .post(teamspaceController.addMemberToTeamspace)
    .delete(teamspaceController.removeMemberFromTeamspace);

  app.route('/assign')
    .post(taskAssignController.assignTask);

  app.route('/board')
    .post(boardController.createBoard)
    .get(boardController.getAllBoards);
  
  app.route('/board/:id')
   .get(boardController.getBoardById)
   .put(boardController.updateBoard)
   .delete(boardController.deleteBoard);
};
const User = require("../database/model/user.model");
const Task = require("../database/model/task.model");

const addTask = async (req, res) => {
  const { task, id } = req.body;

  try {
    if (!task) return res.status(400).send('Please enter the task');
    
    if (task.length < 3) {
      return res.status(400).send('Add a minimum of 3 characters');
    }

    const taskDetail = new Task({
      task,
      cretedBy: id,
    });

    await taskDetail.save();
    return res.status(200).send(taskDetail);
  } catch (error) {
    return res.status(400).send('Task addition failed');
  }
};

const getAllTasks = async (req, res) => {
  const { id } = req.query;
  try {
    let tasklist = await Task.find({ cretedBy: id });
    return res.status(200).send(tasklist);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const editTask = async (req, res) => {
  // Implement the editTask logic here if needed.
};

const statusChange = async (req, res) => {
  const { id, string } = req.body;

  try {
    let task = await Task.findById({ _id: id });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    if (string === 'right') {
      if (task.status === 'backlog') {
        task.status = 'todo';
      } else if (task.status === 'todo') {
        task.status = 'doing';
      } else if (task.status === 'doing') {
        task.status = 'done';
      }
    } else {
      if (task.status === 'done') {
        task.status = 'doing';
      } else if (task.status === 'doing') {
        task.status = 'todo';
      } else if (task.status === 'todo') {
        task.status = 'backlog';
      }
    }

    await task.save(); // Save changes to the task
    return res.send(task);
  } catch (error) {
    return res.status(500).send('Error updating task status');
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    let response = await Task.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).send('Task not found');
    }
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send('Delete failed');
  }
};

module.exports = {
  addTask,
  getAllTasks,
  editTask,
  statusChange,
  deleteTask,
};

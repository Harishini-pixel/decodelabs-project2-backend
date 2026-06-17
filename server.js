const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Use JSON middleware to parse JSON request bodies.
app.use(express.json());

// In-memory array to store tasks.
let tasks = [];
let nextId = 1;

// GET /api/tasks
// Returns the list of all tasks.
app.get('/api/tasks', (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/tasks
// Creates a new task. Title is required.
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
      id: nextId++,
      title: title.trim(),
      description: description.toString(),
      status: status.toString()
    };

    tasks.push(task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/tasks/:id
// Updates an existing task by ID. Title is required.
app.put('/api/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, status } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      title: title.trim(),
      description: description !== undefined ? description.toString() : tasks[taskIndex].description,
      status: status !== undefined ? status.toString() : tasks[taskIndex].status
    };

    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/tasks/:id
// Removes a task by ID.
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generic 404 fallback for unsupported routes.
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Student Task Manager API is running on http://localhost:${port}`);
});

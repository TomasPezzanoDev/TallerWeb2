const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Almacenamiento en memoria
let tasks = [];

// Rutas de la API CRUD
app.get('/tasks', (req, res) => res.json(tasks)); // Obtener todas las tareas
app.post('/tasks', (req, res) => { // Crear nueva tarea
  const task = { id: tasks.length + 1, ...req.body, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});
app.put('/tasks/:id', (req, res) => { // Actualizar tarea
  const task = tasks.find(t => t.id == req.params.id);
  if (task) {
    task.title = req.body.title;
    task.description = req.body.description;
    task.completed = req.body.completed;
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});
app.delete('/tasks/:id', (req, res) => { // Eliminar tarea
  tasks = tasks.filter(t => t.id != req.params.id);
  res.status(204).send();
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));

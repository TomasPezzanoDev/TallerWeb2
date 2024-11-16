const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todo_app",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Rutas de la API CRUD
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.json(results);
    }
  });
});
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";
  db.query(query, [title, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to add task" });
    } else {
      res
        .status(201)
        .json({ id: result.insertId, title, description, completed: false });
    }
  });
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const query =
    "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";
  db.query(query, [title, description, completed, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to update task" });
    } else {
      res.json({ id, title, description, completed });
    }
  });
});

app.patch("/tasks/:id/completed", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const query = "UPDATE tasks SET completed = ? WHERE id = ?";
  db.query(query, [completed, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating task status");
    } else {
      res.send({ id, completed });
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete task" });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));

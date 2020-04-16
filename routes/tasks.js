const { Router } = require("express");
const { Tasks } = require("../db");

const route = Router();

// notes route
const noteRoute = require("./notes");
route.use("/:id/notes", noteRoute);

route.get("/", async (req, res) => {
  const tasks = await Tasks.findAll({
    attributes: ["id", "title", "description", "date", "priority", "state"],
  });
  res.send(tasks);
});

route.get("/:id", async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: "task Id must be an integer",
    });
  }
  const task = await Tasks.findByPk(req.params.id, {
    attributes: ["id", "title", "description", "date", "priority", "state"],
  });
  if (!task) {
    return res.status(404).send({
      error: "No task found with id = " + req.params.id,
    });
  }
  res.send(task);
});

route.post("/", async (req, res) => {
  if (typeof req.body.title !== "string") {
    return res.status(400).send({
      error: "Title not provided",
    });
  }

  const newTask = await Tasks.create({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    priority: req.body.priority,
    state: "incomplete",
  });
  res.status(201).send({ success: "New Task added", data: newTask });
});

route.patch("/:id", async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: "task Id must be an integer",
    });
  }
  const task = await Tasks.findByPk(req.params.id);
  if (!task) {
    return res.status(404).send({
      error: "No task found with id = " + req.params.id,
    });
  }
  if (typeof req.body.date !== "undefined") {
    task.date = req.body.date;
  }
  if (typeof req.body.state !== "undefined") {
    task.state = req.body.state;
  }
  if (typeof req.body.priority !== "undefined") {
    task.priority = req.body.priority;
  }

  await task.save();
  res.status(200).send({ success: "Updated Task", data: task });
});

module.exports = route;

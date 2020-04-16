const { Router } = require("express");
const { Tasks, Notes } = require("../db");

const route = Router({ mergeParams: true });

route.get("/", async (req, res) => {
  const notes = await Notes.findAll({
    where: { taskId: req.params.id },
    attributes: ["note"],
  });
  if (notes.length === 0) {
    return res
      .status(404)
      .send({ error: "No notes defined for task " + req.params.id });
  }
  res.send(notes);
});

route.post("/", async (req, res) => {
  if (typeof req.body.note !== "string") {
    return res.status(400).send({
      error: "Note not provided",
    });
  }
  const newNote = await Notes.create({
    note: req.body.note,
    taskId: req.params.id,
  });
  res.status(201).send({ success: "New Note added", data: newNote });
});

module.exports = route;

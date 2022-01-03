const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const Task = require("../models/task");
const User = require("../models/user");

//Creating users tasks
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

//Getting single user tasks
router.get("/tasks", auth, async (req, res) => {
  const _id = req.user.id;
  try {
    const user = await User.findById(_id);
    await user.populate("tasks");
    if (!user) {
      return res.status(404).send();
    }
    res.send(user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Updating users tasks
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    await task.save();

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Deleting users tasks
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;

const express = require("express")
const router = express.Router()
const Task = require("../models/Task")

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    console.log("GET ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// CREATE task
router.post("/", async (req, res) => {
  try {
    const task = new Task({ title: req.body.title })
    await task.save()
    res.json(task)
  } catch (err) {
    console.log("POST ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// UPDATE task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(task)
  } catch (err) {
    console.log("PUT ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
})

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.json({ msg: "deleted" })
  } catch (err) {
    console.log("DELETE ERROR:", err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
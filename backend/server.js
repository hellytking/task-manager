const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const taskRoutes = require("./routes/taskRoutes")
app.use("/tasks", taskRoutes)

// ✅ Safe debug (does NOT expose password)
console.log("MONGO_URI exists:", !!process.env.MONGO_URI)

// ✅ Start server only after DB connects
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB connected")

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () =>
      console.log("Server running on port " + PORT)
    )
  } catch (err) {
    console.log("DB ERROR:", err.message)
  }
}

startServer()

app.get("/", (req, res) => {
  res.send("API working")
})
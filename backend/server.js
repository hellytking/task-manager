const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

app.use(cors())
app.use(express.json())

const taskRoutes = require("./routes/taskRoutes")
app.use("/tasks", taskRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected"))
.catch(err => console.log(err))

app.get("/", (req, res) => {
  res.send("API working")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port " + PORT))
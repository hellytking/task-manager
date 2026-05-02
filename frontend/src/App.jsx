import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const API = "http://localhost:5000/tasks"

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await axios.get(API)
      setTasks(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!title.trim()) return
    try {
      setLoading(true)
      await axios.post(API, { title })
      setTitle("")
      fetchTasks()
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`${API}/${id}`)
      fetchTasks()
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const toggleTask = async (task) => {
    try {
      setLoading(true)
      await axios.put(`${API}/${task._id}`, {
        completed: !task.completed
      })
      fetchTasks()
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const clearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed)
    try {
      setLoading(true)
      for (let t of completedTasks) {
        await axios.delete(`${API}/${t._id}`)
      }
      fetchTasks()
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const completed = tasks.filter(t => t.completed).length

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        width: "380px",
        padding: "25px",
        borderRadius: "12px",
        background: "#111",
        boxShadow: `
          0 10px 30px rgba(0,0,0,0.2),
          inset 0 0 15px rgba(255,255,255,0.05)
        `,
        color: "white"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Task Manager
        </h2>

        <p style={{ textAlign: "center", color: "#aaa", marginBottom: "15px" }}>
          {tasks.length} tasks • {completed} completed
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #333",
              background: "#000",
              color: "white"
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              border: "none",
              background: "#fff",
              color: "#000",
              cursor: "pointer",
              transition: "0.2s"
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.8}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "14px",
          color: "#ccc"
        }}>
          <span style={{ cursor: "pointer" }} onClick={() => setFilter("all")}>All</span>
          <span style={{ cursor: "pointer" }} onClick={() => setFilter("active")}>Active</span>
          <span style={{ cursor: "pointer" }} onClick={() => setFilter("completed")}>Completed</span>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>
        )}

        {/* Tasks */}
        {!loading && (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {filteredTasks.length === 0 && (
              <p style={{ textAlign: "center", color: "#666" }}>No tasks</p>
            )}

            {filteredTasks.map(task => (
              <li key={task._id} style={{
                background: "#000",
                border: "1px solid #222",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span
                  onClick={() => toggleTask(task)}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none"
                  }}
                >
                  {task.title}
                </span>

                <button
                  onClick={() => deleteTask(task._id)}
                  style={{
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.opacity = 0.7}
                  onMouseOut={(e) => e.target.style.opacity = 1}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Clear Completed */}
        {completed > 0 && !loading && (
          <button
            onClick={clearCompleted}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "10px",
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s"
            }}
            onMouseOver={(e) => e.target.style.opacity = 0.8}
            onMouseOut={(e) => e.target.style.opacity = 1}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  )
}

export default App
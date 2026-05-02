import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  // 🔥 FIXED: Works for local + deployed
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/tasks"

  // ✅ Fetch tasks (no React warning now)
  useEffect(() => {
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

    fetchTasks()
  }, [API])

  const addTask = async () => {
    if (!title.trim()) return
    try {
      setLoading(true)
      await axios.post(API, { title })
      setTitle("")
      const res = await axios.get(API)
      setTasks(res.data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      setLoading(true)
      await axios.delete(`${API}/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = async (task) => {
    try {
      await axios.put(`${API}/${task._id}`, {
        completed: !task.completed
      })
      setTasks(tasks.map(t =>
        t._id === task._id ? { ...t, completed: !t.completed } : t
      ))
    } catch (err) {
      console.log(err)
    }
  }

  const clearCompleted = async () => {
    try {
      setLoading(true)
      const completedTasks = tasks.filter(t => t.completed)

      await Promise.all(
        completedTasks.map(t => axios.delete(`${API}/${t._id}`))
      )

      setTasks(tasks.filter(t => !t.completed))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

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
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        color: "white"
      }}>
        <h2 style={{ textAlign: "center" }}>Task Manager</h2>

        <p style={{ textAlign: "center", color: "#aaa" }}>
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
            disabled={!title.trim()}
            style={{
              padding: "10px",
              borderRadius: "6px",
              background: "#fff",
              color: "#000",
              cursor: "pointer",
              opacity: title.trim() ? 1 : 0.5
            }}
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          color: "#ccc"
        }}>
          {["all", "active", "completed"].map(f => (
            <span
              key={f}
              onClick={() => setFilter(f)}
              style={{
                cursor: "pointer",
                fontWeight: filter === f ? "bold" : "normal",
                color: filter === f ? "#fff" : "#888"
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </span>
          ))}
        </div>

        {/* Loading */}
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

        {/* Tasks */}
        {!loading && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTasks.length === 0 && (
              <p style={{ textAlign: "center", color: "#666" }}>
                No tasks yet 🚀
              </p>
            )}

            {filteredTasks.map(task => (
              <li key={task._id} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                background: "#000",
                border: "1px solid #222",
                borderRadius: "6px"
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
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ✕
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
              width: "100%",
              padding: "10px",
              background: "#fff",
              color: "#000",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  )
}

export default App
import { useState } from "react";

export default function TodoBasic() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (!task.trim()) return;
    setTasks((prev) => [...prev, task.trim()]);
    setTask("");
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Todo (Basic useState)</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="พิมพ์งานที่ต้องทำ..."
        style={{ marginRight: 8 }}
      />
      <button onClick={addTask}>Add</button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {tasks.map((t, index) => (
          <li key={index} style={{ margin: "6px 0" }}>
            {t}
            <button onClick={() => deleteTask(index)} style={{ marginLeft: 10, color: "red" }}>
              ลบ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


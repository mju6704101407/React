import { useState } from "react";

type Task = {
  title: string;
  type: string;
  dueDate: string; // YYYY-MM-DD
};

export default function TodoExtended() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (!title.trim()) return;
    setTasks((prev) => [...prev, { title: title.trim(), type, dueDate }]);
    setTitle("");
    setType("");
    setDueDate("");
  };

  const deleteTask = (idx: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h2>Todo (Extended fields)</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="พิมพ์งานที่ต้องทำ..."
        style={{ marginRight: 6 }}
      />
      <select value={type} onChange={(e) => setType(e.target.value)} style={{ marginRight: 6 }}>
        <option value="">เลือกประเภทงาน</option>
        <option value="เรียน">เรียน</option>
        <option value="ทำงาน">ทำงาน</option>
        <option value="บ้าน">งานบ้าน</option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ marginRight: 6 }} />
      <button onClick={addTask}>Add</button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {tasks.map((t, idx) => (
          <li key={idx} style={{ margin: "8px 0" }}>
            <strong>{t.title}</strong>
            {t.type && <> | ประเภท: {t.type}</>}
            {t.dueDate && <> | ส่งภายใน: {t.dueDate}</>}
            <button onClick={() => deleteTask(idx)} style={{ marginLeft: 10, color: "red" }}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


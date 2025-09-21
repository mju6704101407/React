import { useState } from "react";
import { useForm } from "react-hook-form";

type Task = {
  title: string;
  type: string;
  dueDate: string;
};

export default function TodoRHF() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Task>({ defaultValues: { title: "", type: "", dueDate: "" } });

  const onAdd = (data: Task) => {
    if (!data.title.trim()) return;
    setTasks((prev) => [...prev, data]);
    reset();
  };

  const deleteTask = (idx: number) => setTasks((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <h2>Todo (React Hook Form)</h2>
      <form onSubmit={handleSubmit(onAdd)} noValidate>
        <input
          placeholder="งานที่ต้องทำ"
          {...register("title", { required: "กรุณากรอกชื่องาน" })}
          style={{ marginRight: 6 }}
        />
        {errors.title && <span style={{ color: "crimson", fontSize: 12 }}>{errors.title.message}</span>}

        <select {...register("type")} style={{ marginRight: 6 }}>
          <option value="">เลือกประเภทงาน</option>
          <option value="เรียน">เรียน</option>
          <option value="ทำงาน">ทำงาน</option>
          <option value="บ้าน">งานบ้าน</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>

        <input type="date" {...register("dueDate")} style={{ marginRight: 6 }} />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {tasks.map((t, idx) => (
          <li key={idx} style={{ margin: "8px 0" }}>
            <strong>{t.title}</strong>
            {t.type && ` | ประเภท: ${t.type}`}
            {t.dueDate && ` | ส่ง: ${t.dueDate}`}
            <button onClick={() => deleteTask(idx)} style={{ marginLeft: 10, color: "red" }}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


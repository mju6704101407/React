import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const TaskSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่องาน"),
  type: z.enum(["เรียน", "ทำงาน", "บ้าน", "อื่นๆ"]).optional().or(z.literal("")),
  dueDate: z
    .string()
    .regex(/^$|^\d{4}-\d{2}-\d{2}$/i, "รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)"),
});

type Task = z.infer<typeof TaskSchema>;

export default function TodoRHFZod() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Task>({
    resolver: zodResolver(TaskSchema),
    defaultValues: { title: "", type: "", dueDate: "" },
    mode: "onSubmit",
  });

  const onAdd = (data: Task) => {
    setTasks((prev) => [...prev, data]);
    reset();
  };

  const deleteTask = (idx: number) => setTasks((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <h2>Todo (RHF + Zod)</h2>
      <form onSubmit={handleSubmit(onAdd)} noValidate>
        <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input placeholder="งานที่ต้องทำ" {...register("title")} />
            {errors.title && <span style={{ color: "crimson", fontSize: 12 }}>{errors.title.message}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select {...register("type")}>
              <option value="">เลือกประเภทงาน</option>
              <option value="เรียน">เรียน</option>
              <option value="ทำงาน">ทำงาน</option>
              <option value="บ้าน">งานบ้าน</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
            {errors.type && <span style={{ color: "crimson", fontSize: 12 }}>{errors.type.message}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input type="date" {...register("dueDate")} />
            {errors.dueDate && <span style={{ color: "crimson", fontSize: 12 }}>{errors.dueDate.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting}>Add</button>
        </div>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {tasks.map((t, idx) => (
          <li key={idx} style={{ margin: "8px 0" }}>
            {t.title}
            {t.type && ` | ประเภท: ${t.type}`}
            {t.dueDate && ` | ส่ง: ${t.dueDate}`}
            <button onClick={() => deleteTask(idx)} style={{ marginLeft: 10, color: "red" }}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


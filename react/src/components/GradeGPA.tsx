import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema สำหรับตรวจสอบความถูกต้องของข้อมูล
const GradeSchema = z.object({
  subject: z.string().trim().min(1, "กรุณากรอกชื่อวิชา"),
  grade: z.enum(["A", "B+", "B", "C+", "C", "D+", "D", "F", "W"], {
    required_error: "กรุณาเลือกเกรด",
  }),
});

type GradeForm = z.infer<typeof GradeSchema>;

type RecordItem = {
  subject: string;
  grade: GradeForm["grade"];
};

// แปลงเกรดเป็นคะแนน (W ไม่นับใน GPA)
const gradePoint: Record<RecordItem["grade"], number | null> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
  W: null,
};

export default function GradeGPA() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [gpa, setGpa] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradeForm>({
    resolver: zodResolver(GradeSchema),
    defaultValues: { subject: "", grade: "A" },
    mode: "onSubmit",
  });

  const onAdd = (data: GradeForm) => {
    setRecords((prev) => [...prev, data]);
    reset({ subject: "", grade: "A" });
  };

  const onDelete = (idx: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };

  const calcGPA = () => {
    let sum = 0;
    let count = 0;
    for (const r of records) {
      const p = gradePoint[r.grade];
      if (p !== null) {
        sum += p;
        count += 1;
      }
    }
    setGpa(count === 0 ? null : sum / count);
  };

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>จัดการรายวิชาและคำนวณ GPA</h2>

      <form
        onSubmit={handleSubmit(onAdd)}
        noValidate
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 220 }}>
          <input placeholder="ชื่อวิชา (เช่น Programming)" {...register("subject")} />
          {errors.subject && (
            <span style={{ color: "crimson", fontSize: 12 }}>{errors.subject.message}</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: 120 }}>
          <select {...register("grade")}>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
            <option value="W">W</option>
          </select>
          {errors.grade && (
            <span style={{ color: "crimson", fontSize: 12 }}>{errors.grade.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>เพิ่มรายวิชา</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {records.map((r, idx) => (
          <li
            key={idx}
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
          >
            <span
              style={{
                fontWeight: "bold",
                color: r.grade === "F" ? "red" : "inherit",
              }}
            >
              {r.subject}
            </span>
            <span style={{ opacity: 0.8 }}>({r.grade})</span>
            <button onClick={() => onDelete(idx)} style={{ marginLeft: "auto", color: "red" }}>
              ลบ
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={calcGPA} disabled={records.length === 0}>
          คำนวณ GPA
        </button>
        <span>
          GPA: <strong>{gpa === null ? "-" : gpa.toFixed(2)}</strong>
        </span>
        <span style={{ opacity: 0.7 }}>(ไม่นับ W, F = 0.00)</span>
      </div>
    </div>
  );
}


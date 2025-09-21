import { useState } from "react";

export default function Practice1() {
  const uni = "CSMJU";
  const note = "สอบเสร็จแล้ว สบายใจจัง";
  const status = false; // true = เขียว, false = แดง

  const [count, setCount] = useState(0);
  const [fontSize, setFontSize] = useState(28);

  const inc = () => {
    setCount((c) => c + 1);
    setFontSize((f) => f + 2);
  };

  const dec = () => {
    setCount((c) => Math.max(0, c - 1));
    setFontSize((f) => Math.max(14, f - 2));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize }}>{uni}</h1>
      <h2>{note}</h2>
      <h3 className={status ? "green-txt" : "red-txt"}>สถานะ</h3>

      <div>
        <h1 style={{ fontSize }}>{count}</h1>
        <button onClick={inc} style={{ marginRight: 8 }}>+ เพิ่มและขยาย</button>
        <button onClick={dec}>- ลบและย่อ</button>
      </div>
    </div>
  );
}


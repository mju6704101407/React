import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema: บังคับฟิลด์หลัก, ฟิลด์อื่นๆ เป็นทางเลือก
const MPSchema = z.object({
  prefix: z.string().trim().min(1, "กรุณากรอกคำนำหน้า"), // นาย/นาง/นางสาว/อื่นๆ
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
  party: z.string().trim().min(1, "กรุณากรอกพรรคการเมือง"),
  ministerPosition: z.string().trim().optional().or(z.literal("")),
  ministry: z.string().trim().optional().or(z.literal("")),
  career: z.string().trim().optional().or(z.literal("")),
  achievements: z.string().trim().optional().or(z.literal("")),
});

export type MP = z.infer<typeof MPSchema>;

const STORAGE_KEY = "mp-records";

const seed: MP = {
  prefix: "นาย",
  firstName: "อนุทิน",
  lastName: "ชาญวีรกูล",
  party: "ภูมิใจไทย",
  ministerPosition: "นายกรัฐมนตรี",
  ministry: "ทำเนียบรัฐบาล",
  career: "นักการเมือง นักธุรกิจ อดีตรองนายกรัฐมนตรีและรัฐมนตรีว่าการกระทรวงสาธารณสุข",
  achievements: "ผลักดันนโยบายด้านสาธารณสุขและพัฒนาประเทศหลายด้าน",
};

export default function MPDirectory() {
  const [records, setRecords] = useState<MP[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [partyFilter, setPartyFilter] = useState("");

  // โหลดจาก localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as MP[];
        if (Array.isArray(parsed)) setRecords(parsed);
      } else {
        setRecords([seed]);
      }
    } catch {
      setRecords([seed]);
    }
  }, []);

  // บันทึกลง localStorage เมื่อ records เปลี่ยน
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  const defaultValues = useMemo<MP>(
    () => ({
      prefix: "",
      firstName: "",
      lastName: "",
      party: "",
      ministerPosition: "",
      ministry: "",
      career: "",
      achievements: "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MP>({ resolver: zodResolver(MPSchema), defaultValues });

  const startAdd = () => {
    setEditingIndex(null);
    reset(defaultValues);
  };

  const startEdit = (idx: number) => {
    const data = records[idx];
    setEditingIndex(idx);
    // เติมค่าลงฟอร์ม
    (Object.keys(data) as (keyof MP)[]).forEach((k) => {
      setValue(k, data[k] ?? "");
    });
  };

  const onSubmit = (data: MP) => {
    if (editingIndex === null) {
      setRecords((prev) => [...prev, data]);
    } else {
      setRecords((prev) => prev.map((r, i) => (i === editingIndex ? data : r)));
    }
    setEditingIndex(null);
    reset(defaultValues);
  };

  const onCancel = () => {
    setEditingIndex(null);
    reset(defaultValues);
  };

  const onDelete = (idx: number) => {
    const ok = confirm("ยืนยันการลบรายชื่อนี้?");
    if (!ok) return;
    setRecords((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) onCancel();
  };

  const partyOptions = useMemo(() => {
    const s = new Set<string>();
    records.forEach((r) => r.party && s.add(r.party));
    return Array.from(s);
  }, [records]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return records.filter((r) => {
      const hitsText = !text || `${r.prefix}${r.firstName} ${r.lastName} ${r.party} ${r.ministerPosition ?? ''} ${r.ministry ?? ''}`.toLowerCase().includes(text);
      const hitsParty = !partyFilter || r.party === partyFilter;
      return hitsText && hitsParty;
    });
  }, [records, q, partyFilter]);

  return (
    <div className="stack">
      <h2 style={{ margin: 0 }}>ทำเนียบ ส.ส. — รายชื่อสมาชิกสภาผู้แทนราษฎร</h2>

      <div className="section stack">
        <div className="row" role="search">
          <input
            className="input"
            placeholder="ค้นหาชื่อ/พรรค/ตำแหน่ง"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="ค้นหา"
          />
          <select
            className="select"
            value={partyFilter}
            onChange={(e) => setPartyFilter(e.target.value)}
            aria-label="กรองตามพรรค"
            style={{ minWidth: 220 }}
          >
            <option value="">ทุกพรรคการเมือง</option>
            {partyOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {(q || partyFilter) && (
            <button className="btn ghost" onClick={() => { setQ(""); setPartyFilter(""); }}>ล้างตัวกรอง</button>
          )}
          <div className="muted" style={{ marginLeft: 'auto' }}>ทั้งหมด {filtered.length} รายชื่อ</div>
        </div>

        {filtered.length === 0 ? (
          <div className="muted">ไม่พบข้อมูลที่ค้นหา</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {filtered.map((m, idx) => (
              <li key={`${m.firstName}-${m.lastName}-${idx}`} className="section" style={{ marginBottom: 10 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="stack" style={{ gap: 4 }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {m.prefix}{m.firstName} {m.lastName}
                    </div>
                    <div className="muted">พรรค: {m.party || '-'}</div>
                    {(m.ministerPosition || m.ministry) && (
                      <div className="muted">
                        ตำแหน่ง: {m.ministerPosition || '-'}{m.ministry && ` (${m.ministry})`}
                      </div>
                    )}
                    {m.career && <div>ประวัติการทำงาน: {m.career}</div>}
                    {m.achievements && <div>ผลงานที่ผ่านมา: {m.achievements}</div>}
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn sm" onClick={() => startEdit(idx)}>แก้ไข</button>
                    <button className="btn sm danger" onClick={() => onDelete(idx)}>ลบ</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{editingIndex === null ? 'เพิ่มรายชื่อ' : 'เพิ่ม/แก้ไข รายชื่อ'}</h3>
          {editingIndex !== null && <button className="btn ghost sm" onClick={startAdd}>เพิ่มรายชื่อใหม่</button>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="stack">
          <div className="grid-2">
            <div className="stack">
              <div className="stack">
                <label>คำนำหน้า <span className="muted">(จำเป็น)</span></label>
                <input className="input" placeholder="นาย / นาง / นางสาว" {...register('prefix')} />
                {errors.prefix && <span className="error">{errors.prefix.message}</span>}
              </div>
              <div className="stack">
                <label>ชื่อ <span className="muted">(จำเป็น)</span></label>
                <input className="input" placeholder="ชื่อ" {...register('firstName')} />
                {errors.firstName && <span className="error">{errors.firstName.message}</span>}
              </div>
              <div className="stack">
                <label>นามสกุล <span className="muted">(จำเป็น)</span></label>
                <input className="input" placeholder="นามสกุล" {...register('lastName')} />
                {errors.lastName && <span className="error">{errors.lastName.message}</span>}
              </div>
              <div className="stack">
                <label>สังกัดพรรคการเมือง <span className="muted">(จำเป็น)</span></label>
                <input className="input" placeholder="พรรคการเมือง" {...register('party')} />
                {errors.party && <span className="error">{errors.party.message}</span>}
              </div>
            </div>

            <div className="stack">
              <div className="stack">
                <label>ตำแหน่งรัฐมนตรี (ถ้ามี)</label>
                <input className="input" placeholder="เช่น นายกรัฐมนตรี" {...register('ministerPosition')} />
              </div>
              <div className="stack">
                <label>กระทรวง (ถ้ามี)</label>
                <input className="input" placeholder="เช่น ทำเนียบรัฐบาล / กระทรวงสาธารณสุข" {...register('ministry')} />
              </div>
              <div className="stack">
                <label>ประวัติการทำงาน</label>
                <textarea className="textarea" rows={3} placeholder="ประวัติ" {...register('career')} />
              </div>
              <div className="stack">
                <label>ผลงานที่ผ่านมา</label>
                <textarea className="textarea" rows={3} placeholder="ผลงาน" {...register('achievements')} />
              </div>
            </div>
          </div>

          <div className="row">
            <button className="btn primary" type="submit" disabled={isSubmitting}>
              {editingIndex === null ? 'เพิ่มรายชื่อ' : 'บันทึกการแก้ไข'}
            </button>
            {editingIndex !== null && (
              <button className="btn ghost" type="button" onClick={onCancel}>ยกเลิก</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

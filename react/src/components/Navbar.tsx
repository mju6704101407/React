type Tab = 'practice1' | 'todo-basic' | 'todo-extended' | 'todo-rhf' | 'todo-rhf-zod' | 'gpa' | 'mp'

export default function Navbar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { key: Tab; label: string }[] = [
    { key: 'practice1', label: 'Practice #1' },
    { key: 'todo-basic', label: 'Todo Basic' },
    { key: 'todo-extended', label: 'Todo Extended' },
    { key: 'todo-rhf', label: 'Todo RHF' },
    { key: 'todo-rhf-zod', label: 'Todo RHF+Zod' },
    { key: 'gpa', label: 'GPA' },
    { key: 'mp', label: 'ทำเนียบ ส.ส.' },
  ]

  return (
    <nav className="navbar" aria-label="หลัก">
      <div className="navbar-inner">
        <div className="brand">React Demo</div>
        <ul className="navlist">
          {items.map((it) => (
            <li key={it.key}>
              <button
                className={`navlink${tab === it.key ? ' active' : ''}`}
                aria-current={tab === it.key ? 'page' : undefined}
                onClick={() => onChange(it.key)}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}


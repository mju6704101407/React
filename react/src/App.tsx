import { useState } from 'react'
import Practice1 from './components/Practice1'
import TodoBasic from './components/TodoBasic'
import TodoExtended from './components/TodoExtended'
import TodoRHF from './components/TodoRHF'
import TodoRHFZod from './components/TodoRHFZod'
import GradeGPA from './components/GradeGPA'
import MPDirectory from './components/MPDirectory'
import Navbar from './components/Navbar'

type Tab = 'practice1' | 'todo-basic' | 'todo-extended' | 'todo-rhf' | 'todo-rhf-zod' | 'gpa' | 'mp'

export default function App() {
  const [tab, setTab] = useState<Tab>('practice1')

  return (
    <div>
      <Navbar tab={tab} onChange={setTab} />
      <main className="container stack" style={{ paddingTop: 16 }}>
        {tab === 'practice1' && <section className="section"><Practice1 /></section>}
        {tab === 'todo-basic' && <section className="section"><TodoBasic /></section>}
        {tab === 'todo-extended' && <section className="section"><TodoExtended /></section>}
        {tab === 'todo-rhf' && <section className="section"><TodoRHF /></section>}
        {tab === 'todo-rhf-zod' && <section className="section"><TodoRHFZod /></section>}
        {tab === 'gpa' && <section className="section"><GradeGPA /></section>}
        {tab === 'mp' && <section className="section"><MPDirectory /></section>}
      </main>
    </div>
  )
}

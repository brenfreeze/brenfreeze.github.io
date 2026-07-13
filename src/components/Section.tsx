import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  label: string
  children: ReactNode
}

export function Section({ id, label, children }: SectionProps) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <h2>{label}</h2>
      </div>
      {children}
    </section>
  )
}

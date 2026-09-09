import type { CSSProperties } from 'react'

type SummaryCardProps = {
  eyebrow: string
  value: string
  label: string
  accent: string
  footnote: string
}

export function SummaryCard({
  eyebrow,
  value,
  label,
  accent,
  footnote,
}: SummaryCardProps) {
  return (
    <article
      className="summary-card"
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <span className="eyebrow">{eyebrow}</span>
      <div className="summary-value">{value}</div>
      <strong>{label}</strong>
      <small>{footnote}</small>
    </article>
  )
}

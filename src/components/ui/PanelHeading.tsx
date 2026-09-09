import type { ReactNode } from 'react'

type PanelHeadingProps = {
  kicker: string
  title: string
  description: string
  action?: ReactNode
}

export function PanelHeading({ kicker, title, description, action }: PanelHeadingProps) {
  return (
    <header className="panel-heading">
      <div>
        <span className="section-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </header>
  )
}

import type { ReactNode } from 'react'

export type IconName =
  | 'pulse'
  | 'grid'
  | 'compare'
  | 'models'
  | 'info'
  | 'download'
  | 'science'

const iconPaths: Record<IconName, ReactNode> = {
  pulse: <path d="M3 12h4l2.2-6 4.2 12 2.2-6H21" />,
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  compare: (
    <>
      <path d="M7 5v14M17 5v14" />
      <path d="m4 8 3-3 3 3M14 16l3 3 3-3" />
    </>
  ),
  models: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="m7.7 7.1 3.1 8.8m5.5-8.8-3.1 8.8M8 6h8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-4-4 4 4 4-4" />
      <path d="M5 20h14" />
    </>
  ),
  science: (
    <>
      <path d="M9 3v6l-4 8a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-4-8V3" />
      <path d="M8 13h8M8 3h8" />
    </>
  ),
}

export function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  )
}

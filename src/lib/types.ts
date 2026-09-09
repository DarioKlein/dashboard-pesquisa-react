import type { DatasetId } from '../data'

export type Scope = 'all' | DatasetId

export type ChartScale = {
  min: number
  max: number
  ticks: number[]
  mode: 'linear' | 'log'
  label: string
  format: (value: number) => string
}

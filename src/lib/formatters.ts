import type { MetricId } from '../data'

export const integerFormatter = new Intl.NumberFormat('pt-BR')

export const formatPercentage = (value: number, digits = 1) =>
  Number.isFinite(value)
    ? `${(value * 100).toFixed(digits).replace('.', ',')}%`
    : 'Indisponível'

export const formatDecimal = (value: number, digits = 3) =>
  Number.isFinite(value)
    ? value.toFixed(digits).replace('.', ',')
    : 'Indisponível'

export const isTimeMetric = (metric: MetricId) => metric.startsWith('Tempo_')

export const formatMetric = (metric: MetricId, value: number) => {
  if (!Number.isFinite(value)) return 'Indisponível'

  if (isTimeMetric(metric)) {
    if (value < 1) return `${Math.round(value * 1000)} ms`
    if (value > 3600) return `${(value / 3600).toFixed(1).replace('.', ',')} h`
    return `${value.toFixed(1).replace('.', ',')} s`
  }

  return metric === 'MCC' || metric === 'Brier' || metric === 'Log_Loss'
    ? formatDecimal(value)
    : formatPercentage(value)
}

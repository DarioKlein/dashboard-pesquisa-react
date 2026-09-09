import { metricInfo, type MetricId } from '../data'
import { formatDecimal, formatMetric, formatPercentage, isTimeMetric } from './formatters'
import type { ChartScale } from './types'

const percentageMetrics: MetricId[] = [
  'Acuracia',
  'Sensibilidade',
  'Especificidade',
  'Precisao',
  'F1',
  'ROC_AUC',
  'Acuracia_Balanceada',
]

const niceStep = (value: number) => {
  const safeValue = value > 0 && Number.isFinite(value) ? value : 0.25
  const exponent = Math.floor(Math.log10(safeValue))
  const fraction = safeValue / 10 ** exponent
  const niceFraction =
    fraction <= 1.5
      ? 1
      : fraction <= 2.25
        ? 2
        : fraction <= 3.5
          ? 2.5
          : fraction <= 7.5
            ? 5
            : 10

  return niceFraction * 10 ** exponent
}

const observedLinearScale = (
  values: number[],
  label: string,
): ChartScale => {
  const observedMax = Math.max(...values.filter(Number.isFinite), 0.1)
  const step = niceStep((observedMax * 1.08) / 4)
  const max = Math.ceil((observedMax * 1.08) / step) * step
  const tickCount = Math.round(max / step)

  return {
    min: 0,
    max,
    ticks: Array.from(
      { length: tickCount + 1 },
      (_, index) => max - index * step,
    ),
    mode: 'linear',
    label,
    format: (value) => formatDecimal(value, max < 1 ? 2 : 1),
  }
}

export const getChartScale = (
  metric: MetricId,
  values: number[],
): ChartScale => {
  const finiteValues = values.filter(
    (value) => Number.isFinite(value) && value >= 0,
  )

  if (percentageMetrics.includes(metric)) {
    return {
      min: 0,
      max: 1,
      ticks: [1, 0.75, 0.5, 0.25, 0],
      mode: 'linear',
      label: 'Escala percentual (0–100%)',
      format: (value) => formatPercentage(value, 0),
    }
  }

  if (metric === 'MCC') {
    return {
      min: -1,
      max: 1,
      ticks: [1, 0.5, 0, -0.5, -1],
      mode: 'linear',
      label: 'Coeficiente MCC (−1 a 1)',
      format: (value) => formatDecimal(value, 1),
    }
  }

  if (isTimeMetric(metric)) {
    const safeValues = finiteValues.filter((value) => value > 0)
    const minObserved = safeValues.length ? Math.min(...safeValues) : 0.001
    const maxObserved = safeValues.length ? Math.max(...safeValues) : 1
    const minExponent = Math.floor(Math.log10(minObserved))
    const maxExponent = Math.ceil(Math.log10(maxObserved))
    const exponentStep = Math.max(
      1,
      Math.ceil((maxExponent - minExponent) / 4),
    )
    const exponents: number[] = []

    for (
      let exponent = maxExponent;
      exponent >= minExponent;
      exponent -= exponentStep
    ) {
      exponents.push(exponent)
    }
    if (exponents.at(-1) !== minExponent) exponents.push(minExponent)

    return {
      min: 10 ** minExponent,
      max: 10 ** maxExponent,
      ticks: exponents.map((exponent) => 10 ** exponent),
      mode: 'log',
      label: `${metricInfo[metric].label} · segundos · escala log10`,
      format: (value) => formatMetric(metric, value),
    }
  }

  return observedLinearScale(
    finiteValues,
    `${metricInfo[metric].label} · escala numérica`,
  )
}

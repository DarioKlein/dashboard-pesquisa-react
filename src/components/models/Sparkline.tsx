import { metricInfo, parseFinite, type MetricId, type ModelResult } from '../../data'

export function Sparkline({ result, metric }: { result: ModelResult; metric: MetricId }) {
  const values = result.evaluationRows
    .map((row) => parseFinite(row[metric]))
    .filter(Number.isFinite)

  if (!values.length) {
    return <div className="empty-state">Dados indisponíveis</div>
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = values.length > 3 ? 300 : 120
  const x = (index: number) =>
    8 + index * ((width - 16) / Math.max(1, values.length - 1))
  const y = (value: number) => 48 - ((value - min) / range) * 34
  const points = values
    .map((value, index) => `${x(index)},${y(value)}`)
    .join(' ')

  return (
    <div className="sparkline">
      <svg
        viewBox={`0 0 ${width} 58`}
        role="img"
        aria-label={`${metricInfo[metric].label} nas avaliações`}
      >
        <path d={`M8 48H${width - 8}`} />
        <polyline points={points} />
        {values.map((value, index) => (
          <circle
            key={index}
            cx={x(index)}
            cy={y(value)}
            r={values.length > 3 ? 2 : 3}
          />
        ))}
      </svg>
      <div className="spark-labels">
        <span>{result.stage === 'nested' ? 'Fold externo 1' : 'R1'}</span>
        <span>{result.stage === 'nested' ? 'Fold externo 15' : 'R3'}</span>
      </div>
    </div>
  )
}

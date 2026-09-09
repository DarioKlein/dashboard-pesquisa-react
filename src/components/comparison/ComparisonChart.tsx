import {
  algorithmIds,
  algorithmInfo,
  datasetInfo,
  metricInfo,
  type MetricId,
  type ModelResult,
  type StageId,
} from '../../data'
import {
  formatMetric,
  getBestResult,
  getChartScale,
  getResult,
  getVisibleDatasets,
  isTimeMetric,
  metricSd,
  metricValue,
  type Scope,
} from '../../lib/dashboard'

type ComparisonChartProps = {
  stage: StageId
  scope: Scope
  metric: MetricId
}

export function ComparisonChart({ stage, scope, metric }: ComparisonChartProps) {
  const visibleDatasets = getVisibleDatasets(stage, scope)
  const chartResults = visibleDatasets.flatMap((dataset) =>
    algorithmIds
      .map((algorithm) => getResult(stage, dataset, algorithm))
      .filter((result): result is ModelResult => Boolean(result)),
  )
  const scaleValues = chartResults.flatMap((result) => {
    const mean = metricValue(result, metric)
    const standardDeviation = metricSd(result, metric)
    return Number.isFinite(standardDeviation) && !isTimeMetric(metric)
      ? [mean, mean + standardDeviation, mean - standardDeviation]
      : [mean]
  })
  const scale = getChartScale(metric, scaleValues)
  const range = scale.max - scale.min

  const position = (value: number) =>
    Math.max(0, Math.min(100, ((value - scale.min) / range) * 100))

  const barGeometry = (value: number) => {
    if (scale.mode === 'log') {
      const logMin = Math.log10(scale.min)
      return {
        height:
          ((Math.log10(value) - logMin) /
            (Math.log10(scale.max) - logMin)) *
          100,
        bottom: 0,
      }
    }

    const baseline = metric === 'MCC' ? 0 : scale.min
    return {
      height: (Math.abs(value - baseline) / range) * 100,
      bottom: ((Math.min(value, baseline) - scale.min) / range) * 100,
    }
  }

  return (
    <div
      className="comparison-chart"
      role="img"
      aria-label={`Comparação de ${metricInfo[metric].label}. ${scale.label}`}
    >
      <div className="chart-scale" aria-hidden="true">
        {scale.ticks.map((tick) => (
          <span key={tick}>{scale.format(tick)}</span>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-lines" aria-hidden="true">
          {scale.ticks.map((tick) => (
            <span key={tick} className={tick === 0 ? 'zero-line' : undefined} />
          ))}
        </div>

        {algorithmIds.map((algorithm) => (
          <div className="bar-group" key={algorithm}>
            <div className="bars">
              {visibleDatasets.map((dataset) => {
                const result = getResult(stage, dataset, algorithm)
                const value = result ? metricValue(result, metric) : Number.NaN
                const standardDeviation = result ? metricSd(result, metric) : Number.NaN

                if (!result || !Number.isFinite(value)) {
                  return (
                    <div className="bar-wrap unavailable" key={dataset}>
                      —
                    </div>
                  )
                }

                const { height, bottom } = barGeometry(value)
                const isWinner = getBestResult(stage, dataset, metric)?.algorithm === algorithm
                const showErrorBar =
                  Number.isFinite(standardDeviation) && !isTimeMetric(metric)
                const errorLow = showErrorBar ? position(value - standardDeviation) : 0
                const errorHigh = showErrorBar ? position(value + standardDeviation) : 0

                return (
                  <div className="bar-wrap" key={dataset}>
                    <span
                      className="bar-value"
                      style={{ bottom: `calc(${bottom + height}% + 4px)` }}
                    >
                      {formatMetric(metric, value)}
                    </span>
                    <div
                      className={`bar ${isWinner ? 'winner' : ''}`}
                      style={{
                        height: `${height}%`,
                        bottom: `${bottom}%`,
                        background: datasetInfo[dataset].color,
                      }}
                    >
                      {isWinner && <span className="winner-dot">★</span>}
                    </div>
                    {showErrorBar && (
                      <span
                        className="error-bar"
                        style={{
                          bottom: `${errorLow}%`,
                          height: `${errorHigh - errorLow}%`,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="bar-label">
              <b style={{ background: algorithmInfo[algorithm].color }}>
                {algorithmInfo[algorithm].short}
              </b>
              {algorithmInfo[algorithm].name}
            </div>
          </div>
        ))}
      </div>
      <span className="axis-label">{scale.label}</span>
    </div>
  )
}

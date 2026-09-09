import {
  algorithmIds,
  metricInfo,
  predictiveMetricIds,
  type DatasetId,
  type StageId,
} from '../../data'
import {
  formatMetric,
  getBestResult,
  getResult,
  metricSd,
  metricValue,
  type Scope,
} from '../../lib/dashboard'
import { AlgorithmCell } from './AlgorithmCell'

export function MetricTable({ stage, scope }: { stage: StageId; scope: Scope }) {
  const dataset: DatasetId =
    stage === 'nested' || scope === 'all' ? 'cleveland' : scope

  return (
    <div className="table-wrap">
      <p className="table-note">
        {stage === 'nested'
          ? 'Média ± DP de 15 avaliações externas (folds externos).'
          : `Média ± DP de 3 repetições OOF${scope === 'all' ? ' · exibindo Cleveland; selecione uma base para alternar.' : '.'}`}
      </p>

      <table>
        <thead>
          <tr>
            <th>Algoritmo</th>
            {predictiveMetricIds.map((metric) => (
              <th key={metric}>{metricInfo[metric].short}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {algorithmIds.map((algorithm) => {
            const result = getResult(stage, dataset, algorithm)
            if (!result) return null

            return (
              <tr key={algorithm}>
                <AlgorithmCell algorithm={algorithm} />
                {predictiveMetricIds.map((metric) => {
                  const isBest =
                    getBestResult(stage, dataset, metric)?.algorithm === algorithm
                  return (
                    <td key={metric} className={isBest ? 'best-cell' : undefined}>
                      <span>{formatMetric(metric, metricValue(result, metric))}</span>
                      <small>± {formatMetric(metric, metricSd(result, metric))}</small>
                      {isBest && (
                        <em>
                          {metricInfo[metric].better === 'high'
                            ? 'maior média'
                            : 'menor média'}
                        </em>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

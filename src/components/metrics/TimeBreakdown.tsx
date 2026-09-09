import {
  algorithmIds,
  metricInfo,
  nestedTimeMetricIds,
} from '../../data'
import {
  formatMetric,
  getResult,
  metricSd,
  metricValue,
} from '../../lib/dashboard'
import { PanelHeading } from '../ui/PanelHeading'
import { AlgorithmCell } from './AlgorithmCell'

export function TimeBreakdown() {
  return (
    <section className="panel time-panel">
      <PanelHeading
        kicker="CUSTO COMPUTACIONAL"
        title="Tempos por avaliação externa"
        description="Médias e desvios-padrão dos 15 folds externos; o total pode incluir operações adicionais."
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Algoritmo</th>
              {nestedTimeMetricIds.map((metric) => (
                <th key={metric}>{metricInfo[metric].short}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {algorithmIds.map((algorithm) => {
              const result = getResult('nested', 'cleveland', algorithm)
              if (!result) return null

              return (
                <tr key={algorithm}>
                  <AlgorithmCell algorithm={algorithm} />
                  {nestedTimeMetricIds.map((metric) => (
                    <td key={metric}>
                      <span>{formatMetric(metric, metricValue(result, metric))}</span>
                      <small>± {formatMetric(metric, metricSd(result, metric))}</small>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="panel-footnote">
        Seleção, reajuste e predição são etapas distintas. Os tempos não são
        diretamente comparáveis ao tempo por repetição da etapa exploratória.
      </p>
    </section>
  )
}

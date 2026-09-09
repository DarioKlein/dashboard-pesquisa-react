import {
  datasetInfo,
  metricInfo,
  type MetricId,
  type ModelResult,
} from '../../data'
import {
  formatMetric,
  getBestResult,
  integerFormatter,
  metricSd,
  metricValue,
  readableConfiguration,
} from '../../lib/dashboard'
import { ConfigurationFrequency } from './ConfigurationFrequency'
import { ConfusionMatrix } from './ConfusionMatrix'
import { Sparkline } from './Sparkline'

const keyMetrics: MetricId[] = [
  'Acuracia',
  'Sensibilidade',
  'Especificidade',
  'F1',
  'ROC_AUC',
  'MCC',
]

export function DatasetDetail({
  result,
  selectedMetric,
}: {
  result: ModelResult
  selectedMetric: MetricId
}) {
  const dataset = datasetInfo[result.dataset]
  const bestConfiguration = result.ranking[0]
  const configurationKeys = bestConfiguration
    ? Object.keys(bestConfiguration).filter(
        (key) => !key.endsWith('_Media') && key !== 'id',
      )
    : []
  const hasHighestMcc =
    getBestResult(result.stage, result.dataset, 'MCC')?.algorithm === result.algorithm

  return (
    <article className="dataset-detail">
      <header>
        <div>
          <i style={{ background: dataset.color }} />
          <div>
            <strong>{dataset.name}</strong>
            <small>
              {integerFormatter.format(dataset.sampleSize)} registros ·{' '}
              {result.stage === 'nested'
                ? '15 avaliações externas'
                : '3 repetições OOF'}
            </small>
          </div>
        </div>
        <span className="rank-chip">
          {hasHighestMcc ? 'maior MCC médio' : 'resultado validado'}
        </span>
      </header>

      <div className="metric-grid">
        {keyMetrics.map((metric) => (
          <div
            key={metric}
            className={metric === selectedMetric ? 'selected' : undefined}
          >
            <span>{metricInfo[metric].short}</span>
            <strong>{formatMetric(metric, metricValue(result, metric))}</strong>
            <small>± {formatMetric(metric, metricSd(result, metric))}</small>
          </div>
        ))}
      </div>

      <div className="detail-split">
        <div>
          <div className="subheading">
            <span>Matriz de confusão</span>
            <small>
              {result.stage === 'nested' ? 'por repetição OOF' : 'média por repetição'}
            </small>
          </div>
          <ConfusionMatrix result={result} />
        </div>
        <div>
          <div className="subheading">
            <span>Estabilidade</span>
            <small>{metricInfo[selectedMetric].label}</small>
          </div>
          <Sparkline result={result} metric={selectedMetric} />
          {result.stage === 'exploratory' && bestConfiguration && (
            <div className="config-box">
              <span>Configuração selecionada</span>
              <strong>{readableConfiguration(bestConfiguration.id)}</strong>
              {configurationKeys.length > 0 && (
                <small>
                  {configurationKeys
                    .map(
                      (key) =>
                        `${key.replaceAll('_', ' ')}: ${bestConfiguration[key]}`,
                    )
                    .join(' · ')}
                </small>
              )}
            </div>
          )}
        </div>
      </div>

      {result.stage === 'nested' && <ConfigurationFrequency result={result} />}
    </article>
  )
}

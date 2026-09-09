import {
  datasetInfo,
  metricInfo,
  type DatasetId,
  type MetricId,
  type StageId,
} from '../../data'
import { getVisibleDatasets, type Scope } from '../../lib/dashboard'
import { PanelHeading } from '../ui/PanelHeading'
import { ComparisonChart } from './ComparisonChart'

type ComparisonPanelProps = {
  stage: StageId
  scope: Scope
  metric: MetricId
  metricIds: MetricId[]
  onMetricChange: (metric: MetricId) => void
}

export function ComparisonPanel({
  stage,
  scope,
  metric,
  metricIds,
  onMetricChange,
}: ComparisonPanelProps) {
  const visibleDatasets: DatasetId[] = getVisibleDatasets(stage, scope)

  const legend = (
    <div className="legend">
      {visibleDatasets.map((dataset) => (
        <span key={dataset}>
          <i style={{ background: datasetInfo[dataset].color }} />
          {datasetInfo[dataset].name}
        </span>
      ))}
    </div>
  )

  return (
    <section className="panel comparison-panel" id="comparison">
      <PanelHeading
        kicker="COMPARAÇÃO DIRETA"
        title={
          stage === 'nested'
            ? 'Desempenho nos testes externos reservados'
            : 'Algoritmo por algoritmo'
        }
        description={
          stage === 'nested'
            ? 'Média e DP das 15 avaliações externas'
            : 'Média e DP das 3 repetições OOF'
        }
        action={legend}
      />

      <div className="metric-tabs" role="tablist" aria-label="Métrica do gráfico">
        {metricIds.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={metric === item}
            className={metric === item ? 'active' : undefined}
            onClick={() => onMetricChange(item)}
          >
            {metricInfo[item].short}
          </button>
        ))}
      </div>

      <ComparisonChart stage={stage} metric={metric} scope={scope} />

      <div className="chart-caption">
        <span>★ Ordenação pela média observada · hastes representam DP</span>
        <span>O destaque não indica significância estatística.</span>
      </div>
    </section>
  )
}

import {
  algorithmIds,
  algorithmInfo,
  type AlgorithmId,
  type DatasetId,
  type MetricId,
  type StageId,
} from '../../data'
import { getResult, getVisibleDatasets, type Scope } from '../../lib/dashboard'
import { PanelHeading } from '../ui/PanelHeading'
import { DatasetDetail } from './DatasetDetail'

type ModelsPanelProps = {
  stage: StageId
  scope: Scope
  metric: MetricId
  algorithm: AlgorithmId
  onAlgorithmChange: (algorithm: AlgorithmId) => void
}

export function ModelsPanel({
  stage,
  scope,
  metric,
  algorithm,
  onAlgorithmChange,
}: ModelsPanelProps) {
  const visibleDatasets: DatasetId[] = getVisibleDatasets(stage, scope)

  return (
    <section className="panel models-panel" id="models">
      <PanelHeading
        kicker="ANÁLISE DETALHADA"
        title="Perfil por classificador"
        description={
          stage === 'nested'
            ? 'Resumo externo, previsões OOF por repetição e frequência de seleção'
            : 'Métricas, dispersão, erros e configuração selecionada'
        }
      />

      <div className="algorithm-tabs" role="tablist" aria-label="Selecionar algoritmo">
        {algorithmIds.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={algorithm === item}
            className={algorithm === item ? 'active' : undefined}
            onClick={() => onAlgorithmChange(item)}
          >
            <b style={{ background: algorithmInfo[item].color }}>
              {algorithmInfo[item].short}
            </b>
            <span>{algorithmInfo[item].name}</span>
          </button>
        ))}
      </div>

      <div className="details-grid">
        {visibleDatasets.map((dataset) => {
          const result = getResult(stage, dataset, algorithm)
          return result ? (
            <DatasetDetail
              key={`${stage}-${dataset}`}
              result={result}
              selectedMetric={metric}
            />
          ) : null
        })}
      </div>
    </section>
  )
}

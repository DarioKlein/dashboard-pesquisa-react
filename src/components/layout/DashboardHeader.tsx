import { datasetIds, datasetInfo, stageInfo, type StageId } from '../../data'
import type { Scope } from '../../lib/dashboard'

type DashboardHeaderProps = {
  stage: StageId
  scope: Scope
  onScopeChange: (scope: Scope) => void
}

export function DashboardHeader({ stage, scope, onScopeChange }: DashboardHeaderProps) {
  return (
    <section className="topbar" id="overview">
      <div>
        <span className="breadcrumb">
          ANÁLISE EXPERIMENTAL / {stageInfo[stage].short.toUpperCase()}
        </span>
        <h1>{stage === 'nested' ? 'Avaliação complementar — Cleveland' : 'Desempenho dos modelos'}</h1>
        <p>Predição de doença cardíaca · quatro classificadores</p>
      </div>

      {stage === 'exploratory' ? (
        <div className="scope-control" aria-label="Filtrar base de dados">
          {(['all', ...datasetIds] as Scope[]).map((item) => (
            <button
              key={item}
              className={scope === item ? 'active' : undefined}
              onClick={() => onScopeChange(item)}
            >
              {item === 'all' ? 'Todas as bases' : datasetInfo[item].name}
            </button>
          ))}
        </div>
      ) : (
        <span className="locked-dataset">
          <i /> Cleveland somente
        </span>
      )}
    </section>
  )
}

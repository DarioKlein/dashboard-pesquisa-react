import type { StageId } from '../../data'
import type { Scope } from '../../lib/dashboard'
import { Icon } from '../ui/Icon'
import { PanelHeading } from '../ui/PanelHeading'
import { MetricTable } from './MetricTable'

export function MetricsPanel({ stage, scope }: { stage: StageId; scope: Scope }) {
  const exportButton = (
    <button className="export-button" onClick={() => window.print()}>
      <Icon name="download" />
      Exportar relatório
    </button>
  )

  return (
    <section className="panel metrics-panel">
      <PanelHeading
        kicker="VISÃO TABULAR"
        title="Dez métricas preditivas"
        description="Valores do resumo correspondente à unidade de agregação da etapa"
        action={exportButton}
      />
      <MetricTable stage={stage} scope={scope} />
    </section>
  )
}

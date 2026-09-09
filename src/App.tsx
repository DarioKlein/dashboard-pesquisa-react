import { useState } from 'react'
import {
  exploratoryMetricIds,
  nestedMetricIds,
  type AlgorithmId,
  type MetricId,
  type StageId,
} from './data'
import type { Scope } from './lib/dashboard'
import { ComparisonPanel } from './components/comparison/ComparisonPanel'
import { InferencePanel } from './components/inference/InferencePanel'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { Sidebar } from './components/layout/Sidebar'
import { StageSelector } from './components/layout/StageSelector'
import { MethodologyPanel } from './components/methodology/MethodologyPanel'
import { MetricsPanel } from './components/metrics/MetricsPanel'
import { TimeBreakdown } from './components/metrics/TimeBreakdown'
import { ModelsPanel } from './components/models/ModelsPanel'
import { SummarySection } from './components/summary/SummarySection'
import './styles/index.css'

function App() {
  const [stage, setStage] = useState<StageId>('exploratory')
  const [scope, setScope] = useState<Scope>('all')
  const [metric, setMetric] = useState<MetricId>('MCC')
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('naive_bayes')
  const metricIds = stage === 'nested' ? nestedMetricIds : exploratoryMetricIds

  const changeStage = (nextStage: StageId) => {
    setStage(nextStage)
    setScope(nextStage === 'nested' ? 'cleveland' : 'all')
    setMetric('MCC')
  }

  return (
    <div className="app-shell">
      <Sidebar stage={stage} />
      <main>
        <DashboardHeader stage={stage} scope={scope} onScopeChange={setScope} />
        <StageSelector stage={stage} onChange={changeStage} />
        <SummarySection stage={stage} />
        <ComparisonPanel
          stage={stage}
          scope={scope}
          metric={metric}
          metricIds={metricIds}
          onMetricChange={setMetric}
        />
        <ModelsPanel
          stage={stage}
          scope={scope}
          metric={metric}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
        />
        <MetricsPanel stage={stage} scope={scope} />
        {stage === 'nested' && (
          <>
            <TimeBreakdown />
            <InferencePanel />
          </>
        )}
        <MethodologyPanel stage={stage} />
      </main>
    </div>
  )
}

export default App

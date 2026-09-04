import { useMemo, useState, type CSSProperties } from 'react'
import './App.css'
import {
  algorithmIds,
  algorithmInfo,
  datasetIds,
  datasetInfo,
  metricIds,
  metricInfo,
  results,
  type AlgorithmId,
  type DatasetId,
  type MetricId,
  type ModelResult,
} from './data'

type Scope = 'all' | DatasetId
const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits).replace('.', ',')}%`
const decimal = (value: number, digits = 3) => value.toFixed(digits).replace('.', ',')
const integer = new Intl.NumberFormat('pt-BR')
const getResult = (dataset: DatasetId, algorithm: AlgorithmId) =>
  results.find(item => item.dataset === dataset && item.algorithm === algorithm)!
const bestFor = (dataset: DatasetId, metric: MetricId) => {
  const direction = metricInfo[metric].better === 'high' ? 1 : -1
  return [...results.filter(item => item.dataset === dataset)].sort(
    (a, b) => direction * (b.summary[metric].mean - a.summary[metric].mean),
  )[0]
}
const displayMetric = (metric: MetricId, value: number) => {
  if (metric === 'Tempo_Execucao_Segundos') {
    if (value < 1) return `${Math.round(value * 1000)} ms`
    if (value > 3600) return `${(value / 3600).toFixed(1).replace('.', ',')} h`
    return `${value.toFixed(1).replace('.', ',')} s`
  }
  return metric === 'MCC' || metric === 'Brier' || metric === 'Log_Loss' ? decimal(value) : pct(value)
}

function Icon({ name }: { name: 'pulse' | 'grid' | 'compare' | 'models' | 'info' | 'download' }) {
  const paths = {
    pulse: <path d="M3 12h4l2.2-6 4.2 12 2.2-6H21" />,
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    compare: (
      <>
        <path d="M7 5v14M17 5v14" />
        <path d="m4 8 3-3 3 3M14 16l3 3 3-3" />
      </>
    ),
    models: (
      <>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="m7.7 7.1 3.1 8.8m5.5-8.8-3.1 8.8M8 6h8" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5m0-8h.01" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4" />
        <path d="M5 20h14" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="pulse" />
        </span>
        <span>
          <strong>CardioBench</strong>
          <small>Pesquisa clínica</small>
        </span>
      </div>
      <nav aria-label="Navegação principal">
        <a className="active" href="#overview">
          <Icon name="grid" /> Visão geral
        </a>
        <a href="#comparison">
          <Icon name="compare" /> Comparação
        </a>
        <a href="#models">
          <Icon name="models" /> Modelos
        </a>
        <a href="#methodology">
          <Icon name="info" /> Metodologia
        </a>
      </nav>
      <div className="sidebar-note">
        <span>STATUS DOS DADOS</span>
        <strong>
          <i /> Validação concluída
        </strong>
        <small>8 modelos avaliados</small>
      </div>
    </aside>
  )
}

function SummaryCard({
  eyebrow,
  value,
  label,
  accent,
  foot,
}: {
  eyebrow: string
  value: string
  label: string
  accent: string
  foot: string
}) {
  return (
    <article className="summary-card" style={{ '--card-accent': accent } as CSSProperties}>
      <span className="eyebrow">{eyebrow}</span>
      <div className="summary-value">{value}</div>
      <strong>{label}</strong>
      <small>{foot}</small>
    </article>
  )
}

function ComparisonChart({ metric, scope }: { metric: MetricId; scope: Scope }) {
  const visibleDatasets: DatasetId[] = scope === 'all' ? datasetIds : [scope]
  const values = visibleDatasets.flatMap(dataset =>
    algorithmIds.map(algorithm => getResult(dataset, algorithm).summary[metric].mean),
  )
  const isTime = metric === 'Tempo_Execucao_Segundos'
  const max = Math.max(...values)
  const min = Math.min(...values)
  const barHeight = (value: number) =>
    isTime
      ? 18 +
        ((Math.log10(value + 0.01) - Math.log10(min + 0.01)) / (Math.log10(max + 0.01) - Math.log10(min + 0.01) || 1)) *
          72
      : Math.max(8, value * 100)
  return (
    <div
      className="comparison-chart"
      role="img"
      aria-label={`Comparação de ${metricInfo[metric].label} entre algoritmos`}
    >
      <div className="chart-scale" aria-hidden="true">
        <span>{isTime ? 'maior' : '100%'}</span>
        <span>{isTime ? 'escala log' : '75%'}</span>
        <span>{isTime ? '' : '50%'}</span>
        <span>0</span>
      </div>
      <div className="chart-grid">
        {algorithmIds.map(algorithm => (
          <div className="bar-group" key={algorithm}>
            <div className="bars">
              {visibleDatasets.map(dataset => {
                const value = getResult(dataset, algorithm).summary[metric].mean
                const height = barHeight(value)
                const winner = bestFor(dataset, metric).algorithm === algorithm
                return (
                  <div className="bar-wrap" key={dataset}>
                    <span className="bar-value" style={{ bottom: `calc(${height}% + 3px)` }}>
                      {displayMetric(metric, value)}
                    </span>
                    <div
                      className={`bar ${winner ? 'winner' : ''}`}
                      style={{ height: `${height}%`, background: datasetInfo[dataset].color }}
                    >
                      {winner && <span className="winner-dot">★</span>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="bar-label">
              <b style={{ background: algorithmInfo[algorithm].color }}>{algorithmInfo[algorithm].short}</b>
              {algorithmInfo[algorithm].name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Sparkline({ result, metric }: { result: ModelResult; metric: MetricId }) {
  const values = result.runs.map(run => Number(run[metric]))
  const min = Math.min(...values),
    max = Math.max(...values),
    range = max - min || 1
  const y = (value: number) => 38 - ((value - min) / range) * 26
  const points = values.map((value, index) => `${8 + index * 52},${y(value)}`).join(' ')
  return (
    <div className="sparkline">
      <svg viewBox="0 0 120 48" role="img" aria-label={`${metricInfo[metric].label} nas três repetições`}>
        <path d="M8 38H112" />
        <polyline points={points} />
        {values.map((value, index) => (
          <circle key={index} cx={8 + index * 52} cy={y(value)} r="3" />
        ))}
      </svg>
      <span>R1</span>
      <span>R2</span>
      <span>R3</span>
    </div>
  )
}

function ConfusionMatrix({ result }: { result: ModelResult }) {
  const average = (key: string) =>
    Math.round(result.runs.reduce((sum, run) => sum + Number(run[key]), 0) / result.runs.length)
  return (
    <div className="matrix-block">
      <div className="matrix-axis top">Predito</div>
      <div className="matrix-axis side">Real</div>
      <div className="matrix-labels">
        <span>Doença</span>
        <span>Sem doença</span>
      </div>
      <div className="matrix-grid">
        <div className="matrix-good">
          <strong>{integer.format(average('VP'))}</strong>
          <small>Verdadeiro positivo</small>
        </div>
        <div className="matrix-bad">
          <strong>{integer.format(average('FN'))}</strong>
          <small>Falso negativo</small>
        </div>
        <div className="matrix-bad">
          <strong>{integer.format(average('FP'))}</strong>
          <small>Falso positivo</small>
        </div>
        <div className="matrix-good">
          <strong>{integer.format(average('VN'))}</strong>
          <small>Verdadeiro negativo</small>
        </div>
      </div>
    </div>
  )
}

function DatasetDetail({ result, selectedMetric }: { result: ModelResult; selectedMetric: MetricId }) {
  const info = datasetInfo[result.dataset],
    bestConfig = result.ranking[0]
  const configKeys = Object.keys(bestConfig).filter(key => !key.endsWith('_Media') && key !== 'id')
  const keyMetrics: MetricId[] = ['Acuracia', 'Sensibilidade', 'Especificidade', 'F1', 'ROC_AUC', 'MCC']
  return (
    <article className="dataset-detail">
      <header>
        <div>
          <i style={{ background: info.color }} />
          <div>
            <strong>{info.name}</strong>
            <small>{integer.format(info.sampleSize)} registros</small>
          </div>
        </div>
        <span className="rank-chip">
          {bestFor(result.dataset, 'Acuracia').algorithm === result.algorithm ? '1º em acurácia' : 'resultado validado'}
        </span>
      </header>
      <div className="metric-grid">
        {keyMetrics.map(metric => (
          <div key={metric} className={metric === selectedMetric ? 'selected' : ''}>
            <span>{metricInfo[metric].short}</span>
            <strong>{displayMetric(metric, result.summary[metric].mean)}</strong>
            <small>± {displayMetric(metric, result.summary[metric].sd)}</small>
          </div>
        ))}
      </div>
      <div className="detail-split">
        <div>
          <div className="subheading">
            <span>Matriz de confusão</span>
            <small>média por repetição</small>
          </div>
          <ConfusionMatrix result={result} />
        </div>
        <div>
          <div className="subheading">
            <span>Estabilidade</span>
            <small>{metricInfo[selectedMetric].label}</small>
          </div>
          <Sparkline result={result} metric={selectedMetric} />
          <div className="config-box">
            <span>Melhor configuração</span>
            <strong>{bestConfig.id.replaceAll('_', ' ')}</strong>
            {configKeys.length > 0 && (
              <small>{configKeys.map(key => `${key.replaceAll('_', ' ')}: ${bestConfig[key]}`).join(' · ')}</small>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function MetricTable({ scope }: { scope: Scope }) {
  const dataset = scope === 'all' ? 'cleveland' : scope
  const columns: MetricId[] = ['Acuracia', 'Sensibilidade', 'Especificidade', 'F1', 'MCC', 'ROC_AUC', 'Brier']
  return (
    <div className="table-wrap">
      {scope === 'all' && (
        <p className="table-note">Exibindo Cleveland. Selecione uma base no topo para alternar a tabela.</p>
      )}
      <table>
        <thead>
          <tr>
            <th>Algoritmo</th>
            {columns.map(metric => (
              <th key={metric}>{metricInfo[metric].short}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {algorithmIds.map(algorithm => {
            const result = getResult(dataset, algorithm)
            return (
              <tr key={algorithm}>
                <td>
                  <b style={{ background: algorithmInfo[algorithm].color }}>{algorithmInfo[algorithm].short}</b>
                  <span>{algorithmInfo[algorithm].name}</span>
                </td>
                {columns.map(metric => {
                  const isBest = bestFor(dataset, metric).algorithm === algorithm
                  return (
                    <td key={metric} className={isBest ? 'best-cell' : ''}>
                      {displayMetric(metric, result.summary[metric].mean)}
                      {isBest && <small>melhor</small>}
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

function App() {
  const [scope, setScope] = useState<Scope>('all')
  const [metric, setMetric] = useState<MetricId>('Acuracia')
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('naive_bayes')
  const clevelandBest = bestFor('cleveland', 'Acuracia'),
    kaggleBest = bestFor('kaggle', 'Acuracia')
  const globalAuc = useMemo(() => [...results].sort((a, b) => b.summary.ROC_AUC.mean - a.summary.ROC_AUC.mean)[0], [])
  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <section className="topbar" id="overview">
          <div>
            <span className="breadcrumb">ANÁLISE EXPERIMENTAL / RESULTADOS</span>
            <h1>Desempenho dos modelos</h1>
            <p>Predição de doença cardíaca em validação cruzada</p>
          </div>
          <div className="scope-control" aria-label="Filtrar base de dados">
            {(['all', ...datasetIds] as Scope[]).map(item => (
              <button key={item} className={scope === item ? 'active' : ''} onClick={() => setScope(item)}>
                {item === 'all' ? 'Todas as bases' : datasetInfo[item].name}
              </button>
            ))}
          </div>
        </section>
        <section className="summary-grid">
          <SummaryCard
            eyebrow="MELHOR • CLEVELAND"
            value={pct(clevelandBest.summary.Acuracia.mean)}
            label={algorithmInfo[clevelandBest.algorithm].name}
            accent="#7B78DB"
            foot="Acurácia média"
          />
          <SummaryCard
            eyebrow="MELHOR • KAGGLE"
            value={pct(kaggleBest.summary.Acuracia.mean)}
            label={algorithmInfo[kaggleBest.algorithm].name}
            accent="#27A59A"
            foot="Acurácia média"
          />
          <SummaryCard
            eyebrow="MAIOR DISCRIMINAÇÃO"
            value={pct(globalAuc.summary.ROC_AUC.mean)}
            label={algorithmInfo[globalAuc.algorithm].name}
            accent="#F28C6F"
            foot={`ROC-AUC · ${datasetInfo[globalAuc.dataset].name}`}
          />
          <article className="insight-card">
            <span className="insight-icon">↗</span>
            <div>
              <span className="eyebrow">PRINCIPAL ACHADO</span>
              <strong>A base muda o modelo vencedor</strong>
              <small>Naive Bayes lidera no Cleveland; Random Forest, no Kaggle.</small>
            </div>
          </article>
        </section>
        <section className="panel comparison-panel" id="comparison">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">COMPARAÇÃO DIRETA</span>
              <h2>Algoritmo por algoritmo</h2>
              <p>Médias das 3 repetições da validação cruzada</p>
            </div>
            <div className="legend">
              {(scope === 'all' ? datasetIds : [scope]).map(dataset => (
                <span key={dataset}>
                  <i style={{ background: datasetInfo[dataset].color }} />
                  {datasetInfo[dataset].name}
                </span>
              ))}
            </div>
          </div>
          <div className="metric-tabs" role="tablist" aria-label="Métrica do gráfico">
            {metricIds.map(item => (
              <button
                key={item}
                role="tab"
                aria-selected={metric === item}
                className={metric === item ? 'active' : ''}
                onClick={() => setMetric(item)}
              >
                {metricInfo[item].short}
              </button>
            ))}
          </div>
          <ComparisonChart metric={metric} scope={scope} />
          <div className="chart-caption">
            <span>★ Melhor resultado na base</span>
            <span>Para Brier, Log loss e Tempo, valores menores são melhores.</span>
          </div>
        </section>
        <section className="panel models-panel" id="models">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">ANÁLISE DETALHADA</span>
              <h2>Perfil por modelo</h2>
              <p>Métricas, dispersão, erros e configuração selecionada</p>
            </div>
          </div>
          <div className="algorithm-tabs" role="tablist" aria-label="Selecionar algoritmo">
            {algorithmIds.map(item => (
              <button
                key={item}
                role="tab"
                aria-selected={algorithm === item}
                className={algorithm === item ? 'active' : ''}
                onClick={() => setAlgorithm(item)}
              >
                <b style={{ background: algorithmInfo[item].color }}>{algorithmInfo[item].short}</b>
                <span>{algorithmInfo[item].name}</span>
              </button>
            ))}
          </div>
          <div className="details-grid">
            {datasetIds
              .filter(dataset => scope === 'all' || scope === dataset)
              .map(dataset => (
                <DatasetDetail key={dataset} result={getResult(dataset, algorithm)} selectedMetric={metric} />
              ))}
          </div>
        </section>
        <section className="panel metrics-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">VISÃO TABULAR</span>
              <h2>Todas as métricas</h2>
              <p>O destaque indica o melhor valor em cada coluna</p>
            </div>
            <button className="export-button" onClick={() => window.print()}>
              <Icon name="download" /> Exportar relatório
            </button>
          </div>
          <MetricTable scope={scope} />
        </section>
        <section className="methodology" id="methodology">
          <div>
            <span className="method-icon">
              <Icon name="info" />
            </span>
            <div>
              <strong>Como ler este painel</strong>
              <p>
                Os valores exibidos são médias de 3 repetições. “±” representa o desvio-padrão. Sensibilidade mede a
                detecção de pacientes com doença; especificidade, a identificação de pacientes sem doença. MCC e ROC-AUC
                sintetizam a qualidade preditiva, enquanto Brier e Log loss avaliam a calibração probabilística.
              </p>
            </div>
          </div>
          <div className="dataset-facts">
            <span>
              <small>Cleveland</small>
              <strong>303 registros</strong>
            </span>
            <span>
              <small>Kaggle</small>
              <strong>68.610 registros</strong>
            </span>
            <span>
              <small>Avaliação</small>
              <strong>3 repetições</strong>
            </span>
            <span>
              <small>Modelos</small>
              <strong>4 algoritmos</strong>
            </span>
          </div>
        </section>
        <footer>CardioBench · Resultados calculados a partir dos arquivos experimentais do projeto</footer>
      </main>
    </div>
  )
}

export default App

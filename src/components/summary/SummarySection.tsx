import { algorithmInfo, type StageId } from '../../data'
import {
  formatMetric,
  getBestResult,
  metricValue,
  validateInferenceData,
} from '../../lib/dashboard'
import { SummaryCard } from './SummaryCard'

const accents = {
  purple: 'var(--color-purple)',
  teal: 'var(--color-teal)',
  coral: 'var(--color-coral)',
} as const

type InsightCardProps = {
  stage: StageId
  inferenceIsValid: boolean
  comparisonCount: number
  significantCount: number
}

function InsightCard({
  stage,
  inferenceIsValid,
  comparisonCount,
  significantCount,
}: InsightCardProps) {
  const isNested = stage === 'nested'

  return (
    <article className="insight-card">
      <span className="insight-icon">{isNested ? '∅' : '↗'}</span>
      <div>
        <span className="eyebrow">
          {isNested ? 'DECISÃO INFERENCIAL' : 'LEITURA DESCRITIVA'}
        </span>
        <strong>
          {isNested
            ? inferenceIsValid
              ? 'Hipótese nula não rejeitada'
              : 'Análise indisponível'
            : 'A ordenação por MCC varia entre as bases'}
        </strong>
        <small>
          {isNested
            ? inferenceIsValid
              ? `${significantCount} de ${comparisonCount} comparações significativas após Holm. O resultado não demonstra equivalência.`
              : 'Validação dos arquivos necessária.'
            : 'Naive Bayes tem a maior média no Cleveland; Random Forest, no Kaggle. Sem inferência de significância.'}
        </small>
      </div>
    </article>
  )
}

export function SummarySection({ stage }: { stage: StageId }) {
  const clevelandBest = getBestResult(stage, 'cleveland', 'MCC')
  const kaggleBest =
    stage === 'exploratory' ? getBestResult('exploratory', 'kaggle', 'MCC') : undefined
  const { comparisonCount, significantCount, valid: inferenceIsValid } =
    validateInferenceData()

  return (
    <section className="summary-grid">
      {stage === 'exploratory' ? (
        <>
          <SummaryCard
            eyebrow="MAIOR MCC MÉDIO • CLEVELAND"
            value={formatMetric(
              'MCC',
              clevelandBest ? metricValue(clevelandBest, 'MCC') : Number.NaN,
            )}
            label={clevelandBest ? algorithmInfo[clevelandBest.algorithm].name : 'Indisponível'}
            accent={accents.purple}
            footnote="Média descritiva de 3 repetições"
          />
          <SummaryCard
            eyebrow="MAIOR MCC MÉDIO • KAGGLE"
            value={formatMetric('MCC', kaggleBest ? metricValue(kaggleBest, 'MCC') : Number.NaN)}
            label={kaggleBest ? algorithmInfo[kaggleBest.algorithm].name : 'Indisponível'}
            accent={accents.teal}
            footnote="Média descritiva de 3 repetições"
          />
          <SummaryCard
            eyebrow="ETAPA EXPLORATÓRIA"
            value="8"
            label="combinações algoritmo/base"
            accent={accents.coral}
            footnote="Resultados sujeitos a otimismo de seleção"
          />
        </>
      ) : (
        <>
          <SummaryCard
            eyebrow="MAIOR MCC MÉDIO • COMPLEMENTAR"
            value={formatMetric(
              'MCC',
              clevelandBest ? metricValue(clevelandBest, 'MCC') : Number.NaN,
            )}
            label={clevelandBest ? algorithmInfo[clevelandBest.algorithm].name : 'Indisponível'}
            accent={accents.purple}
            footnote="Média de 15 folds externos"
          />
          <SummaryCard
            eyebrow="AVALIAÇÃO EXTERNA"
            value="15"
            label="folds externos"
            accent={accents.teal}
            footnote="5 folds × 3 repetições"
          />
          <SummaryCard
            eyebrow="AMOSTRA CLEVELAND"
            value="303"
            label="registros reutilizados"
            accent={accents.coral}
            footnote="909 predições = 303 × 3 repetições"
          />
        </>
      )}
      <InsightCard
        stage={stage}
        inferenceIsValid={inferenceIsValid}
        comparisonCount={comparisonCount}
        significantCount={significantCount}
      />
    </section>
  )
}

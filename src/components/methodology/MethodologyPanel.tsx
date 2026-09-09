import { stageInfo, type StageId } from '../../data'
import { Icon } from '../ui/Icon'

const stageDescriptions: Record<StageId, string> = {
  exploratory:
    'A etapa exploratória usa 5 partições e 3 repetições, com seleção e resumo nas mesmas avaliações. Os resultados são descritivos e podem conter otimismo de seleção. Cleveland e Kaggle não são combinadas em uma média global.',
  nested:
    'A etapa complementar foi acrescentada após a análise exploratória e reutiliza os 303 registros da Cleveland. Ela seleciona configurações internamente e estima desempenho em folds externos reservados, mas não constitui validação em uma população externa independente. A Kaggle permaneceu exploratória por viabilidade computacional.',
}

export function MethodologyPanel({ stage }: { stage: StageId }) {
  return (
    <>
      <section className="methodology" id="methodology">
        <div>
          <span className="method-icon">
            <Icon name="info" />
          </span>
          <div>
            <strong>Como ler esta etapa</strong>
            <p>{stageDescriptions[stage]}</p>
          </div>
        </div>

        <div className="dataset-facts">
          <span>
            <small>Unidade do resumo</small>
            <strong>{stage === 'nested' ? '15 folds externos' : '3 repetições OOF'}</strong>
          </span>
          <span>
            <small>Medida principal</small>
            <strong>MCC</strong>
          </span>
          <span>
            <small>Classificadores</small>
            <strong>4 algoritmos</strong>
          </span>
          <span>
            <small>Protocolo</small>
            <strong>
              {stage === 'nested' ? '5×3 externo · 3 interno' : '5 folds · 3 repetições'}
            </strong>
          </span>
        </div>
      </section>
      <footer>
        CardioBench · {stageInfo[stage].name} · resultados locais exportados pelo R
      </footer>
    </>
  )
}

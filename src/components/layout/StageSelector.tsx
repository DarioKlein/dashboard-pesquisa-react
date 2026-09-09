import { stageInfo, type StageId } from '../../data'

const stages: StageId[] = ['exploratory', 'nested']

type StageSelectorProps = {
  stage: StageId
  onChange: (stage: StageId) => void
}

export function StageSelector({ stage, onChange }: StageSelectorProps) {
  return (
    <section className="stage-selector" aria-label="Selecionar etapa experimental">
      {stages.map((item, index) => (
        <button
          key={item}
          className={`stage-option ${stage === item ? 'active' : ''}`}
          onClick={() => onChange(item)}
          aria-pressed={stage === item}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>{stageInfo[item].name}</strong>
            <small>{item === 'exploratory' ? 'Cleveland + Kaggle' : 'Cleveland · validação aninhada'}</small>
          </div>
        </button>
      ))}
      <p>{stageInfo[stage].description}</p>
    </section>
  )
}

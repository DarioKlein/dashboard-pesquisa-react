import { useState } from 'react'
import { parseFinite, type ModelResult } from '../../data'
import { integerFormatter } from '../../lib/dashboard'

const repetitions = ['1', '2', '3']
const confusionKeys = ['VP', 'VN', 'FP', 'FN']

export function ConfusionMatrix({ result }: { result: ModelResult }) {
  const [repetition, setRepetition] = useState('1')
  const rows = result.confusionRows
  const selectedRow =
    result.stage === 'nested'
      ? rows.find((row) => row.Repeticao === repetition)
      : undefined

  const getValue = (key: string) =>
    selectedRow
      ? parseFinite(selectedRow[key])
      : rows.reduce((sum, row) => sum + parseFinite(row[key]), 0) / rows.length

  const matrixTotal = confusionKeys.reduce((sum, key) => sum + getValue(key), 0)

  return (
    <div className="matrix-section">
      {result.stage === 'nested' && (
        <div className="repetition-control" aria-label="Selecionar repetição da matriz">
          {repetitions.map((item) => (
            <button
              key={item}
              className={repetition === item ? 'active' : undefined}
              onClick={() => setRepetition(item)}
            >
              R{item}
            </button>
          ))}
        </div>
      )}

      <div className="matrix-block">
        <div className="matrix-axis top">Predito</div>
        <div className="matrix-axis side">Real</div>
        <div className="matrix-labels">
          <span>Doença</span>
          <span>Sem doença</span>
        </div>
        <div className="matrix-grid">
          <div className="matrix-good">
            <strong>{integerFormatter.format(Math.round(getValue('VP')))}</strong>
            <small>Verdadeiro positivo</small>
          </div>
          <div className="matrix-bad">
            <strong>{integerFormatter.format(Math.round(getValue('FN')))}</strong>
            <small>Falso negativo</small>
          </div>
          <div className="matrix-bad">
            <strong>{integerFormatter.format(Math.round(getValue('FP')))}</strong>
            <small>Falso positivo</small>
          </div>
          <div className="matrix-good">
            <strong>{integerFormatter.format(Math.round(getValue('VN')))}</strong>
            <small>Verdadeiro negativo</small>
          </div>
        </div>
      </div>

      <small className="matrix-total">
        {result.stage === 'nested'
          ? `Repetição ${repetition} · previsões externas reunidas · ${integerFormatter.format(matrixTotal)} registros`
          : 'Contagens médias das 3 repetições OOF'}
      </small>
    </div>
  )
}

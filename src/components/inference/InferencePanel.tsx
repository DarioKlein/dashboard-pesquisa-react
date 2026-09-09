import {
  algorithmInfo,
  mccComparisons,
  parseFinite,
} from '../../data'
import {
  algorithmFromCsv,
  formatDecimal,
  validateInferenceData,
} from '../../lib/dashboard'
import { PanelHeading } from '../ui/PanelHeading'

export function InferencePanel() {
  const { alpha, valid } = validateInferenceData()
  const significantCount = valid
    ? mccComparisons.filter((row) => parseFinite(row.P_Holm) < alpha).length
    : 0

  const status = (
    <span className={`inference-status ${valid ? 'valid' : 'invalid'}`}>
      {valid ? `${significantCount}/6 significativas` : 'Análise indisponível'}
    </span>
  )

  return (
    <section className="panel inference-panel" id="inference">
      <PanelHeading
        kicker="ANÁLISE INFERENCIAL"
        title="Comparações pareadas de MCC"
        description="Teste t pareado com correção para reamostragem, 14 graus de liberdade e ajuste de Holm."
        action={status}
      />

      {valid ? (
        <>
          <div className="inference-conclusion">
            <span>
              {significantCount === 0
                ? 'H₀ não rejeitada'
                : 'Há evidência de diferença'}
            </span>
            <p>
              {significantCount === 0
                ? 'Não foram encontradas diferenças estatisticamente significativas de MCC entre os classificadores após o ajuste de Holm, ao nível de 5%. Esse resultado não demonstra equivalência entre os modelos.'
                : `${significantCount} comparação(ões) apresentou(aram) p ajustado inferior a ${formatDecimal(alpha, 2)}.`}
            </p>
          </div>

          <div className="table-wrap inference-table">
            <table>
              <thead>
                <tr>
                  <th>Comparação</th>
                  <th>MCC médio A</th>
                  <th>MCC médio B</th>
                  <th>Diferença A − B</th>
                  <th>p ajustado · Holm</th>
                  <th>Evidência a 5%</th>
                </tr>
              </thead>
              <tbody>
                {mccComparisons.map((row) => {
                  const firstAlgorithm = algorithmFromCsv(row.Algoritmo_A)
                  const secondAlgorithm = algorithmFromCsv(row.Algoritmo_B)
                  const isSignificant = parseFinite(row.P_Holm) < alpha

                  return (
                    <tr key={`${firstAlgorithm}-${secondAlgorithm}`}>
                      <td>
                        {algorithmInfo[firstAlgorithm].name} ×{' '}
                        {algorithmInfo[secondAlgorithm].name}
                      </td>
                      <td>{formatDecimal(parseFinite(row.MCC_Medio_A), 3)}</td>
                      <td>{formatDecimal(parseFinite(row.MCC_Medio_B), 3)}</td>
                      <td>
                        {formatDecimal(
                          parseFinite(row.Diferenca_Media_A_menos_B),
                          3,
                        )}
                      </td>
                      <td>{formatDecimal(parseFinite(row.P_Holm), 6)}</td>
                      <td>
                        <span
                          className={`evidence ${isSignificant ? 'yes' : 'no'}`}
                        >
                          {isSignificant ? 'Sim' : 'Não'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="panel-footnote">
            Comparações bilaterais; inferência aproximada. A decisão utiliza o
            valor integral de p ajustado, não o valor arredondado exibido.
          </p>
        </>
      ) : (
        <div className="empty-state large">
          Os arquivos inferenciais ou a validação da execução estão ausentes ou
          inconsistentes. Nenhuma conclusão foi produzida.
        </div>
      )}
    </section>
  )
}

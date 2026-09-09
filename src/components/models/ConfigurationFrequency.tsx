import {
  algorithmInfo,
  parseFinite,
  type ModelResult,
} from '../../data'
import {
  configurationParameters,
  formatPercentage,
  readableConfiguration,
} from '../../lib/dashboard'

export function ConfigurationFrequency({ result }: { result: ModelResult }) {
  const frequencies = [...result.frequencies].sort(
    (first, second) =>
      parseFinite(second.Frequencia) - parseFinite(first.Frequencia),
  )

  return (
    <div className="frequency-panel">
      <div className="subheading">
        <span>Frequência de seleção</span>
        <small>15 treinamentos externos</small>
      </div>

      <div className="frequency-list">
        {frequencies.map((row, index) => {
          const count = parseFinite(row.Frequencia)
          return (
            <div className="frequency-row" key={row.Configuracao}>
              <div>
                <strong>{readableConfiguration(row.Configuracao)}</strong>
                <small>
                  {configurationParameters(result, row.Configuracao) ||
                    'Configuração da grade experimental'}
                </small>
              </div>
              <span className="frequency-track">
                <i
                  style={{
                    width: `${(count / 15) * 100}%`,
                    background: algorithmInfo[result.algorithm].color,
                  }}
                />
              </span>
              <b>
                {count}/15 <small>{formatPercentage(count / 15, 0)}</small>
              </b>
              {index === 0 && <em>mais frequente</em>}
            </div>
          )
        })}
      </div>

      <p>
        A configuração mais frequente não representa um modelo final único; a
        seleção foi refeita em cada treinamento externo.
      </p>
    </div>
  )
}

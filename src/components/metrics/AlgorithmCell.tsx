import { algorithmInfo, type AlgorithmId } from '../../data'

export function AlgorithmCell({ algorithm }: { algorithm: AlgorithmId }) {
  const info = algorithmInfo[algorithm]

  return (
    <td>
      <b style={{ background: info.color }}>{info.short}</b>
      <span>{info.name}</span>
    </td>
  )
}

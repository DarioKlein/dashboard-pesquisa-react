import type { AlgorithmId, ModelResult } from '../data'

export const algorithmFromCsv = (value: string): AlgorithmId =>
  value === 'decision_trees' ? 'decision_tree' : (value as AlgorithmId)

export const readableConfiguration = (value: string) =>
  value
    .replaceAll('_', ' ')
    .replace('arvore', 'árvore')
    .replace('profundidade', 'prof.')
    .replace('arvores', 'árvores')

export const configurationParameters = (
  result: ModelResult,
  configuration: string,
) => {
  const row = result.selectedConfigs.find(
    (selected) => selected.Configuracao_Selecionada === configuration,
  )
  if (!row) return ''

  const ignoredFields = new Set([
    'Protocolo',
    'Execucao',
    'Base',
    'Algoritmo',
    'Repeticao',
    'Fold_Externo',
    'Semente_Externa',
    'Semente_Interna',
    'Semente_Reajuste',
    'N_Treino_Externo',
    'N_Teste_Externo',
    'Configuracao_Selecionada',
    'MCC_Interno_Medio',
  ])

  return Object.entries(row)
    .filter(
      ([key, value]) =>
        !ignoredFields.has(key) && value !== '' && value !== 'NA',
    )
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`)
    .join(' · ')
}

import type { AlgorithmId, DatasetId, StageId } from './types'

export const experimentDesign = {
  exploratory: {
    folds: 5,
    repetitions: 3,
  },
  nested: {
    outerFolds: 5,
    repetitions: 3,
    innerFolds: 3,
    outerEvaluations: 15,
    sampleSize: 303,
    oofPredictions: 909,
  },
} as const

export const algorithmInfo: Record<
  AlgorithmId,
  { name: string; short: string; color: string }
> = {
  decision_tree: {
    name: 'Árvore de Decisão',
    short: 'AD',
    color: 'var(--color-coral)',
  },
  naive_bayes: {
    name: 'Naive Bayes',
    short: 'NB',
    color: 'var(--color-purple)',
  },
  random_forest: {
    name: 'Random Forest',
    short: 'RF',
    color: 'var(--color-teal)',
  },
  svm: { name: 'SVM linear', short: 'SVM', color: 'var(--color-gold)' },
}

export const datasetInfo: Record<
  DatasetId,
  { name: string; sampleSize: number; color: string }
> = {
  cleveland: {
    name: 'Cleveland',
    sampleSize: 303,
    color: 'var(--color-purple)',
  },
  kaggle: {
    name: 'Kaggle',
    sampleSize: 68610,
    color: 'var(--color-teal)',
  },
}

export const stageInfo: Record<
  StageId,
  { name: string; short: string; description: string }
> = {
  exploratory: {
    name: 'Etapa exploratória',
    short: 'Exploratória',
    description:
      'Validação cruzada estratificada com 5 partições e 3 repetições. A configuração foi selecionada e resumida pelas mesmas avaliações. Resultados descritivos, sujeitos a otimismo de seleção.',
  },
  nested: {
    name: 'Avaliação complementar — Cleveland',
    short: 'Complementar',
    description:
      'Validação cruzada aninhada na Cleveland: 5 partições externas, 3 repetições e 3 partições internas. Seleção de configurações nos dados internos e avaliação nos testes externos reservados.',
  },
}

export const metricInfo = {
  Acuracia: { label: 'Acurácia', short: 'Acurácia', better: 'high' },
  Sensibilidade: { label: 'Sensibilidade', short: 'Sensib.', better: 'high' },
  Especificidade: { label: 'Especificidade', short: 'Especif.', better: 'high' },
  Precisao: { label: 'Precisão', short: 'Precisão', better: 'high' },
  F1: { label: 'F1-score', short: 'F1', better: 'high' },
  MCC: { label: 'Coeficiente de Matthews', short: 'MCC', better: 'high' },
  ROC_AUC: { label: 'ROC-AUC', short: 'ROC-AUC', better: 'high' },
  Brier: { label: 'Brier score', short: 'Brier', better: 'low' },
  Log_Loss: { label: 'Log loss', short: 'Log loss', better: 'low' },
  Acuracia_Balanceada: {
    label: 'Acurácia balanceada',
    short: 'Ac. bal.',
    better: 'high',
  },
  Tempo_Execucao_Segundos: {
    label: 'Tempo de execução',
    short: 'Tempo',
    better: 'low',
  },
  Tempo_Selecao_Segundos: {
    label: 'Tempo de seleção',
    short: 'Seleção',
    better: 'low',
  },
  Tempo_Reajuste_Segundos: {
    label: 'Tempo de reajuste',
    short: 'Reajuste',
    better: 'low',
  },
  Tempo_Predicao_Segundos: {
    label: 'Tempo de predição',
    short: 'Predição',
    better: 'low',
  },
  Tempo_Total_Fold_Segundos: {
    label: 'Tempo total por fold externo',
    short: 'Tempo total',
    better: 'low',
  },
} as const

export type MetricId = keyof typeof metricInfo

export const algorithmIds = Object.keys(algorithmInfo) as AlgorithmId[]
export const datasetIds = Object.keys(datasetInfo) as DatasetId[]
export const stageIds = Object.keys(stageInfo) as StageId[]
export const predictiveMetricIds: MetricId[] = [
  'Acuracia',
  'Sensibilidade',
  'Especificidade',
  'Precisao',
  'F1',
  'MCC',
  'ROC_AUC',
  'Brier',
  'Log_Loss',
  'Acuracia_Balanceada',
]
export const exploratoryMetricIds: MetricId[] = [
  ...predictiveMetricIds,
  'Tempo_Execucao_Segundos',
]
export const nestedMetricIds: MetricId[] = [
  ...predictiveMetricIds,
  'Tempo_Total_Fold_Segundos',
]
export const nestedTimeMetricIds: MetricId[] = [
  'Tempo_Selecao_Segundos',
  'Tempo_Reajuste_Segundos',
  'Tempo_Predicao_Segundos',
  'Tempo_Total_Fold_Segundos',
]

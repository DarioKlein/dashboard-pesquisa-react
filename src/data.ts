import clevelandTreeSummary from '../data/results-clevand/decision_trees_cv_resumo_modelo.csv?raw'
import clevelandTreeRanking from '../data/results-clevand/decision_trees_cv_ranking_configuracoes.csv?raw'
import clevelandTreeRuns from '../data/results-clevand/decision_trees_cv_resultados_repeticoes.csv?raw'
import clevelandNbSummary from '../data/results-clevand/naive_bayes_cv_resumo_modelo.csv?raw'
import clevelandNbRanking from '../data/results-clevand/naive_bayes_cv_ranking_configuracoes.csv?raw'
import clevelandNbRuns from '../data/results-clevand/naive_bayes_cv_resultados_repeticoes.csv?raw'
import clevelandRfSummary from '../data/results-clevand/random_forest_cv_resumo_modelo.csv?raw'
import clevelandRfRanking from '../data/results-clevand/random_forest_cv_ranking_configuracoes.csv?raw'
import clevelandRfRuns from '../data/results-clevand/random_forest_cv_resultados_repeticoes.csv?raw'
import clevelandSvmSummary from '../data/results-clevand/svm_cv_resumo_modelo.csv?raw'
import clevelandSvmRanking from '../data/results-clevand/svm_cv_ranking_configuracoes.csv?raw'
import clevelandSvmRuns from '../data/results-clevand/svm_cv_resultados_repeticoes.csv?raw'
import kaggleTreeSummary from '../data/results-kaggle/decision_trees_cv_resumo_modelo.csv?raw'
import kaggleTreeRanking from '../data/results-kaggle/decision_trees_cv_ranking_configuracoes.csv?raw'
import kaggleTreeRuns from '../data/results-kaggle/decision_trees_cv_resultados_repeticoes.csv?raw'
import kaggleNbSummary from '../data/results-kaggle/naive_bayes_cv_resumo_modelo.csv?raw'
import kaggleNbRanking from '../data/results-kaggle/naive_bayes_cv_ranking_configuracoes.csv?raw'
import kaggleNbRuns from '../data/results-kaggle/naive_bayes_cv_resultados_repeticoes.csv?raw'
import kaggleRfSummary from '../data/results-kaggle/random_forest_cv_resumo_modelo.csv?raw'
import kaggleRfRanking from '../data/results-kaggle/random_forest_cv_ranking_configuracoes.csv?raw'
import kaggleRfRuns from '../data/results-kaggle/random_forest_cv_resultados_repeticoes.csv?raw'
import kaggleSvmSummary from '../data/results-kaggle/svm_cv_resumo_modelo.csv?raw'
import kaggleSvmRanking from '../data/results-kaggle/svm_cv_ranking_configuracoes.csv?raw'
import kaggleSvmRuns from '../data/results-kaggle/svm_cv_resultados_repeticoes.csv?raw'

export type DatasetId = 'cleveland' | 'kaggle'
export type AlgorithmId = 'decision_tree' | 'naive_bayes' | 'random_forest' | 'svm'
export type CsvRow = Record<string, string>
export type ModelResult = { dataset: DatasetId; algorithm: AlgorithmId; summary: Record<string, { mean: number; sd: number }>; ranking: CsvRow[]; runs: CsvRow[] }

const parseCsvLine = (line: string) => {
  const cells: string[] = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { cell += '"'; index += 1 } else { quoted = !quoted }
    } else if (char === ',' && !quoted) { cells.push(cell); cell = '' } else { cell += char }
  }
  cells.push(cell)
  return cells
}

export const parseCsv = (csv: string): CsvRow[] => {
  const lines = csv.trim().split(/\r?\n/)
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, parseCsvLine(line)[index] ?? ''])))
}

const buildResult = (dataset: DatasetId, algorithm: AlgorithmId, summaryCsv: string, rankingCsv: string, runsCsv: string): ModelResult => ({
  dataset, algorithm,
  summary: Object.fromEntries(parseCsv(summaryCsv).map((row) => [row.Metrica, { mean: Number(row.Media), sd: Number(row.DP) }])),
  ranking: parseCsv(rankingCsv), runs: parseCsv(runsCsv),
})

export const results: ModelResult[] = [
  buildResult('cleveland', 'decision_tree', clevelandTreeSummary, clevelandTreeRanking, clevelandTreeRuns),
  buildResult('cleveland', 'naive_bayes', clevelandNbSummary, clevelandNbRanking, clevelandNbRuns),
  buildResult('cleveland', 'random_forest', clevelandRfSummary, clevelandRfRanking, clevelandRfRuns),
  buildResult('cleveland', 'svm', clevelandSvmSummary, clevelandSvmRanking, clevelandSvmRuns),
  buildResult('kaggle', 'decision_tree', kaggleTreeSummary, kaggleTreeRanking, kaggleTreeRuns),
  buildResult('kaggle', 'naive_bayes', kaggleNbSummary, kaggleNbRanking, kaggleNbRuns),
  buildResult('kaggle', 'random_forest', kaggleRfSummary, kaggleRfRanking, kaggleRfRuns),
  buildResult('kaggle', 'svm', kaggleSvmSummary, kaggleSvmRanking, kaggleSvmRuns),
]

export const algorithmInfo: Record<AlgorithmId, { name: string; short: string; color: string }> = {
  decision_tree: { name: 'Árvore de Decisão', short: 'AD', color: '#F28C6F' },
  naive_bayes: { name: 'Naive Bayes', short: 'NB', color: '#7B78DB' },
  random_forest: { name: 'Random Forest', short: 'RF', color: '#27A59A' },
  svm: { name: 'SVM', short: 'SVM', color: '#E7B64C' },
}
export const datasetInfo: Record<DatasetId, { name: string; sampleSize: number; color: string }> = {
  cleveland: { name: 'Cleveland', sampleSize: 303, color: '#7B78DB' }, kaggle: { name: 'Kaggle', sampleSize: 68610, color: '#27A59A' },
}
export const metricInfo = {
  Acuracia: { label: 'Acurácia', short: 'Acurácia', better: 'high' }, Sensibilidade: { label: 'Sensibilidade', short: 'Sensib.', better: 'high' },
  Especificidade: { label: 'Especificidade', short: 'Especif.', better: 'high' }, Precisao: { label: 'Precisão', short: 'Precisão', better: 'high' },
  F1: { label: 'F1-score', short: 'F1', better: 'high' }, MCC: { label: 'Coeficiente de Matthews', short: 'MCC', better: 'high' },
  ROC_AUC: { label: 'ROC-AUC', short: 'ROC-AUC', better: 'high' }, Brier: { label: 'Brier score', short: 'Brier', better: 'low' },
  Log_Loss: { label: 'Log loss', short: 'Log loss', better: 'low' }, Acuracia_Balanceada: { label: 'Acurácia balanceada', short: 'Ac. bal.', better: 'high' },
  Tempo_Execucao_Segundos: { label: 'Tempo de execução', short: 'Tempo', better: 'low' },
} as const
export type MetricId = keyof typeof metricInfo
export const algorithmIds = Object.keys(algorithmInfo) as AlgorithmId[]
export const datasetIds = Object.keys(datasetInfo) as DatasetId[]
export const metricIds = Object.keys(metricInfo) as MetricId[]

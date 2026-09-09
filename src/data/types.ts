export type StageId = 'exploratory' | 'nested'
export type DatasetId = 'cleveland' | 'kaggle'
export type AlgorithmId = 'decision_tree' | 'naive_bayes' | 'random_forest' | 'svm'
export type AggregationUnit = 'repetition_oof' | 'outer_fold'
export type CsvRow = Record<string, string>

export type MetricSummary = {
  mean: number
  sd: number
  evaluations: number
  unit: AggregationUnit
}

export type ModelResult = {
  stage: StageId
  dataset: DatasetId
  algorithm: AlgorithmId
  protocol: string
  summary: Record<string, MetricSummary>
  evaluationRows: CsvRow[]
  confusionRows: CsvRow[]
  ranking: CsvRow[]
  frequencies: CsvRow[]
  selectedConfigs: CsvRow[]
}

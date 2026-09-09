import {
  datasetIds,
  metricInfo,
  results,
  type AlgorithmId,
  type DatasetId,
  type MetricId,
  type ModelResult,
  type StageId,
} from '../data'
import type { Scope } from './types'

export const getVisibleDatasets = (
  stage: StageId,
  scope: Scope,
): DatasetId[] =>
  stage === 'nested' ? ['cleveland'] : scope === 'all' ? datasetIds : [scope]

export const metricValue = (result: ModelResult, metric: MetricId) =>
  result.summary[metric]?.mean ?? Number.NaN

export const metricSd = (result: ModelResult, metric: MetricId) =>
  result.summary[metric]?.sd ?? Number.NaN

export const getResult = (
  stage: StageId,
  dataset: DatasetId,
  algorithm: AlgorithmId,
) =>
  results.find(
    (result) =>
      result.stage === stage &&
      result.dataset === dataset &&
      result.algorithm === algorithm,
  )

export const getBestResult = (
  stage: StageId,
  dataset: DatasetId,
  metric: MetricId,
) => {
  const direction = metricInfo[metric].better === 'high' ? 1 : -1

  return results
    .filter(
      (result) =>
        result.stage === stage &&
        result.dataset === dataset &&
        Number.isFinite(metricValue(result, metric)),
    )
    .sort(
      (first, second) =>
        direction *
        (metricValue(second, metric) - metricValue(first, metric)),
    )[0]
}

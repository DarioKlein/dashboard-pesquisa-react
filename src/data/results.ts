import { parseCsv, parseFinite } from './csv'
import type { AggregationUnit, AlgorithmId, DatasetId, ModelResult } from './types'

import clevelandTreeSummary from '../../data/results-clevand/decision_trees_cv_resumo_modelo.csv?raw'
import clevelandTreeRanking from '../../data/results-clevand/decision_trees_cv_ranking_configuracoes.csv?raw'
import clevelandTreeRuns from '../../data/results-clevand/decision_trees_cv_resultados_repeticoes.csv?raw'
import clevelandNbSummary from '../../data/results-clevand/naive_bayes_cv_resumo_modelo.csv?raw'
import clevelandNbRanking from '../../data/results-clevand/naive_bayes_cv_ranking_configuracoes.csv?raw'
import clevelandNbRuns from '../../data/results-clevand/naive_bayes_cv_resultados_repeticoes.csv?raw'
import clevelandRfSummary from '../../data/results-clevand/random_forest_cv_resumo_modelo.csv?raw'
import clevelandRfRanking from '../../data/results-clevand/random_forest_cv_ranking_configuracoes.csv?raw'
import clevelandRfRuns from '../../data/results-clevand/random_forest_cv_resultados_repeticoes.csv?raw'
import clevelandSvmSummary from '../../data/results-clevand/svm_cv_resumo_modelo.csv?raw'
import clevelandSvmRanking from '../../data/results-clevand/svm_cv_ranking_configuracoes.csv?raw'
import clevelandSvmRuns from '../../data/results-clevand/svm_cv_resultados_repeticoes.csv?raw'
import kaggleTreeSummary from '../../data/results-kaggle/decision_trees_cv_resumo_modelo.csv?raw'
import kaggleTreeRanking from '../../data/results-kaggle/decision_trees_cv_ranking_configuracoes.csv?raw'
import kaggleTreeRuns from '../../data/results-kaggle/decision_trees_cv_resultados_repeticoes.csv?raw'
import kaggleNbSummary from '../../data/results-kaggle/naive_bayes_cv_resumo_modelo.csv?raw'
import kaggleNbRanking from '../../data/results-kaggle/naive_bayes_cv_ranking_configuracoes.csv?raw'
import kaggleNbRuns from '../../data/results-kaggle/naive_bayes_cv_resultados_repeticoes.csv?raw'
import kaggleRfSummary from '../../data/results-kaggle/random_forest_cv_resumo_modelo.csv?raw'
import kaggleRfRanking from '../../data/results-kaggle/random_forest_cv_ranking_configuracoes.csv?raw'
import kaggleRfRuns from '../../data/results-kaggle/random_forest_cv_resultados_repeticoes.csv?raw'
import kaggleSvmSummary from '../../data/results-kaggle/svm_cv_resumo_modelo.csv?raw'
import kaggleSvmRanking from '../../data/results-kaggle/svm_cv_ranking_configuracoes.csv?raw'
import kaggleSvmRuns from '../../data/results-kaggle/svm_cv_resultados_repeticoes.csv?raw'

import nestedTreeSummary from '../../data/results-clevand-additional/decision_trees_ncv_resumo_modelo.csv?raw'
import nestedTreeFolds from '../../data/results-clevand-additional/decision_trees_ncv_resultados_folds.csv?raw'
import nestedTreeOof from '../../data/results-clevand-additional/decision_trees_ncv_resultados_repeticoes_oof.csv?raw'
import nestedTreeFrequency from '../../data/results-clevand-additional/decision_trees_ncv_frequencia_configuracoes.csv?raw'
import nestedTreeConfigs from '../../data/results-clevand-additional/decision_trees_ncv_configuracoes_selecionadas.csv?raw'
import nestedNbSummary from '../../data/results-clevand-additional/naive_bayes_ncv_resumo_modelo.csv?raw'
import nestedNbFolds from '../../data/results-clevand-additional/naive_bayes_ncv_resultados_folds.csv?raw'
import nestedNbOof from '../../data/results-clevand-additional/naive_bayes_ncv_resultados_repeticoes_oof.csv?raw'
import nestedNbFrequency from '../../data/results-clevand-additional/naive_bayes_ncv_frequencia_configuracoes.csv?raw'
import nestedNbConfigs from '../../data/results-clevand-additional/naive_bayes_ncv_configuracoes_selecionadas.csv?raw'
import nestedRfSummary from '../../data/results-clevand-additional/random_forest_ncv_resumo_modelo.csv?raw'
import nestedRfFolds from '../../data/results-clevand-additional/random_forest_ncv_resultados_folds.csv?raw'
import nestedRfOof from '../../data/results-clevand-additional/random_forest_ncv_resultados_repeticoes_oof.csv?raw'
import nestedRfFrequency from '../../data/results-clevand-additional/random_forest_ncv_frequencia_configuracoes.csv?raw'
import nestedRfConfigs from '../../data/results-clevand-additional/random_forest_ncv_configuracoes_selecionadas.csv?raw'
import nestedSvmSummary from '../../data/results-clevand-additional/svm_ncv_resumo_modelo.csv?raw'
import nestedSvmFolds from '../../data/results-clevand-additional/svm_ncv_resultados_folds.csv?raw'
import nestedSvmOof from '../../data/results-clevand-additional/svm_ncv_resultados_repeticoes_oof.csv?raw'
import nestedSvmFrequency from '../../data/results-clevand-additional/svm_ncv_frequencia_configuracoes.csv?raw'
import nestedSvmConfigs from '../../data/results-clevand-additional/svm_ncv_configuracoes_selecionadas.csv?raw'
import mccComparisonsCsv from '../../data/results-clevand-additional/mcc_comparacoes_pareadas.csv?raw'
import mccDecisionCsv from '../../data/results-clevand-additional/mcc_decisao_global.csv?raw'
import nestedValidationCsv from '../../data/results-clevand-additional/validacao_resultados.csv?raw'

const summaryFromCsv = (csv: string, fallbackEvaluations: number, fallbackUnit: AggregationUnit) =>
  Object.fromEntries(
    parseCsv(csv).map(row => [
      row.Metrica,
      {
        mean: parseFinite(row.Media),
        sd: parseFinite(row.DP),
        evaluations: Number.isFinite(parseFinite(row.N_Avaliacoes)) ? parseFinite(row.N_Avaliacoes) : fallbackEvaluations,
        unit: row.Unidade_Agregacao === 'fold_externo' ? 'outer_fold' : fallbackUnit,
      },
    ]),
  )

const buildExploratoryResult = (
  dataset: DatasetId,
  algorithm: AlgorithmId,
  summaryCsv: string,
  rankingCsv: string,
  runsCsv: string,
): ModelResult => {
  const runs = parseCsv(runsCsv)
  return {
    stage: 'exploratory',
    dataset,
    algorithm,
    protocol: 'Validação cruzada estratificada 5 × 3',
    summary: summaryFromCsv(summaryCsv, 3, 'repetition_oof'),
    evaluationRows: runs,
    confusionRows: runs,
    ranking: parseCsv(rankingCsv),
    frequencies: [],
    selectedConfigs: [],
  }
}

const buildNestedResult = (
  algorithm: AlgorithmId,
  summaryCsv: string,
  foldsCsv: string,
  oofCsv: string,
  frequencyCsv: string,
  configsCsv: string,
): ModelResult => ({
  stage: 'nested',
  dataset: 'cleveland',
  algorithm,
  protocol: 'cleveland_ncv_5x3_inner3_v1',
  summary: summaryFromCsv(summaryCsv, 15, 'outer_fold'),
  evaluationRows: parseCsv(foldsCsv),
  confusionRows: parseCsv(oofCsv),
  ranking: [],
  frequencies: parseCsv(frequencyCsv),
  selectedConfigs: parseCsv(configsCsv),
})

export const results: ModelResult[] = [
  buildExploratoryResult('cleveland', 'decision_tree', clevelandTreeSummary, clevelandTreeRanking, clevelandTreeRuns),
  buildExploratoryResult('cleveland', 'naive_bayes', clevelandNbSummary, clevelandNbRanking, clevelandNbRuns),
  buildExploratoryResult('cleveland', 'random_forest', clevelandRfSummary, clevelandRfRanking, clevelandRfRuns),
  buildExploratoryResult('cleveland', 'svm', clevelandSvmSummary, clevelandSvmRanking, clevelandSvmRuns),
  buildExploratoryResult('kaggle', 'decision_tree', kaggleTreeSummary, kaggleTreeRanking, kaggleTreeRuns),
  buildExploratoryResult('kaggle', 'naive_bayes', kaggleNbSummary, kaggleNbRanking, kaggleNbRuns),
  buildExploratoryResult('kaggle', 'random_forest', kaggleRfSummary, kaggleRfRanking, kaggleRfRuns),
  buildExploratoryResult('kaggle', 'svm', kaggleSvmSummary, kaggleSvmRanking, kaggleSvmRuns),
  buildNestedResult('decision_tree', nestedTreeSummary, nestedTreeFolds, nestedTreeOof, nestedTreeFrequency, nestedTreeConfigs),
  buildNestedResult('naive_bayes', nestedNbSummary, nestedNbFolds, nestedNbOof, nestedNbFrequency, nestedNbConfigs),
  buildNestedResult('random_forest', nestedRfSummary, nestedRfFolds, nestedRfOof, nestedRfFrequency, nestedRfConfigs),
  buildNestedResult('svm', nestedSvmSummary, nestedSvmFolds, nestedSvmOof, nestedSvmFrequency, nestedSvmConfigs),
]

export const mccComparisons = parseCsv(mccComparisonsCsv)
export const mccDecision = parseCsv(mccDecisionCsv)[0]
export const nestedValidation = parseCsv(nestedValidationCsv)


import {
  experimentDesign,
  mccComparisons,
  mccDecision,
  nestedValidation,
  parseFinite,
} from '../data'

export const validateInferenceData = () => {
  const alpha = parseFinite(mccDecision?.Alfa)
  const validationsAreValid =
    nestedValidation.length === 4 &&
    nestedValidation.every(
      (row) =>
        row.Status === 'valido' &&
        parseFinite(row.Folds_Externos) ===
          experimentDesign.nested.outerEvaluations &&
        parseFinite(row.Predicoes_OOF) ===
          experimentDesign.nested.oofPredictions,
    )
  const comparisonsAreValid =
    mccComparisons.length === 6 &&
    mccComparisons.every(
      (row) =>
        row.Status === 'valido' &&
        parseFinite(row.N_Avaliacoes) ===
          experimentDesign.nested.outerEvaluations &&
        Number.isFinite(parseFinite(row.P_Holm)),
    )
  const decisionIsValid =
    Boolean(mccDecision) &&
    parseFinite(mccDecision?.Pares_Validos) === 6 &&
    Number.isFinite(alpha)

  const valid = decisionIsValid && validationsAreValid && comparisonsAreValid
  const significantCount = valid
    ? mccComparisons.filter((row) => parseFinite(row.P_Holm) < alpha).length
    : 0

  return {
    alpha,
    valid,
    comparisonCount: valid ? mccComparisons.length : 0,
    significantCount,
  }
}

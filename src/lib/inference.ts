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

  return {
    alpha,
    valid: decisionIsValid && validationsAreValid && comparisonsAreValid,
  }
}

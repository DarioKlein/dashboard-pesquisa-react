import type { CsvRow } from './types'

const parseCsvLine = (line: string) => {
  const cells: string[] = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      cells.push(cell)
      cell = ''
    } else {
      cell += character
    }
  }

  cells.push(cell)
  return cells
}

export const parseCsv = (csv: string): CsvRow[] => {
  const lines = csv.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return Object.fromEntries(
      headers.map((header, index) => [header, cells[index] ?? '']),
    )
  })
}

export const parseFinite = (value: string | undefined) => {
  if (
    value === undefined ||
    value.trim() === '' ||
    value.trim().toUpperCase() === 'NA'
  ) {
    return Number.NaN
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

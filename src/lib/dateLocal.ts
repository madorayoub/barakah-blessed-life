export interface LocalDateParts {
  y: string
  m: string
  d: string
}

export const dateLocalString = (date: Date = new Date()): LocalDateParts => {
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return formatter
    .formatToParts(date)
    .reduce<LocalDateParts>((acc, part) => {
      if (part.type === 'year') acc.y = part.value
      if (part.type === 'month') acc.m = part.value
      if (part.type === 'day') acc.d = part.value
      return acc
    }, { y: '', m: '', d: '' })
}

export const yyyyMmDd = (date: Date = new Date()): string => {
  const parts = dateLocalString(date)
  return `${parts.y}-${parts.m}-${parts.d}`
}

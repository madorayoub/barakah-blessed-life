import { yyyyMmDd } from '@/lib/dateLocal'

export function getLocalDateString(date: Date = new Date()): string {
  return yyyyMmDd(date)
}

export function isSameLocalDate(a: Date, b: Date): boolean {
  return getLocalDateString(a) === getLocalDateString(b)
}

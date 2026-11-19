const currency = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })

export function formatMoney(amount: number): string {
  return currency.format(amount)
}

/** Accepts "12,50" and "12.50": people type the decimal separator they are used to. */
export function parseAmount(raw: string): number {
  const normalised = raw.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) return NaN
  return Number(normalised)
}

/**
 * Convert Korean price (만원 = 10,000 KRW) to final EUR customer price.
 * Formula: encar_eur + 1,220 (shipping) + 400 (import/tax)
 * Exchange rate: 1 EUR = 1,741.54 KRW
 */
export function toEur(priceManWon: number): number {
  if (priceManWon <= 0) return 0;
  const eur = (priceManWon * 10000) / 1741.54;
  return Math.round(eur + 1220 + 400);
}

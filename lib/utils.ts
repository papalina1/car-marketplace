/**
 * Convert Korean price (만원 = 10,000 KRW) to final EUR customer price.
 * Formula: (encar_eur + 1,200 shipping) × 1.20 markup
 * Exchange rate: 1 EUR = 1,741.54 KRW
 * Example: 23,500,000 KRW → 13,494.05 EUR + 1,200 = 14,694.05 × 1.20 = 17,632.86 EUR
 */
export function toEur(priceManWon: number): number {
  if (priceManWon <= 0) return 0;
  const eur = (priceManWon * 10000) / 1741.54;
  return Math.round((eur + 1200) * 1.2);
}

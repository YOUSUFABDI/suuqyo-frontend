/// the new one algo of the delivery fee
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 1) return 0.75;
  if (distanceKm <= 3) return 1;
  if (distanceKm <= 6) return 1.5;
  if (distanceKm <= 9) return 2;
  if (distanceKm <= 12) return 2.5;
  if (distanceKm <= 15) return 4;
  if (distanceKm <= 18) return 4.5;
  if (distanceKm <= 21) return 5;
  if (distanceKm <= 24) return 5.5;

  const extraKm = distanceKm - 24;
  return parseFloat((5.5 + extraKm * 0.2).toFixed(2));
}

// .... Distance-Based Fee ....
// 0–1 km     → $0.75
// 1–3 km     → $1
// 3–6 km     → $1.5
// 6–9 km     → $2
// 9–12 km    → $2.5
// 12–15 km   → $4
// 15–18 km   → $4.5
// 18–21 km   → $5
// 21–24 km   → $5.5
// 24+ km     → $5.5 + $0.20 per extra km

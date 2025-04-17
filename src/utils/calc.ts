// 단가 계산 함수
// (공시가 + 포장비 - DC) * units
export function calcUnitPrice({
  officialPrice,
  packageCost,
  dc,
  units,
}: {
  officialPrice: number;
  packageCost: number;
  dc: number;
  units: number;
}): number {
  return (officialPrice + packageCost - dc) * units;
}

export type BusinessData = {
  name: string;
  monthlyRevenue: number;
  costs: { materials: number; labor: number; energy: number; logistics: number; other: number };
};

export const business: BusinessData = {
  name: "Nova Manufacturing GmbH",
  monthlyRevenue: 285000,
  costs: { materials: 112000, labor: 78000, energy: 22500, logistics: 18000, other: 14500 },
};

export function getTotalCosts(data: BusinessData): number {
  return Object.values(data.costs).reduce((sum, amount) => sum + amount, 0);
}
export function getMonthlyProfit(data: BusinessData): number {
  return data.monthlyRevenue - getTotalCosts(data);
}
export function getProfitMargin(data: BusinessData): number {
  return data.monthlyRevenue === 0 ? 0 : (getMonthlyProfit(data) / data.monthlyRevenue) * 100;
}
export const totalCosts = getTotalCosts(business);
export const monthlyProfit = getMonthlyProfit(business);
export const profitMargin = getProfitMargin(business);
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export function validateBusinessData(data: BusinessData): string | null {
  if (!data.name.trim() || data.name.length > 100) return "Company name must contain 1–100 characters.";
  const numbers = [data.monthlyRevenue, ...Object.values(data.costs)];
  if (numbers.some((n) => !Number.isFinite(n) || n < 0 || n > 1_000_000_000_000)) {
    return "Revenue and costs must be finite, non-negative amounts up to €1 trillion.";
  }
  return null;
}

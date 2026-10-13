
export const business = {
  name: "Nova Manufacturing GmbH",
  currency: "EUR",
  monthlyRevenue: 285000,
  costs: {
    materials: 112000,
    labor: 78000,
    energy: 22500,
    logistics: 18000,
    other: 14500,
  },
};

export const totalCosts = Object.values(
  business.costs
).reduce((sum, value) => sum + value, 0);

export const monthlyProfit =
  business.monthlyRevenue - totalCosts;

export const profitMargin =
  (monthlyProfit / business.monthlyRevenue) * 100;

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

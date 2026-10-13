import { business, type BusinessData, getTotalCosts, getMonthlyProfit } from "./businessData";
export type Scenario = { materialReduction: number; energyReduction: number; revenueIncrease: number };
export const initialScenario: Scenario = { materialReduction: 0, energyReduction: 0, revenueIncrease: 0 };
export function calculateScenario(scenario: Scenario, data: BusinessData = business) {
  const materialSavings = data.costs.materials * (scenario.materialReduction / 100);
  const energySavings = data.costs.energy * (scenario.energyReduction / 100);
  const revenueChange = data.monthlyRevenue * (scenario.revenueIncrease / 100);
  const newRevenue = data.monthlyRevenue + revenueChange;
  const newCosts = getTotalCosts(data) - materialSavings - energySavings;
  const newProfit = newRevenue - newCosts;
  const profitChange = newProfit - getMonthlyProfit(data);
  return {
    newRevenue, newCosts, newProfit,
    newMargin: newRevenue === 0 ? 0 : (newProfit / newRevenue) * 100,
    profitChange, annualProfitChange: profitChange * 12, materialSavings, energySavings,
  };
}

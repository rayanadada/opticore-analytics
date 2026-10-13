
import {
  business,
  totalCosts,
  monthlyProfit,
} from "./businessData";

export type Scenario = {
  materialReduction: number;
  energyReduction: number;
  revenueIncrease: number;
};

export const initialScenario: Scenario = {
  materialReduction: 0,
  energyReduction: 0,
  revenueIncrease: 0,
};

export function calculateScenario(scenario: Scenario) {
  const materialSavings =
    business.costs.materials *
    (scenario.materialReduction / 100);

  const energySavings =
    business.costs.energy *
    (scenario.energyReduction / 100);

  const revenueChange =
    business.monthlyRevenue *
    (scenario.revenueIncrease / 100);

  const newRevenue =
    business.monthlyRevenue + revenueChange;

  const newCosts =
    totalCosts - materialSavings - energySavings;

  const newProfit = newRevenue - newCosts;

  const profitChange = newProfit - monthlyProfit;

  const newMargin =
    newRevenue > 0
      ? (newProfit / newRevenue) * 100
      : 0;

  return {
    newRevenue,
    newCosts,
    newProfit,
    newMargin,
    profitChange,
    annualProfitChange: profitChange * 12,
    materialSavings,
    energySavings,
  };
}

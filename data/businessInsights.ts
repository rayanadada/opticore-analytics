import { business, type BusinessData, getMonthlyProfit } from "./businessData";
import { type Scenario, calculateScenario } from "./scenario";
export type BusinessInsight = {
  id: string; title: string; description: string;
  category: "opportunity" | "risk" | "information";
  priority: "high" | "medium" | "low";
};
export function generateBusinessInsights(s: Scenario, data: BusinessData = business): BusinessInsight[] {
  const result = calculateScenario(s, data);
  const items: BusinessInsight[] = [];
  const add = (id: string, title: string, description: string, category: BusinessInsight["category"], priority: BusinessInsight["priority"]) =>
    items.push({ id, title, description, category, priority });
  if (s.materialReduction > 0) add("material-opportunity", "Material Cost Optimization", `A ${s.materialReduction}% material cost reduction is assumed. Investigate suppliers, waste and procurement efficiency.`, "opportunity", "high");
  if (s.materialReduction < 0) add("material-risk", "Material Cost Pressure", `Material costs increase by ${Math.abs(s.materialReduction)}%. Review procurement and supply risks.`, "risk", "high");
  if (s.energyReduction > 0) add("energy-opportunity", "Energy Efficiency Opportunity", `A ${s.energyReduction}% energy cost reduction is assumed. Assess consumption and equipment efficiency.`, "opportunity", "medium");
  if (s.energyReduction < 0) add("energy-risk", "Energy Cost Exposure", `Energy expenses increase by ${Math.abs(s.energyReduction)}%. Examine contracts and consumption.`, "risk", "medium");
  if (s.revenueIncrease > 0) add("revenue-growth", "Revenue Growth Assumption", `Revenue increases by ${s.revenueIncrease}% in this scenario. Validate demand, capacity and variable costs.`, "opportunity", "high");
  if (s.revenueIncrease < 0) add("revenue-risk", "Revenue Decline Risk", `Revenue falls by ${Math.abs(s.revenueIncrease)}%. Assess fixed-cost coverage and demand sensitivity.`, "risk", "high");
  if (result.newProfit < 0) add("negative-profit", "Operating Loss Scenario", "Simulated costs exceed revenue. Review cost structure and assumptions.", "risk", "high");
  else if (result.newProfit < getMonthlyProfit(data)) add("profit-decline", "Profitability Under Pressure", "Simulated profit is below baseline. Identify the drivers behind the decline.", "risk", "medium");
  else if (result.newProfit > getMonthlyProfit(data)) add("profit-improvement", "Potential Profit Improvement", "The scenario increases operating profit. Validate implementation costs and feasibility.", "opportunity", "medium");
  if (!items.length) add("baseline", "Baseline Scenario", "No changes applied. Adjust assumptions to evaluate alternative outcomes.", "information", "low");
  return items;
}

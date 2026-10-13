
import { business, monthlyProfit } from "./businessData";

import {
  type Scenario,
  calculateScenario,
} from "./scenario";

export type BusinessInsight = {
  id: string;
  title: string;
  description: string;
  category: "opportunity" | "risk" | "information";
  priority: "high" | "medium" | "low";
};

export function generateBusinessInsights(
  scenario: Scenario
): BusinessInsight[] {
  const results = calculateScenario(scenario);
  const insights: BusinessInsight[] = [];

  const {
    materialReduction,
    energyReduction,
    revenueIncrease,
  } = scenario;

  // Material costs
  if (materialReduction > 0) {
    insights.push({
      id: "material-opportunity",
      title: "Material Cost Optimization",
      description:
        `The scenario assumes a ${materialReduction}% reduction ` +
        "in material expenses. Investigate supplier negotiations, " +
        "waste reduction, and purchasing efficiency to evaluate " +
        "whether this target is achievable.",
      category: "opportunity",
      priority: "high",
    });
  } else if (materialReduction < 0) {
    insights.push({
      id: "material-risk",
      title: "Material Cost Pressure",
      description:
        `Material expenses increase by ${Math.abs(materialReduction)}% ` +
        "under this scenario. Review supplier concentration, " +
        "procurement contracts, and input-price exposure.",
      category: "risk",
      priority: "high",
    });
  }

  // Energy costs
  if (energyReduction > 0) {
    insights.push({
      id: "energy-opportunity",
      title: "Energy Efficiency Opportunity",
      description:
        `The scenario assumes ${energyReduction}% lower energy costs. ` +
        "Potential initiatives include equipment efficiency reviews, " +
        "load management, and improved energy monitoring.",
      category: "opportunity",
      priority: "medium",
    });
  } else if (energyReduction < 0) {
    insights.push({
      id: "energy-risk",
      title: "Energy Cost Exposure",
      description:
        `Energy expenses rise by ${Math.abs(energyReduction)}% ` +
        "in this scenario. Investigate energy-price exposure, " +
        "contract conditions, and operational consumption.",
      category: "risk",
      priority: "medium",
    });
  }

  // Revenue
  if (revenueIncrease > 0) {
    insights.push({
      id: "revenue-growth",
      title: "Revenue Growth Assumption",
      description:
        `The model assumes ${revenueIncrease}% higher revenue. ` +
        "Validate demand, available production capacity, " +
        "and any additional variable costs before using " +
        "the result for business planning.",
      category: "opportunity",
      priority: "high",
    });
  } else if (revenueIncrease < 0) {
    insights.push({
      id: "revenue-risk",
      title: "Revenue Decline Risk",
      description:
        `The scenario assumes a ${Math.abs(revenueIncrease)}% ` +
        "revenue decline. Investigate demand sensitivity, " +
        "fixed-cost coverage, and possible operational responses.",
      category: "risk",
      priority: "high",
    });
  }

  // Overall profitability
  if (results.newProfit < 0) {
    insights.push({
      id: "negative-profit",
      title: "Operating Loss Scenario",
      description:
        "Simulated operating expenses exceed revenue. " +
        "Review cost structure, cash requirements, and " +
        "the assumptions driving the modeled loss.",
      category: "risk",
      priority: "high",
    });
  } else if (results.newProfit < monthlyProfit) {
    insights.push({
      id: "profit-decline",
      title: "Profitability Under Pressure",
      description:
        "Simulated monthly profit is below the baseline. " +
        "Compare the individual cost and revenue drivers " +
        "to understand the modeled decline.",
      category: "risk",
      priority: "medium",
    });
  } else if (results.newProfit > monthlyProfit) {
    insights.push({
      id: "profit-improvement",
      title: "Potential Profit Improvement",
      description:
        "The selected assumptions generate a higher " +
        "monthly operating profit than the baseline. " +
        "Validate feasibility and implementation costs " +
        "before treating this as an achievable target.",
      category: "opportunity",
      priority: "medium",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "baseline",
      title: "Baseline Scenario",
      description:
        "No changes have been applied. Adjust material " +
        "costs, energy costs, or revenue to explore " +
        "different business scenarios.",
      category: "information",
      priority: "low",
    });
  }

  return insights;
}

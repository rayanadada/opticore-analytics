
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  business,
  totalCosts,
  monthlyProfit,
} from "../data/businessData";

import {
  calculateScenario,
  initialScenario,
} from "../data/scenario";

import {
  generateBusinessInsights,
} from "../data/businessInsights";

test("Baseline financial calculations", () => {
  assert.equal(business.monthlyRevenue, 285000);
  assert.equal(totalCosts, 245000);
  assert.equal(monthlyProfit, 40000);
});

test("Zero-change scenario matches baseline", () => {
  const result = calculateScenario(initialScenario);

  assert.equal(result.newRevenue, 285000);
  assert.equal(result.newCosts, 245000);
  assert.equal(result.newProfit, 40000);
  assert.equal(result.profitChange, 0);
});

test("Positive optimization scenario", () => {
  const result = calculateScenario({
    materialReduction: 10,
    energyReduction: 15,
    revenueIncrease: 5,
  });

  assert.equal(result.newRevenue, 299250);
  assert.equal(result.newCosts, 230425);
  assert.equal(result.newProfit, 68825);
  assert.equal(result.profitChange, 28825);
  assert.equal(result.annualProfitChange, 345900);
});

test("Negative material scenario", () => {
  const result = calculateScenario({
    materialReduction: -10,
    energyReduction: 0,
    revenueIncrease: 0,
  });

  assert.equal(result.newCosts, 256200);
  assert.equal(result.newProfit, 28800);
  assert.equal(result.profitChange, -11200);
});

test("Profit margin calculation", () => {
  const result = calculateScenario({
    materialReduction: 10,
    energyReduction: 15,
    revenueIncrease: 5,
  });

  const expectedMargin =
    (68825 / 299250) * 100;

  assert.ok(
    Math.abs(result.newMargin - expectedMargin) < 0.00001
  );
});

test("Business insights detect material cost risk", () => {
  const insights = generateBusinessInsights({
    materialReduction: -10,
    energyReduction: 0,
    revenueIncrease: 0,
  });

  assert.ok(
    insights.some(
      (insight) => insight.id === "material-risk"
    )
  );
});

test("Baseline produces informational insight", () => {
  const insights =
    generateBusinessInsights(initialScenario);

  assert.ok(
    insights.some(
      (insight) => insight.id === "baseline"
    )
  );
});

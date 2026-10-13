import assert from "node:assert/strict";
import { test } from "node:test";
import {
  business,
  getMonthlyProfit,
  getProfitMargin,
  getTotalCosts,
  validateBusinessData,
  type BusinessData,
} from "../data/businessData";
import { calculateScenario, initialScenario } from "../data/scenario";
import { generateBusinessInsights } from "../data/businessInsights";
import { parseBusinessCsv } from "../data/csvImport";

const demoCsv = [
  "companyName,monthlyRevenue,materials,labor,energy,logistics,other",
  "Demo Industries,350000,125000,98000,24000,20500,18000",
].join("\n");

const demo: BusinessData = {
  name: "Demo Industries",
  monthlyRevenue: 350000,
  costs: { materials: 125000, labor: 98000, energy: 24000, logistics: 20500, other: 18000 },
};

const optimized = { materialReduction: 10, energyReduction: 15, revenueIncrease: 5 };

test("Nova sample baseline remains correct", () => {
  assert.equal(getTotalCosts(business), 245000);
  assert.equal(getMonthlyProfit(business), 40000);
  assert.ok(Math.abs(getProfitMargin(business) - (40000 / 285000) * 100) < 1e-10);
});

test("CSV import reads all fields from the sample company", () => {
  assert.deepEqual(parseBusinessCsv(demoCsv), demo);
});

test("Custom-company KPI calculations", () => {
  assert.equal(getTotalCosts(demo), 285500);
  assert.equal(getMonthlyProfit(demo), 64500);
  assert.ok(Math.abs(getProfitMargin(demo) - (64500 / 350000) * 100) < 1e-10);
});

test("Baseline scenario uses the imported company's numbers", () => {
  const r = calculateScenario(initialScenario, demo);
  assert.equal(r.newRevenue, 350000);
  assert.equal(r.newCosts, 285500);
  assert.equal(r.newProfit, 64500);
  assert.equal(r.profitChange, 0);
});

test("Optimized imported-company scenario matches the management report", () => {
  const r = calculateScenario(optimized, demo);
  assert.equal(r.newRevenue, 367500);
  assert.equal(r.newCosts, 269400);
  assert.equal(r.newProfit, 98100);
  assert.equal(r.profitChange, 33600);
  assert.equal(r.annualProfitChange, 403200);
});

test("Adverse cost and revenue movements decrease imported-company profit", () => {
  const r = calculateScenario(
    { materialReduction: -10, energyReduction: -15, revenueIncrease: -5 },
    demo
  );
  assert.equal(r.newRevenue, 332500);
  assert.equal(r.newCosts, 301600);
  assert.equal(r.newProfit, 30900);
  assert.equal(r.profitChange, -33600);
});

test("Imported-company profit margin uses simulated revenue", () => {
  const r = calculateScenario(optimized, demo);
  assert.ok(Math.abs(r.newMargin - (98100 / 367500) * 100) < 1e-10);
});

test("Rules detect negative revenue and materials risk", () => {
  const insights = generateBusinessInsights(
    { materialReduction: -10, energyReduction: 0, revenueIncrease: -5 },
    demo
  );
  assert.ok(insights.some((item) => item.id === "material-risk"));
  assert.ok(insights.some((item) => item.id === "revenue-risk"));
  assert.ok(insights.some((item) => item.id === "profit-decline"));
});

test("Zero-change scenario produces a baseline insight", () => {
  const insights = generateBusinessInsights(initialScenario, demo);
  assert.ok(insights.some((item) => item.id === "baseline"));
});

test("CSV import supports commas and escaped quotation marks in a company name", () => {
  const csv = demoCsv.replace("Demo Industries,", '"Example, ""North"" Plant",');
  assert.equal(parseBusinessCsv(csv).name, 'Example, "North" Plant');
});

test("CSV importer rejects negative costs", () => {
  const invalid = demoCsv.replace(",125000,", ",-125000,");
  assert.throws(() => parseBusinessCsv(invalid), /non-negative/i);
});

test("CSV importer rejects malformed headers", () => {
  const invalid = demoCsv.replace("companyName", "organization");
  assert.throws(() => parseBusinessCsv(invalid), /Expected CSV columns/);
});

test("CSV importer rejects invalid numeric input", () => {
  const invalid = demoCsv.replace("350000", "not-a-number");
  assert.throws(() => parseBusinessCsv(invalid), /Invalid amount/);
});

test("Validation rejects missing company name", () => {
  assert.match(validateBusinessData({ ...demo, name: " " }) ?? "", /Company name/);
});

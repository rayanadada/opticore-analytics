import { type BusinessData, getTotalCosts, getMonthlyProfit, formatCurrency } from "../data/businessData";
import { type Scenario, calculateScenario } from "../data/scenario";
function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)); }
export function exportManagementPdf(scenario: Scenario, data: BusinessData): void {
  if (typeof window === "undefined") throw new Error("PDF printing is available on web only.");
  const r = calculateScenario(scenario, data);
  const rows: Array<[string, string, string]> = [
    ["Revenue", formatCurrency(data.monthlyRevenue), formatCurrency(r.newRevenue)],
    ["Operating costs", formatCurrency(getTotalCosts(data)), formatCurrency(r.newCosts)],
    ["Operating profit", formatCurrency(getMonthlyProfit(data)), formatCurrency(r.newProfit)],
  ];
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OptiCore Report</title><style>
  body{font-family:Arial,sans-serif;color:#17243b;padding:28px;line-height:1.5}h1,h2{color:#194a85}
  table{border-collapse:collapse;width:100%;margin:18px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #dce3ee}th{background:#e7f0fc}
  .card{background:#f0f5fb;padding:17px;border-radius:10px}small{color:#6f7f92}@page{size:A4;margin:16mm}@media print{body{padding:0}}
  </style></head><body><h1>OPTICORE ANALYTICS</h1><small>Management scenario report · ${escapeHtml(data.name)}</small>
  <h2>Executive Summary</h2><div class="card"><p>Monthly profit change: <strong>${formatCurrency(r.profitChange)}</strong></p>
  <p>Annualized profit change: <strong>${formatCurrency(r.annualProfitChange)}</strong></p><p>Scenario profit margin: ${r.newMargin.toFixed(2)}%</p></div>
  <h2>Assumptions</h2><p>Material cost reduction: ${scenario.materialReduction}% · Energy cost reduction: ${scenario.energyReduction}% · Revenue change: ${scenario.revenueIncrease}%</p>
  <h2>Financial Comparison</h2><table><tr><th>Metric</th><th>Baseline</th><th>Scenario</th></tr>${rows.map(([name, base, sim]) => `<tr><td>${name}</td><td>${base}</td><td>${sim}</td></tr>`).join("")}</table>
  <small>Data source: User-provided or synthetic sample. Figures are illustrative, not forecasts. Implementation costs, tax and changes to secondary variable costs are excluded. Do not use as professional advice.</small></body></html>`;
  const popup = window.open("", "_blank");
  if (!popup) throw new Error("Please allow pop-ups for the report.");
  popup.document.open(); popup.document.write(html); popup.document.close(); popup.focus(); popup.print();
}

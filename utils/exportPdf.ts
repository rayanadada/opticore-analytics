
import { business, totalCosts, monthlyProfit } from "../data/businessData";
import { Scenario, calculateScenario } from "../data/scenario";

function euro(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const characters: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return characters[char];
  });
}

export function exportManagementPdf(scenario: Scenario): void {
  if (typeof window === "undefined") {
    throw new Error("PDF export is available on web only.");
  }

  const result = calculateScenario(scenario);

  const assumptions = [
    ["Material cost reduction", `${scenario.materialReduction}%`],
    ["Energy cost reduction", `${scenario.energyReduction}%`],
    ["Revenue change", `${scenario.revenueIncrease}%`],
  ];

  const financials = [
    ["Monthly Revenue", business.monthlyRevenue, result.newRevenue],
    ["Monthly Operating Costs", totalCosts, result.newCosts],
    ["Monthly Operating Profit", monthlyProfit, result.newProfit],
  ] as const;

  const direction =
    result.profitChange > 0
      ? "increases"
      : result.profitChange < 0
      ? "decreases"
      : "remains unchanged";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>OptiCore Management Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #17243b;
          padding: 35px;
          line-height: 1.5;
        }
        h1 { color: #163c74; margin-bottom: 2px; }
        h2 { margin-top: 35px; color: #194a85; }
        .subtitle { color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 14px; }
        th, td { padding: 12px; border-bottom: 1px solid #dde4ed; text-align: left; }
        th { background: #e7f0fc; }
        .summary { padding: 20px; background: #f0f5fb; border-radius: 8px; }
        .note { font-size: 12px; color: #64748b; margin-top: 35px; }
        @page { size: A4; margin: 15mm; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1>OPTICORE AI</h1>
      <div class="subtitle">Business Intelligence & Optimization</div>
      <h2>Management Performance Report</h2>
      <p><strong>Company:</strong> ${escapeHtml(business.name)}</p>
      <p><strong>Dataset:</strong> Synthetic demonstration data</p>

      <h2>Executive Summary</h2>
      <div class="summary">
        <p>Under the selected assumptions, monthly operating profit
        ${direction}.</p>
        <p><strong>Monthly profit change:</strong> ${euro(result.profitChange)}</p>
        <p><strong>Annualized profit change:</strong> ${euro(result.annualProfitChange)}</p>
        <p><strong>Scenario profit margin:</strong> ${result.newMargin.toFixed(2)}%</p>
      </div>

      <h2>Scenario Assumptions</h2>
      <table>
        ${assumptions.map(([label, value]) =>
          `<tr><td>${label}</td><td>${value}</td></tr>`
        ).join("")}
      </table>

      <h2>Financial Comparison</h2>
      <table>
        <tr><th>Metric</th><th>Baseline</th><th>Scenario</th></tr>
        ${financials.map(([label, baseline, simulated]) =>
          `<tr><td>${label}</td><td>${euro(baseline)}</td><td>${euro(simulated)}</td></tr>`
        ).join("")}
      </table>

      <p class="note">
        Disclaimer: This report uses fictional company information and
        synthetic data. The calculations are illustrative, not forecasts
        or guaranteed savings. They exclude implementation costs, taxes,
        and secondary changes to operating expenses.
      </p>
    </body>
    </html>
  `;

  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    throw new Error("Allow pop-ups to export the PDF.");
  }

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

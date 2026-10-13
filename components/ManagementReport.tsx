import { Platform, Alert } from "react-native";
import { exportManagementPdf } from "../utils/exportPdf";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import {
  business,
  totalCosts,
  monthlyProfit,
  formatCurrency,
} from "../data/businessData";

import {
  Scenario,
  calculateScenario,
} from "../data/scenario";

type Props = {
  scenario: Scenario;
};

function ComparisonBar({
  label,
  baseline,
  simulated,
}: {
  label: string;
  baseline: number;
  simulated: number;
}) {
  const maxValue = Math.max(
    Math.abs(baseline),
    Math.abs(simulated),
    1
  );

  return (
    <View style={styles.comparison}>
      <Text style={styles.comparisonLabel}>{label}</Text>

      <View style={styles.values}>
        <Text style={styles.muted}>
          Baseline: {formatCurrency(baseline)}
        </Text>
        <Text style={styles.bold}>
          Scenario: {formatCurrency(simulated)}
        </Text>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.baselineBar,
            { width: `${Math.abs(baseline) / maxValue * 100}%` },
          ]}
        />
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.scenarioBar,
            { width: `${Math.abs(simulated) / maxValue * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

export default function ManagementReport({
  scenario,
}: Props) {
  const [copied, setCopied] = useState(false);
  const results = calculateScenario(scenario);
  
function downloadPdf() {
  if (Platform.OS !== "web") {
    Alert.alert(
      "Web only",
      "PDF export is currently available in the browser."
    );
    return;
  }

  try {
    exportManagementPdf(scenario);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to open the PDF report.";

    window.alert(message);
  }
}

  const direction =
    results.profitChange > 0
      ? "increases"
      : results.profitChange < 0
      ? "decreases"
      : "remains unchanged";

  const report = [
    "OPTICORE AI - MANAGEMENT REPORT",
    "================================",
    `Company: ${business.name}`,
    "Data: Synthetic demonstration dataset",
    "",
    "SCENARIO ASSUMPTIONS",
    `Material cost reduction: ${scenario.materialReduction}%`,
    `Energy cost reduction: ${scenario.energyReduction}%`,
    `Revenue change: ${scenario.revenueIncrease}%`,
    "",
    "BASELINE",
    `Monthly revenue: ${formatCurrency(business.monthlyRevenue)}`,
    `Monthly costs: ${formatCurrency(totalCosts)}`,
    `Monthly profit: ${formatCurrency(monthlyProfit)}`,
    "",
    "SIMULATED RESULTS",
    `Monthly revenue: ${formatCurrency(results.newRevenue)}`,
    `Monthly costs: ${formatCurrency(results.newCosts)}`,
    `Monthly profit: ${formatCurrency(results.newProfit)}`,
    `Profit margin: ${results.newMargin.toFixed(2)}%`,
    `Monthly profit change: ${formatCurrency(results.profitChange)}`,
    `Annualized profit change: ${formatCurrency(results.annualProfitChange)}`,
    "",
    "INTERPRETATION",
    `Under the selected assumptions, monthly profit ${direction}.`,
    "",
    "DISCLAIMER",
    "Illustrative scenario, not a financial forecast.",
    "Excludes implementation costs, tax effects,",
    "and secondary changes in operating expenses.",
  ].join("\n");

  async function copyReport() {
    try {
      await Clipboard.setStringAsync(report);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Management Report</Text>
      <Text style={styles.subtitle}>
        Baseline vs. simulated performance
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Financial Performance
        </Text>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.baselineBar]} />
            <Text style={styles.muted}>Baseline</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, styles.scenarioBar]} />
            <Text style={styles.muted}>Scenario</Text>
          </View>
        </View>

        <ComparisonBar
          label="Monthly Revenue"
          baseline={business.monthlyRevenue}
          simulated={results.newRevenue}
        />

        <ComparisonBar
          label="Monthly Operating Costs"
          baseline={totalCosts}
          simulated={results.newCosts}
        />

        <ComparisonBar
          label="Monthly Profit"
          baseline={monthlyProfit}
          simulated={results.newProfit}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Executive Summary
        </Text>

        <Text style={styles.body}>
          Under the selected assumptions, monthly
          operating profit {direction}.
        </Text>

        <Text style={styles.keyLabel}>
          Monthly Profit Change
        </Text>
        <Text
          style={[
            styles.keyValue,
            {
              color:
                results.profitChange >= 0
                  ? "#16734A"
                  : "#B42318",
            },
          ]}
        >
          {formatCurrency(results.profitChange)}
        </Text>

        <Text style={styles.keyLabel}>
          Annualized Profit Change
        </Text>
        <Text style={styles.keyValue}>
          {formatCurrency(results.annualProfitChange)}
        </Text>

        <Text style={styles.body}>
          These figures describe a hypothetical
          scenario, not guaranteed savings.
        </Text>
      </View>

      
<View style={{ marginTop: 20 }}>
  <Pressable
    style={styles.exportButton}
    onPress={copyReport}
  >
    <Text style={styles.exportText}>
      {copied ? "Report Copied" : "Copy Management Report"}
    </Text>
  </Pressable>

<Pressable
   style={[
      styles.exportButton,
      { marginTop: 12, backgroundColor: "#16734A" },
    ]}
    onPress={downloadPdf}
  >
    <Text style={styles.exportText}>
      Download PDF Report
    </Text>
  </Pressable>
</View>


      <Text style={styles.disclaimer}>
        Synthetic business data. Simplified model.
        Profit changes exclude implementation costs,
        taxes and secondary cost effects.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#17243B",
  },
  subtitle: {
    color: "#718096",
    marginTop: 7,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: "#E7ECF4",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17243B",
    marginBottom: 16,
  },
  legend: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 3,
  },
  comparison: {
    marginBottom: 22,
  },
  comparisonLabel: {
    fontWeight: "700",
    color: "#354761",
    marginBottom: 8,
  },
  values: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
    marginBottom: 10,
  },
  muted: {
    fontSize: 12,
    color: "#718096",
  },
  bold: {
    fontSize: 12,
    fontWeight: "700",
    color: "#193A69",
  },
  barTrack: {
    width: "100%",
    height: 10,
    borderRadius: 8,
    backgroundColor: "#EEF2F7",
    overflow: "hidden",
    marginBottom: 6,
  },
  baselineBar: {
    height: "100%",
    backgroundColor: "#9AADC5",
  },
  scenarioBar: {
    height: "100%",
    backgroundColor: "#2764AD",
  },
  body: {
    color: "#54657C",
    lineHeight: 22,
    marginBottom: 16,
  },
  keyLabel: {
    fontSize: 12,
    color: "#8795A8",
  },
  keyValue: {
    fontSize: 25,
    fontWeight: "800",
    color: "#193A69",
    marginTop: 4,
    marginBottom: 16,
  },
  exportButton: {
    backgroundColor: "#194A85",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
  },
  exportText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 17,
    color: "#8795A8",
    marginTop: 15,
  },
});

import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { type BusinessData, getTotalCosts, getMonthlyProfit, formatCurrency } from "../data/businessData";
import { type Scenario, calculateScenario } from "../data/scenario";
import { exportManagementPdf } from "../utils/exportPdf";

function ComparisonBar({ label, baseline, simulated }: { label: string; baseline: number; simulated: number }) {
  const max = Math.max(Math.abs(baseline), Math.abs(simulated), 1);
  return <View style={{ marginBottom: 20 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.small}>Baseline: {formatCurrency(baseline)}   |   Scenario: {formatCurrency(simulated)}</Text>
    <View style={styles.track}><View style={[styles.baseline, { width: `${Math.abs(baseline) / max * 100}%` }]} /></View>
    <View style={styles.track}><View style={[styles.simulated, { width: `${Math.abs(simulated) / max * 100}%` }]} /></View>
    {(baseline < 0 || simulated < 0) && <Text style={styles.small}>Bar lengths represent absolute values; see signed amounts above.</Text>}
  </View>;
}
export default function ManagementReport({ scenario, data }: { scenario: Scenario; data: BusinessData }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const r = calculateScenario(scenario, data);
  const report = ["OPTICORE ANALYTICS — MANAGEMENT REPORT", `Company: ${data.name}`, "Data source: user input or synthetic sample", "",
    "SCENARIO ASSUMPTIONS", `Material cost reduction: ${scenario.materialReduction}%`, `Energy cost reduction: ${scenario.energyReduction}%`, `Revenue change: ${scenario.revenueIncrease}%`, "",
    `Baseline revenue: ${formatCurrency(data.monthlyRevenue)}`, `Baseline costs: ${formatCurrency(getTotalCosts(data))}`, `Baseline profit: ${formatCurrency(getMonthlyProfit(data))}`, "",
    `Scenario revenue: ${formatCurrency(r.newRevenue)}`, `Scenario costs: ${formatCurrency(r.newCosts)}`, `Scenario profit: ${formatCurrency(r.newProfit)}`, `Scenario margin: ${r.newMargin.toFixed(2)}%`,
    `Monthly profit change: ${formatCurrency(r.profitChange)}`, `Annualized profit change: ${formatCurrency(r.annualProfitChange)}`, "",
    "Illustrative scenario only; not a forecast. Excludes implementation, tax and secondary variable cost changes."].join("\n");
  async function copy() { try { await Clipboard.setStringAsync(report); setCopied(true); setError(""); } catch { setError("Clipboard access failed."); } }
  function exportPdf() {
    if (Platform.OS !== "web") { Alert.alert("Web only", "Use the web app to print as PDF."); return; }
    try { exportManagementPdf(scenario, data); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Unable to print PDF."); }
  }
  return <View style={{ marginTop: 22 }}>
    <Text style={styles.heading}>Management Report</Text><Text style={styles.small}>{data.name} · Baseline vs. simulated results</Text>
    <View style={styles.card}>
      <Text style={styles.headingSmall}>Financial Performance</Text>
      <Text style={styles.small}>Gray = baseline  ·  Blue = scenario</Text>
      <ComparisonBar label="Monthly Revenue" baseline={data.monthlyRevenue} simulated={r.newRevenue} />
      <ComparisonBar label="Operating Costs" baseline={getTotalCosts(data)} simulated={r.newCosts} />
      <ComparisonBar label="Operating Profit" baseline={getMonthlyProfit(data)} simulated={r.newProfit} />
    </View>
    <View style={styles.card}>
      <Text style={styles.headingSmall}>Executive Summary</Text>
      <Text style={styles.small}>Under the selected assumptions, monthly profit {r.profitChange > 0 ? "increases" : r.profitChange < 0 ? "decreases" : "is unchanged"}.</Text>
      <Text style={styles.label}>Monthly Profit Change</Text><Text style={[styles.big, { color: r.profitChange < 0 ? "#B42318" : "#16734A" }]}>{formatCurrency(r.profitChange)}</Text>
      <Text style={styles.label}>Annualized Profit Change</Text><Text style={styles.big}>{formatCurrency(r.annualProfitChange)}</Text>
    </View>
    <Pressable style={styles.button} onPress={copy}><Text style={styles.buttonText}>{copied ? "Report Copied" : "Copy Management Report"}</Text></Pressable>
    <Pressable style={[styles.button, { backgroundColor: "#16734A" }]} onPress={exportPdf}><Text style={styles.buttonText}>Download PDF Report (Web)</Text></Pressable>
    {!!error && <Text style={{ color: "#B42318", marginTop: 8 }}>{error}</Text>}
    <Text style={styles.small}>For illustrative use only. PDF export opens the browser print dialog.</Text>
  </View>;
}
const styles = StyleSheet.create({
  heading: { color: "#17243B", fontSize: 24, fontWeight: "800", marginBottom: 10 },
  headingSmall: { color: "#17243B", fontSize: 18, fontWeight: "800", marginBottom: 13 },
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, marginVertical: 9, borderWidth: 1, borderColor: "#E7ECF4" },
  label: { fontSize: 13, color: "#475569", fontWeight: "700", marginTop: 13, marginBottom: 5 },
  small: { fontSize: 12, color: "#718096", lineHeight: 19, marginVertical: 8 },
  big: { fontSize: 26, fontWeight: "800", color: "#193A69", marginBottom: 9 },
  track: { height: 10, borderRadius: 8, backgroundColor: "#EEF2F7", overflow: "hidden", marginVertical: 3 },
  baseline: { height: "100%", backgroundColor: "#9AADC5" }, simulated: { height: "100%", backgroundColor: "#2764AD" },
  button: { backgroundColor: "#194A85", padding: 16, borderRadius: 11, alignItems: "center", marginTop: 12 },
  buttonText: { color: "white", fontWeight: "700" },
});

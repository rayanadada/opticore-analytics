import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { type BusinessData, formatCurrency } from "../data/businessData";
import { type Scenario, calculateScenario, initialScenario } from "../data/scenario";
import BusinessInsights from "./BusinessInsights";
export default function BusinessSimulator({ scenario, setScenario, data }: {
  scenario: Scenario; setScenario: React.Dispatch<React.SetStateAction<Scenario>>; data: BusinessData;
}) {
  const r = calculateScenario(scenario, data);
  function change(key: keyof Scenario, delta: number) {
    setScenario((prev) => ({ ...prev, [key]: Math.max(-30, Math.min(30, prev[key] + delta)) }));
  }
  function Control({ label, field }: { label: string; field: keyof Scenario }) {
    return <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable style={styles.step} onPress={() => change(field, -5)}><Text style={styles.stepText}>−</Text></Pressable>
        <Text style={styles.percent}>{scenario[field] > 0 ? "+" : ""}{scenario[field]}%</Text>
        <Pressable style={styles.step} onPress={() => change(field, 5)}><Text style={styles.stepText}>+</Text></Pressable>
      </View>
    </View>;
  }
  return <View style={styles.container}>
    <Text style={styles.heading}>Business Optimization Simulator</Text>
    <Text style={styles.hint}>Selected company: {data.name}. Positive cost reductions lower expenses; negative cost reductions raise expenses.</Text>
    <Control label="Material Cost Reduction / Increase" field="materialReduction" />
    <Control label="Energy Cost Reduction / Increase" field="energyReduction" />
    <Control label="Revenue Increase / Decrease" field="revenueIncrease" />
    <View style={styles.card}>
      <Text style={styles.heading}>Scenario Results</Text>
      {([ ["Monthly Revenue", r.newRevenue], ["Monthly Costs", r.newCosts], ["Monthly Profit", r.newProfit], ["Monthly Profit Change", r.profitChange], ["Annualized Profit Change", r.annualProfitChange] ] as const).map(([label, value]) =>
        <View key={label} style={styles.result}><Text style={styles.label}>{label}</Text><Text style={[styles.value, label.includes("Change") ? { color: value < 0 ? "#B42318" : "#16734A" } : null]}>{formatCurrency(value)}</Text></View>
      )}
      <View style={styles.result}><Text style={styles.label}>Profit Margin</Text><Text style={styles.value}>{r.newMargin.toFixed(1)}%</Text></View>
      <Pressable style={styles.action} onPress={() => setScenario({ ...initialScenario })}><Text style={styles.actionText}>Reset Scenario</Text></Pressable>
    </View>
    <BusinessInsights scenario={scenario} data={data} />
    <Text style={styles.hint}>Illustrative model: changes in variable costs, tax and implementation costs are excluded.</Text>
  </View>;
}
const styles = StyleSheet.create({
  container: { marginTop: 20 }, heading: { fontSize: 22, fontWeight: "800", color: "#17243B", marginBottom: 8 },
  hint: { fontSize: 12, color: "#718096", lineHeight: 19, marginVertical: 12 },
  card: { padding: 18, backgroundColor: "white", borderRadius: 15, marginBottom: 12, borderWidth: 1, borderColor: "#E7ECF4" },
  label: { color: "#52657B", fontSize: 13, fontWeight: "600" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 },
  step: { width: 46, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#E7F0FC" },
  stepText: { color: "#194A85", fontSize: 23, fontWeight: "800" }, percent: { fontSize: 22, fontWeight: "800", color: "#17243B" },
  result: { marginVertical: 9 }, value: { fontSize: 23, fontWeight: "800", color: "#193A69", marginTop: 4 },
  action: { backgroundColor: "#194A85", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 12 },
  actionText: { color: "white", fontWeight: "700" },
});

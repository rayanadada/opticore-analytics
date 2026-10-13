import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { type BusinessData } from "../data/businessData";
import { type Scenario } from "../data/scenario";
import { generateBusinessInsights, type BusinessInsight } from "../data/businessInsights";
function InsightCard({ insight }: { insight: BusinessInsight }) {
  const color = insight.category === "risk" ? "#B42318" : insight.category === "opportunity" ? "#16734A" : "#194A85";
  return <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={styles.row}><Text style={styles.title}>{insight.title}</Text><Text style={[styles.priority, { color }]}>{insight.priority.toUpperCase()}</Text></View>
    <Text style={styles.description}>{insight.description}</Text><Text style={[styles.category, { color }]}>{insight.category.toUpperCase()}</Text>
  </View>;
}
export default function BusinessInsights({ scenario, data }: { scenario: Scenario; data: BusinessData }) {
  return <View style={styles.container}>
    <Text style={styles.heading}>Business Insights</Text>
    <Text style={styles.hint}>Transparent rule-based interpretation of selected assumptions</Text>
    {generateBusinessInsights(scenario, data).map((insight) => <InsightCard key={insight.id} insight={insight} />)}
    <Text style={styles.hint}>Exploratory recommendations only. Not generative AI or validated business advice.</Text>
  </View>;
}
const styles = StyleSheet.create({
  container: { marginTop: 24 }, heading: { fontSize: 22, fontWeight: "800", color: "#17243B" }, hint: { fontSize: 12, color: "#718096", marginVertical: 12, lineHeight: 18 },
  card: { backgroundColor: "white", borderRadius: 14, borderWidth: 1, borderColor: "#E7ECF4", borderLeftWidth: 4, padding: 16, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, title: { flex: 1, fontWeight: "800", fontSize: 15, color: "#17243B" },
  priority: { fontSize: 10, fontWeight: "800" }, description: { color: "#54657C", fontSize: 13, lineHeight: 20, marginTop: 12 },
  category: { fontSize: 10, fontWeight: "800", marginTop: 12 },
});

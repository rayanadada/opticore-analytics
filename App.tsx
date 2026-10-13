import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Pressable } from "react-native";
import { business, type BusinessData, getTotalCosts, getMonthlyProfit, getProfitMargin, formatCurrency } from "./data/businessData";
import { type Scenario, initialScenario } from "./data/scenario";
import BusinessSimulator from "./components/BusinessSimulator";
import ManagementReport from "./components/ManagementReport";
import CompanyDataEditor from "./components/CompanyDataEditor";

type Tab = "Overview" | "Simulator" | "Reports";
const tabs: Tab[] = ["Overview", "Simulator", "Reports"];
function MetricCard({ label, value }: { label: string; value: string }) {
  return <View style={styles.metricCard}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [data, setData] = useState<BusinessData>(business);
  const [scenario, setScenario] = useState<Scenario>({ ...initialScenario });
  const [editorOpen, setEditorOpen] = useState(false);
  const [source, setSource] = useState<"sample" | "custom">("sample");
  const total = getTotalCosts(data);
  const costItems = Object.entries(data.costs).map(([key, value]) => ({ name: key[0].toUpperCase() + key.slice(1), value }));
  function applyData(next: BusinessData) { setData(next); setScenario({ ...initialScenario }); setSource("custom"); }
  function resetSample() { setData(business); setScenario({ ...initialScenario }); setSource("sample"); }
  return <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.brand}>OPTICORE ANALYTICS</Text>
      <Text style={styles.subtitle}>Business Intelligence & Decision Support</Text>
      <View style={styles.navigation}>
        {tabs.map((tab) => <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </Pressable>)}
      </View>
      <View style={styles.sourceCard}>
        <View style={{ flex: 1 }}><Text style={styles.sourceTitle}>{data.name}</Text>
          <Text style={styles.sourceCaption}>{source === "sample" ? "SAMPLE · SYNTHETIC DATA" : "CUSTOM · USER-PROVIDED DATA"} · Monthly · EUR</Text></View>
        <Pressable style={styles.changeButton} onPress={() => setEditorOpen(!editorOpen)}><Text style={styles.changeButtonText}>{editorOpen ? "Close" : "Change Data"}</Text></Pressable>
      </View>
      {editorOpen && <CompanyDataEditor current={data} onApply={applyData} onSample={resetSample} />}
      {activeTab === "Overview" && <>
        <View style={styles.header}><Text style={styles.eyebrow}>PERFORMANCE INTELLIGENCE</Text><Text style={styles.title}>Business Overview</Text>
          <Text style={styles.caption}>Monthly financial performance and operational cost analysis</Text></View>
        <View style={styles.grid}>
          <MetricCard label="Monthly Revenue" value={formatCurrency(data.monthlyRevenue)} />
          <MetricCard label="Operating Costs" value={formatCurrency(total)} />
          <MetricCard label="Operating Profit" value={formatCurrency(getMonthlyProfit(data))} />
          <MetricCard label="Profit Margin" value={`${getProfitMargin(data).toFixed(1)}%`} />
        </View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Cost Breakdown</Text><Text style={styles.sectionSubtitle}>Monthly operating expenditure</Text>
          {costItems.map((item) => { const percentage = total ? item.value / total * 100 : 0;
            return <View key={item.name} style={styles.costRow}><View style={styles.costHeader}>
              <Text style={styles.costName}>{item.name}</Text><Text style={styles.costValue}>{formatCurrency(item.value)}</Text></View>
              <View style={styles.barBackground}><View style={[styles.barFill, { width: `${percentage}%` }]} /></View>
              <Text style={styles.percentage}>{percentage.toFixed(1)}% of total costs</Text>
            </View>;
          })}
        </View>
        <View style={styles.insightCard}><Text style={styles.insightTitle}>Business Observation</Text>
          <Text style={styles.insightText}>{total > 0 ? `${costItems.reduce((a, b) => a.value >= b.value ? a : b).name} is the largest expense category in this dataset. Investigate its drivers and test potential changes in the Simulator.` : "No operating costs have been entered. Add costs to analyze their composition."}</Text>
        </View>
      </>}
      {activeTab === "Simulator" && <BusinessSimulator scenario={scenario} setScenario={setScenario} data={data} />}
      {activeTab === "Reports" && <ManagementReport scenario={scenario} data={data} />}
      <View style={styles.footer}><Text style={styles.footerText}>OPTICORE ANALYTICS · PORTFOLIO PROTOTYPE</Text>
        <Text style={styles.footerSubtext}>No user accounts or backend. Custom data remains in this browser session; do not enter confidential information.</Text></View>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FB" },
  content: { padding: 22, paddingBottom: 55, width: "100%", maxWidth: 1120, alignSelf: "center" },
  brand: { fontSize: 20, fontWeight: "900", letterSpacing: 1.4, color: "#164A86", marginTop: 16 },
  subtitle: { fontSize: 12, color: "#718096", marginTop: 5 },
  navigation: { flexDirection: "row", marginTop: 27, marginBottom: 14, padding: 5, backgroundColor: "#E8EDF5", borderRadius: 14, gap: 6 },
  tab: { flex: 1, paddingVertical: 14, paddingHorizontal: 3, borderRadius: 10, alignItems: "center" },
  activeTab: { backgroundColor: "#194A85" }, tabText: { color: "#61728A", fontSize: 13, fontWeight: "700" }, activeTabText: { color: "white" },
  sourceCard: { backgroundColor: "white", flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "#E1E8F0" },
  sourceTitle: { color: "#17243B", fontSize: 15, fontWeight: "800" }, sourceCaption: { color: "#60728A", fontSize: 10, marginTop: 6 },
  changeButton: { backgroundColor: "#E7F0FC", padding: 10, borderRadius: 9 }, changeButtonText: { color: "#194A85", fontSize: 12, fontWeight: "700" },
  header: { marginTop: 27, marginBottom: 24 }, eyebrow: { fontSize: 10, letterSpacing: 2, color: "#2764AD", fontWeight: "800", marginBottom: 10 },
  title: { fontSize: 31, color: "#17243B", fontWeight: "800" }, caption: { fontSize: 12, color: "#8795A8", marginTop: 9, lineHeight: 19 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  metricCard: { width: "48%", backgroundColor: "white", padding: 17, borderRadius: 15, borderWidth: 1, borderColor: "#E7ECF4", marginBottom: 13 },
  metricLabel: { fontSize: 12, color: "#75859B", marginBottom: 12 }, metricValue: { fontSize: 20, color: "#193A69", fontWeight: "800" },
  section: { backgroundColor: "white", borderRadius: 17, borderWidth: 1, borderColor: "#E7ECF4", padding: 20, marginTop: 15 },
  sectionTitle: { fontSize: 19, fontWeight: "800", color: "#17243B" }, sectionSubtitle: { fontSize: 12, color: "#8795A8", marginTop: 5, marginBottom: 21 },
  costRow: { marginBottom: 19 }, costHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 9 },
  costName: { fontSize: 13, color: "#354761", fontWeight: "600" }, costValue: { fontSize: 13, color: "#17243B", fontWeight: "700" },
  barBackground: { height: 9, backgroundColor: "#EAF0F8", borderRadius: 9, overflow: "hidden" }, barFill: { height: "100%", backgroundColor: "#2764AD" },
  percentage: { fontSize: 10, color: "#8492A6", marginTop: 6 },
  insightCard: { padding: 20, backgroundColor: "#E7F0FC", borderRadius: 15, marginTop: 20 },
  insightTitle: { fontSize: 17, fontWeight: "800", color: "#174779", marginBottom: 9 }, insightText: { fontSize: 13, lineHeight: 21, color: "#355778" },
  footer: { marginTop: 42, paddingTop: 20, alignItems: "center", borderTopWidth: 1, borderTopColor: "#E0E7F0" },
  footerText: { fontSize: 10, color: "#61728A", letterSpacing: 1, fontWeight: "800", textAlign: "center" },
  footerSubtext: { fontSize: 11, color: "#8795A8", marginTop: 7, textAlign: "center" },
});

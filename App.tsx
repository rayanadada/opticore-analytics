
import React, { useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import {
  business,
  totalCosts,
  monthlyProfit,
  profitMargin,
  formatCurrency,
} from "./data/businessData";

import {
  type Scenario,
  initialScenario,
} from "./data/scenario";

import BusinessSimulator from "./components/BusinessSimulator";
import ManagementReport from "./components/ManagementReport";

type Tab = "Overview" | "Simulator" | "Reports";

const tabs: Tab[] = [
  "Overview",
  "Simulator",
  "Reports",
];

const costItems = [
  {
    name: "Materials",
    value: business.costs.materials,
  },
  {
    name: "Labor",
    value: business.costs.labor,
  },
  {
    name: "Energy",
    value: business.costs.energy,
  },
  {
    name: "Logistics",
    value: business.costs.logistics,
  },
  {
    name: "Other",
    value: business.costs.other,
  },
];

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] =
    useState<Tab>("Overview");

  const [scenario, setScenario] = useState<Scenario>({
    ...initialScenario,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        {/* APPLICATION BRANDING */}

        <View style={styles.brandHeader}>
          <Text style={styles.brand}>
            OPTICORE AI
          </Text>

          <Text style={styles.subtitle}>
            Business Intelligence & Optimization
          </Text>
        </View>

        {/* MAIN NAVIGATION */}

        <View style={styles.navigation}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab &&
                  styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab &&
                    styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* OVERVIEW SCREEN */}

        {activeTab === "Overview" && (
          <>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>
                PERFORMANCE INTELLIGENCE
              </Text>

              <Text style={styles.title}>
                Business Overview
              </Text>

              <Text style={styles.company}>
                {business.name}
              </Text>

              <View style={styles.demoLabel}>
                <Text style={styles.demoLabelText}>
                  DEMO ENVIRONMENT · SYNTHETIC DATA
                </Text>
              </View>

              <Text style={styles.caption}>
                Monthly financial performance and
                operational cost analysis
              </Text>
            </View>

            {/* FINANCIAL KPIs */}

            <View style={styles.grid}>
              <MetricCard
                label="Monthly Revenue"
                value={formatCurrency(
                  business.monthlyRevenue
                )}
              />

              <MetricCard
                label="Operating Costs"
                value={formatCurrency(totalCosts)}
              />

              <MetricCard
                label="Operating Profit"
                value={formatCurrency(monthlyProfit)}
              />

              <MetricCard
                label="Profit Margin"
                value={`${profitMargin.toFixed(1)}%`}
              />
            </View>

            {/* COST ANALYSIS */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Cost Breakdown
              </Text>

              <Text style={styles.sectionSubtitle}>
                Monthly operating expenditure
              </Text>

              {costItems.map((item) => {
                const percentage =
                  totalCosts > 0
                    ? (item.value / totalCosts) * 100
                    : 0;

                return (
                  <View
                    key={item.name}
                    style={styles.costRow}
                  >
                    <View style={styles.costHeader}>
                      <Text style={styles.costName}>
                        {item.name}
                      </Text>

                      <Text style={styles.costValue}>
                        {formatCurrency(item.value)}
                      </Text>
                    </View>

                    <View style={styles.barBackground}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${percentage}%`,
                          },
                        ]}
                      />
                    </View>

                    <Text style={styles.percentage}>
                      {percentage.toFixed(1)}% of
                      total costs
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* BUSINESS OBSERVATION */}

            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>
                Business Insight
              </Text>

              <Text style={styles.insightText}>
                Materials represent the largest
                operating cost category in this
                synthetic dataset. A reduction in
                material expenses could improve
                monthly profitability.
              </Text>

              <Text style={styles.insightNote}>
                Explore alternative scenarios in
                the Simulator tab.
              </Text>
            </View>
          </>
        )}

        {/* SIMULATOR SCREEN */}

        {activeTab === "Simulator" && (
          <BusinessSimulator
            scenario={scenario}
            setScenario={setScenario}
          />
        )}

        {/* REPORTS SCREEN */}

        {activeTab === "Reports" && (
          <ManagementReport
            scenario={scenario}
          />
        )}

        {/* APPLICATION FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            OPTICORE AI · BUSINESS ANALYTICS PROTOTYPE
          </Text>

          <Text style={styles.footerSubtext}>
            Educational demonstration using
            synthetic business data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    padding: 24,
    paddingBottom: 60,
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
  },

  brandHeader: {
    marginTop: 16,
  },

  brand: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    color: "#164A86",
  },

  subtitle: {
    fontSize: 12,
    color: "#718096",
    marginTop: 5,
  },

  navigation: {
    flexDirection: "row",
    marginTop: 28,
    marginBottom: 16,
    padding: 5,
    backgroundColor: "#E8EDF5",
    borderRadius: 14,
    gap: 6,
  },

  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: "#194A85",
  },

  tabText: {
    fontSize: 13,
    color: "#61728A",
    fontWeight: "700",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  header: {
    marginTop: 28,
    marginBottom: 26,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2764AD",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#17243B",
  },

  company: {
    fontSize: 15,
    color: "#54657C",
    marginTop: 8,
  },

  demoLabel: {
    alignSelf: "flex-start",
    marginTop: 15,
    marginBottom: 12,
    backgroundColor: "#E7F0FC",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },

  demoLabelText: {
    fontSize: 10,
    color: "#194A85",
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  caption: {
    fontSize: 12,
    color: "#8795A8",
    marginTop: 5,
    lineHeight: 19,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 19,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7ECF4",
  },

  metricLabel: {
    fontSize: 12,
    color: "#75859B",
    marginBottom: 13,
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#193A69",
  },

  section: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    marginTop: 17,
    borderWidth: 1,
    borderColor: "#E7ECF4",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#17243B",
  },

  sectionSubtitle: {
    color: "#8795A8",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 22,
  },

  costRow: {
    marginBottom: 20,
  },

  costHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  costName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#354761",
  },

  costValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#17243B",
  },

  barBackground: {
    height: 10,
    backgroundColor: "#EAF0F8",
    borderRadius: 10,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#2764AD",
    borderRadius: 10,
  },

  percentage: {
    fontSize: 10,
    color: "#8492A6",
    marginTop: 6,
  },

  insightCard: {
    backgroundColor: "#E7F0FC",
    borderRadius: 16,
    padding: 22,
    marginTop: 20,
  },

  insightTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#174779",
    marginBottom: 10,
  },

  insightText: {
    fontSize: 13,
    color: "#355778",
    lineHeight: 22,
  },

  insightNote: {
    fontSize: 12,
    color: "#2764AD",
    fontWeight: "600",
    marginTop: 14,
  },

  footer: {
    marginTop: 42,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E7F0",
    alignItems: "center",
  },

  footerText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#61728A",
    letterSpacing: 1,
    textAlign: "center",
  },

  footerSubtext: {
    fontSize: 11,
    color: "#8795A8",
    marginTop: 7,
    textAlign: "center",
  },
});

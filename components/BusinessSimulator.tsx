import BusinessInsights from "./BusinessInsights";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { formatCurrency } from "../data/businessData";

import {
  type Scenario,
  calculateScenario,
} from "../data/scenario";

type BusinessSimulatorProps = {
  scenario: Scenario;
  setScenario: React.Dispatch<
    React.SetStateAction<Scenario>
  >;
};

export default function BusinessSimulator({
  scenario,
  setScenario,
}: BusinessSimulatorProps) {
  const {
    newRevenue,
    newCosts,
    newProfit,
    newMargin,
    profitChange,
    annualProfitChange,
  } = calculateScenario(scenario);

  function updateScenario(
    key: keyof Scenario,
    amount: number
  ) {
    setScenario((previous) => ({
      ...previous,
      [key]: Math.max(
        -30,
        Math.min(30, previous[key] + amount)
      ),
    }));
  }

  function resetScenario() {
    setScenario({
      materialReduction: 0,
      energyReduction: 0,
      revenueIncrease: 0,
    });
  }

  function Control({
    title,
    scenarioKey,
    value,
  }: {
    title: string;
    scenarioKey: keyof Scenario;
    value: number;
  }) {
    return (
      <View style={styles.control}>
        <Text style={styles.controlTitle}>
          {title}
        </Text>

        <View style={styles.controlRow}>
          <Pressable
            style={styles.button}
            onPress={() =>
              updateScenario(scenarioKey, -5)
            }
          >
            <Text style={styles.buttonText}>
              −
            </Text>
          </Pressable>

          <Text style={styles.percent}>
            {value > 0 ? "+" : ""}
            {value}%
          </Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              updateScenario(scenarioKey, 5)
            }
          >
            <Text style={styles.buttonText}>
              +
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Business Optimization Simulator
      </Text>

      <Text style={styles.description}>
        Adjust business assumptions to explore
        their potential financial impact.
      </Text>

      <Control
        title="Material Cost Reduction / Increase"
        scenarioKey="materialReduction"
        value={scenario.materialReduction}
      />

      <Control
        title="Energy Cost Reduction / Increase"
        scenarioKey="energyReduction"
        value={scenario.energyReduction}
      />

      <Control
        title="Revenue Increase / Decrease"
        scenarioKey="revenueIncrease"
        value={scenario.revenueIncrease}
      />

      <View style={styles.results}>
        <Text style={styles.resultTitle}>
          Scenario Results
        </Text>

        <Text style={styles.label}>
          New Monthly Revenue
        </Text>
        <Text style={styles.value}>
          {formatCurrency(newRevenue)}
        </Text>

        <Text style={styles.label}>
          New Monthly Costs
        </Text>
        <Text style={styles.value}>
          {formatCurrency(newCosts)}
        </Text>

        <Text style={styles.label}>
          New Monthly Profit
        </Text>
        <Text style={styles.value}>
          {formatCurrency(newProfit)}
        </Text>

        <Text style={styles.label}>
          New Profit Margin
        </Text>
        <Text style={styles.value}>
          {newMargin.toFixed(1)}%
        </Text>

        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>
            Monthly Profit Change
          </Text>

          <Text
            style={[
              styles.highlightValue,
              {
                color:
                  profitChange >= 0
                    ? "#16734A"
                    : "#B42318",
              },
            ]}
          >
            {profitChange > 0 ? "+" : ""}
            {formatCurrency(profitChange)}
          </Text>

          <Text style={styles.highlightLabel}>
            Annualized Profit Change
          </Text>

          <Text
            style={[
              styles.highlightValue,
              {
                color:
                  annualProfitChange >= 0
                    ? "#16734A"
                    : "#B42318",
              },
            ]}
          >
            {annualProfitChange > 0 ? "+" : ""}
            {formatCurrency(annualProfitChange)}
          </Text>
        </View>

        <Pressable
          onPress={resetScenario}
          style={styles.resetButton}
        >
          <Text style={styles.resetText}>
            Reset Scenario
          </Text>
        </Pressable>
      </View>

<BusinessInsights scenario={scenario} />

      <Text style={styles.disclaimer}>
        Illustrative calculations using synthetic
        business data. Results are hypothetical and
        do not constitute financial forecasts.
        Calculations exclude implementation costs,
        taxes, and secondary changes to operating
        expenses.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#17243B",
    marginBottom: 9,
  },

  description: {
    fontSize: 13,
    color: "#718096",
    lineHeight: 20,
    marginBottom: 20,
  },

  control: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  controlTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#354761",
  },

  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },

  button: {
    width: 45,
    height: 42,
    backgroundColor: "#E7F0FC",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 23,
    color: "#194A85",
    fontWeight: "700",
  },

  percent: {
    fontSize: 22,
    fontWeight: "800",
    color: "#17243B",
  },

  results: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginTop: 16,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17243B",
    marginBottom: 17,
  },

  label: {
    fontSize: 12,
    color: "#8795A8",
    marginTop: 12,
  },

  value: {
    fontSize: 21,
    fontWeight: "800",
    color: "#193A69",
    marginTop: 4,
  },

  highlight: {
    backgroundColor: "#E7F0FC",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  highlightLabel: {
    fontSize: 12,
    color: "#355778",
    marginTop: 8,
  },

  highlightValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 10,
  },

  resetButton: {
    backgroundColor: "#194A85",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  resetText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  disclaimer: {
    color: "#8795A8",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 15,
  },
});

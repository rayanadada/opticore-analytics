
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import type { Scenario } from "../data/scenario";

import {
  generateBusinessInsights,
  type BusinessInsight,
} from "../data/businessInsights";

type Props = {
  scenario: Scenario;
};

function InsightCard({
  insight,
}: {
  insight: BusinessInsight;
}) {
  const isRisk = insight.category === "risk";

  const isOpportunity =
    insight.category === "opportunity";

  const color = isRisk
    ? "#B42318"
    : isOpportunity
    ? "#16734A"
    : "#194A85";

  const background = isRisk
    ? "#FEF3F2"
    : isOpportunity
    ? "#EAF7F0"
    : "#E7F0FC";

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: color },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {insight.title}
        </Text>

        <View
          style={[
            styles.badge,
            { backgroundColor: background },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: color },
            ]}
          >
            {insight.priority.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {insight.description}
      </Text>

      <Text
        style={[
          styles.category,
          { color: color },
        ]}
      >
        {insight.category.toUpperCase()}
      </Text>
    </View>
  );
}

export default function BusinessInsights({
  scenario,
}: Props) {
  const insights =
    generateBusinessInsights(scenario);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Business Insights
      </Text>

      <Text style={styles.subtitle}>
        Rule-based analysis of scenario assumptions
      </Text>

      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
        />
      ))}

      <Text style={styles.disclaimer}>
        Automatically generated, rule-based insights.
        Recommendations are exploratory and should
        be validated with operational data.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#17243B",
  },

  subtitle: {
    fontSize: 12,
    color: "#718096",
    marginTop: 6,
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E7ECF4",
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#17243B",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },

  description: {
    color: "#54657C",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  category: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 12,
    letterSpacing: 1,
  },

  disclaimer: {
    fontSize: 11,
    color: "#8795A8",
    lineHeight: 17,
    marginTop: 9,
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Platform, StyleSheet } from "react-native";
import { type BusinessData, validateBusinessData } from "../data/businessData";
import { parseBusinessCsv } from "../data/csvImport";

type Props = { current: BusinessData; onApply: (data: BusinessData) => void; onSample: () => void };
const fields = [
  ["monthlyRevenue", "Monthly Revenue"], ["materials", "Materials"], ["labor", "Labor"],
  ["energy", "Energy"], ["logistics", "Logistics"], ["other", "Other Costs"],
] as const;

export default function CompanyDataEditor({ current, onApply, onSample }: Props) {
  const [name, setName] = useState(current.name);
  const [values, setValues] = useState<Record<string, string>>({
    monthlyRevenue: String(current.monthlyRevenue),
    ...Object.fromEntries(Object.entries(current.costs).map(([k, v]) => [k, String(v)])),
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [csvInput, setCsvInput] = useState("");
  const [csvOpen, setCsvOpen] = useState(false);
  useEffect(() => {
    setName(current.name);
    setValues({ monthlyRevenue: String(current.monthlyRevenue),
      ...Object.fromEntries(Object.entries(current.costs).map(([k, v]) => [k, String(v)])) });
  }, [current]);
  const updateValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));
  function apply() {
    const get = (key: string) => values[key]?.trim() === "" ? NaN : Number(values[key]);
    const data: BusinessData = { name: name.trim(), monthlyRevenue: get("monthlyRevenue"), costs: {
      materials: get("materials"), labor: get("labor"), energy: get("energy"), logistics: get("logistics"), other: get("other"),
    }};
    const problem = validateBusinessData(data);
    if (problem) { setError(problem); setNotice(""); return; }
    onApply(data); setError(""); setNotice("Company data applied across Overview, Simulator and Reports.");
  }
  function importCsv(text: string) {
    try {
      const data = parseBusinessCsv(text);
      setName(data.name);
      setValues({ monthlyRevenue: String(data.monthlyRevenue),
        ...Object.fromEntries(Object.entries(data.costs).map(([k, v]) => [k, String(v)])) });
      onApply(data); setError(""); setNotice("CSV imported successfully. Data is processed locally in this browser.");
    } catch (e) { setError(e instanceof Error ? e.message : "Invalid CSV."); setNotice(""); }
  }
  function chooseCsvFile() {
    if (Platform.OS !== "web" || typeof document === "undefined") { setError("File selection is available in the web version. You can enter data manually."); return; }
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".csv,text/csv";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 100_000) { setError("CSV must be smaller than 100 KB."); return; }
      try { importCsv(await file.text()); } catch { setError("Unable to read CSV file."); }
    };
    input.click();
  }
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Company Data</Text>
      <Text style={styles.hint}>Enter your own company numbers or import a one-row CSV. No accounts or server uploads.</Text>
      <Text style={styles.label}>Company name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} maxLength={100} placeholder="Company name" />
      <View style={styles.grid}>
        {fields.map(([key, label]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.label}>{label} (€)</Text>
            <TextInput style={styles.input} value={values[key] ?? ""} onChangeText={(v) => updateValue(key, v)} keyboardType="decimal-pad" placeholder="0" />
          </View>
        ))}
      </View>
      <Pressable style={styles.button} onPress={apply}><Text style={styles.buttonText}>Apply Company Data</Text></Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => { onSample(); setError(""); setNotice("Sample company restored."); }}><Text style={styles.secondaryText}>Use Sample Company</Text></Pressable>
      <Pressable style={styles.secondaryButton} onPress={chooseCsvFile}><Text style={styles.secondaryText}>Import CSV File (Web)</Text></Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => setCsvOpen(!csvOpen)}><Text style={styles.secondaryText}>{csvOpen ? "Hide CSV Paste" : "Paste CSV Instead"}</Text></Pressable>
      {csvOpen && <>
        <Text style={styles.hint}>Headers: companyName,monthlyRevenue,materials,labor,energy,logistics,other</Text>
        <TextInput multiline numberOfLines={4} style={[styles.input, { minHeight: 85, textAlignVertical: "top" }]} value={csvInput} onChangeText={setCsvInput} placeholder={'companyName,monthlyRevenue,materials,labor,energy,logistics,other\nExample Ltd,285000,112000,78000,22500,18000,14500'} />
        <Pressable style={styles.button} onPress={() => importCsv(csvInput)}><Text style={styles.buttonText}>Import Pasted CSV</Text></Pressable>
      </>}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!notice && <Text style={styles.success}>{notice}</Text>}
      <Text style={styles.hint}>Only enter data you are authorized to use. Data is kept in memory and resets when the page reloads. It is not transmitted by this app.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#E7ECF4", marginTop: 20 },
  heading: { fontSize: 20, color: "#17243B", fontWeight: "800" },
  hint: { fontSize: 12, color: "#687992", marginTop: 8, marginBottom: 12, lineHeight: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  field: { width: "48%", marginBottom: 8 }, label: { fontSize: 12, color: "#495A72", fontWeight: "600", marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#CFD9E6", borderRadius: 9, padding: 11, color: "#17243B", backgroundColor: "white" },
  button: { backgroundColor: "#194A85", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 12 },
  buttonText: { color: "white", fontWeight: "700" },
  secondaryButton: { padding: 12, alignItems: "center", marginTop: 8, borderWidth: 1, borderColor: "#D5E0ED", borderRadius: 10 },
  secondaryText: { color: "#194A85", fontWeight: "700" },
  error: { color: "#B42318", marginTop: 12 }, success: { color: "#16734A", marginTop: 12 },
});

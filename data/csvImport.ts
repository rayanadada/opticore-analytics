import { type BusinessData, validateBusinessData } from "./businessData";
// One-row CSV. Quoted fields, commas and escaped double quotes are supported.
export function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { value += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) { fields.push(value.trim()); value = ""; }
    else value += char;
  }
  if (inQuotes) throw new Error("Unclosed quoted CSV field.");
  fields.push(value.trim());
  return fields;
}
export function parseBusinessCsv(csv: string): BusinessData {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length !== 2) throw new Error("CSV must contain exactly one header row and one company row.");
  const headers = parseCsvRow(lines[0]);
  const values = parseCsvRow(lines[1]);
  const expected = ["companyName", "monthlyRevenue", "materials", "labor", "energy", "logistics", "other"];
  if (headers.length !== expected.length || headers.some((h, i) => h !== expected[i]) || values.length !== expected.length) {
    throw new Error(`Expected CSV columns: ${expected.join(", ")}`);
  }
  function amount(index: number): number {
    if (values[index] === "") throw new Error(`Missing value for ${expected[index]}.`);
    const value = Number(values[index]);
    if (!Number.isFinite(value)) throw new Error(`Invalid amount for ${expected[index]}. Use plain numbers without currency symbols.`);
    return value;
  }
  const data: BusinessData = {
    name: values[0], monthlyRevenue: amount(1),
    costs: { materials: amount(2), labor: amount(3), energy: amount(4), logistics: amount(5), other: amount(6) },
  };
  const error = validateBusinessData(data);
  if (error) throw new Error(error);
  return data;
}

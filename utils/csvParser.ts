import { ClientData } from "../types";

export const parseCSV = (csvText: string): ClientData[] => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Determine delimiter (comma or semicolon) based on first line
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  
  const data: ClientData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    
    if (values.length === headers.length) {
      const entry: any = {};
      headers.forEach((header, index) => {
        // Map header to consistent key if needed, or use as is
        entry[header] = values[index];
      });
      
      // Ensure ID_Cliente exists (simple normalization)
      if (entry['ID_Cliente'] || entry['ID'] || entry['id']) {
          const finalEntry: ClientData = {
              ID_Cliente: entry['ID_Cliente'] || entry['ID'] || entry['id'],
              ...entry
          }
          data.push(finalEntry);
      }
    }
  }
  return data;
};

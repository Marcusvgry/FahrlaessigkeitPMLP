import type { JsPsych } from "jspsych";
import { experimentConfig } from "../config";
import { devMode } from "../timeline";

export async function saveExperimentData(jsPsych: JsPsych) {
  const csv = jsPsych.data.get().csv();

  // Im Dev-Mode direkt als Datei herunterladen
  if (devMode) {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `experiment_data_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.info("[jsPsych] Daten als CSV heruntergeladen (Dev-Mode).");
    return;
  }

  const response = await fetch(experimentConfig.dataEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/csv",
    },
    body: csv,
  });

  if (!response.ok) {
    throw new Error(`Server antwortete mit Status ${response.status}`);
  }
}

// src/services/wizardStore.ts
export type WizardData = {
  branch: string;
  branchLabel: string;
  answers: Record<string, unknown>;
};

const KEY = "wizardData";

export function saveWizard(data: WizardData) {
  const s = JSON.stringify(data);
  sessionStorage.setItem(KEY, s);
  localStorage.setItem(KEY, s);
}

export function loadWizard(): WizardData | null {
  const a = sessionStorage.getItem(KEY);
  if (a) { try { return JSON.parse(a); } catch {} }
  const b = localStorage.getItem(KEY);
  if (b) {
    try {
      sessionStorage.setItem(KEY, b); // repoblar para esta pestaña
      return JSON.parse(b);
    } catch {}
  }
  return null;
}

export function clearWizard() {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
}

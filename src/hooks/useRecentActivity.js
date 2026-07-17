import { useState } from "react";

const STORAGE_KEY = "studybuddy_recent_activity";
const MAX_ITEMS = 8;

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function useRecentActivity(currentPageLabel) {
  const [recent] = useState(() => {
    let stored = readStored();
    if (currentPageLabel) {
      const entry = { label: currentPageLabel, timestamp: new Date().toISOString() };
      stored = [entry, ...stored.filter((s) => s.label !== currentPageLabel)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    }
    return stored;
  });

  return recent;
}
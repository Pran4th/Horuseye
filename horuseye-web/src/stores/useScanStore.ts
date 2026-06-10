import { create } from "zustand";

export type BasicFormData = {
  targetType: string;
  targetValue: string;
  scanName: string;
  description: string;
  scanIntensity: string;
  scanSchedule: string;
  maxDuration: string;
  notifyOnCompletion: boolean;
  generateReport: boolean;
  saveConfiguration: boolean;
};

export type ScanData = {
  id: string;
  createdAt: number;
  data: {
    basicDetails?: BasicFormData;
    roe?: Record<string, any>;
    recon?: Record<string, any>;
    vulnr?: Record<string, any>;
    exploit?: Record<string, any>;
  };
};

type ScanStore = {
  currentScan: ScanData | null;
  setCurrentScan: (scan: ScanData) => void;
  updateSection: <K extends keyof ScanData["data"]>(
    section: K,
    value: ScanData["data"][K],
  ) => void;
  clearCurrentScan: () => void;
};

export const useScanStore = create<ScanStore>((set, get) => ({
  currentScan: null,

  setCurrentScan: (scan) => set({ currentScan: scan }),

  updateSection: (section, value) =>
    set((state) => {
      if (!state.currentScan) return state;
      const updatedScan: ScanData = {
        ...state.currentScan,
        data: {
          ...state.currentScan.data,
          [section]: value,
        },
      };

      localStorage.setItem(
        `scan-${updatedScan.id}`,
        JSON.stringify(updatedScan),
      );
      return { currentScan: updatedScan };
    }),

  clearCurrentScan: () => set({ currentScan: null }),
}));

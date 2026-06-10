import { create } from "zustand";
import {
  fetchAllScans,
  fetchScanDetails,
  fetchScanStatus,
  deleteScanById,
  generateDownloadUrl,
  fetchScanFiles,
  type ScanBasicResponse,
  type ScanDetailResponse,
  type ScanFileResponse,
} from "../lib/scan-api";

type ScanResultsState = {
  scans: ScanBasicResponse[];
  currentScanDetails: ScanDetailResponse | null;
  currentScanFiles: ScanFileResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingFiles: boolean;
  error: string | null;
  fileError: string | null;
};

type ScanResultsActions = {
  fetchScans: () => Promise<void>;
  fetchScanDetails: (scanId: string) => Promise<void>;
  refreshScanStatus: (scanId: string) => Promise<void>;
  deleteScan: (scanId: string) => Promise<void>;
  clearCurrentScanDetails: () => void;
  fetchScanFiles: (scanId: string) => Promise<void>;
  generateDownloadUrl: (scanFileId: string) => Promise<string>;
};

export const useScanResultsStore = create<
  ScanResultsState & ScanResultsActions
>((set, get) => ({
  scans: [],
  currentScanDetails: null,
  currentScanFiles: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingFiles: false,
  error: null,
  fileError: null,

  fetchScans: async () => {
    set({ isLoading: true, error: null });
    try {
      const scans = await fetchAllScans();
      set({ scans, isLoading: false });
    } catch (err) {
      set({
        error: (err as Error).message || "Failed to fetch scans",
        isLoading: false,
      });
    }
  },

  fetchScanDetails: async (scanId: string) => {
    set({ isLoading: true, error: null, currentScanDetails: null });
    try {
      const details = await fetchScanDetails(scanId);
      set({ currentScanDetails: details, isLoading: false });
    } catch (err) {
      set({
        error: (err as Error).message || "Failed to fetch scan details",
        isLoading: false,
      });
    }
  },

  refreshScanStatus: async (scanId: string) => {
    set({ isRefreshing: true, error: null });
    try {
      const updatedScan = await fetchScanStatus(scanId);
      set((state) => ({
        scans: state.scans.map((scan) =>
          scan.id === scanId ? updatedScan : scan,
        ),
        isRefreshing: false,
      }));
    } catch (err) {
      set({
        error: (err as Error).message || "Failed to refresh scan status",
        isRefreshing: false,
      });
    }
  },

  deleteScan: async (scanId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteScanById(scanId);
      set((state) => ({
        scans: state.scans.filter((scan) => scan.id !== scanId),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: (err as Error).message || "Failed to delete scan",
        isLoading: false,
      });
    }
  },

  clearCurrentScanDetails: () => {
    set({ currentScanDetails: null });
  },

  fetchScanFiles: async (scanId: string) => {
    set({ isLoadingFiles: true, fileError: null, currentScanFiles: [] });
    try {
      const files = await fetchScanFiles(scanId);
      set({ currentScanFiles: files, isLoadingFiles: false });
    } catch (err) {
      set({
        isLoadingFiles: false,
        fileError: (err as Error).message || "Failed to fetch scan files",
      });
    }
  },

  generateDownloadUrl: async (scanFileId: string) => {
    try {
      const response = await generateDownloadUrl(scanFileId);
      return response.url;
    } catch (err) {
      set({
        fileError: (err as Error).message || "Failed to generate download URL",
      });
      throw err;
    }
  },
}));

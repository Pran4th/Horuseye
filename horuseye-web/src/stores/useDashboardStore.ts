import { create } from "zustand";
import {
  fetchDashboardStats,
  type DashboardStatsResponse,
} from "../lib/api-dashboard";

type DashboardState = {
  stats: DashboardStatsResponse | null;
  isLoading: boolean;
  error: string | null;
};

type DashboardActions = {
  fetchStats: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set) => ({
    stats: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
      set({ isLoading: true, error: null });
      try {
        const stats = await fetchDashboardStats();
        set({ stats, isLoading: false });
      } catch (err) {
        set({
          error: (err as Error).message || "Failed to fetch dashboard stats",
          isLoading: false,
        });
      }
    },
  }),
);

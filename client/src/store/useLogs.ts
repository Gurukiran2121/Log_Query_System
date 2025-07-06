import { create } from "zustand";
import apiClient from "../api/AxiosInstance";

export interface Logs {
  id: string;
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, string>;
}

type filters = Record<string, string>;

interface LogsStore {
  logs: Logs[];
  isLogsLoading: boolean;
  error: Error | null;
  fetchLogs: (filters?: filters) => void;
  totalLogs: number;
  spanIdOptions: Record<string, string>[];
}

const useLogs = create<LogsStore>((set) => ({
  logs: [],
  isLogsLoading: false,
  error: null,
  totalLogs: 0,
  spanIdOptions: [],
  fetchLogs: async (filters) => {
    set({ isLogsLoading: true });
    try {
      const response = await apiClient.get("/logs", { params: filters });
      if (response.status === 200) {
        set({
          logs: response.data.logs,
          isLogsLoading: false,
          totalLogs: response.data.total,
        });
        const newSpanIdOptions = response.data.spanId.map((id: string) => ({
          label: id,
          value: id,
        }));
        set({ spanIdOptions: newSpanIdOptions });
      }
    } catch (error) {
      set({ error: error as Error, isLogsLoading: false });
    }
  },
}));

export default useLogs;

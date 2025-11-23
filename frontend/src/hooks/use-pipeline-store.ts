// /store/pipelineStore.ts
import { create } from "zustand";

interface PipelineConfig {
  [stepTitle: string]: Record<string, any>;
}

interface PipelineStore {
  config: PipelineConfig;
  setParam: (stepTitle: string, paramName: string, value: any) => void;
  reset: () => void;
}

export const usePipelineStore = create<PipelineStore>(set => ({
  config: {},
  setParam: (stepTitle, paramName, value) =>
    set(state => ({
      config: {
        ...state.config,
        [stepTitle]: {
          ...state.config[stepTitle],
          [paramName]: value,
        },
      },
    })),
  reset: () => set({ config: {} }),
}));

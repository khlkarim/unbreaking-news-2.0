// /store/pipelineStore.ts
import { create } from "zustand";

interface PipelineConfig {
  [stepTitle: string]: Record<string, any>;
}

interface Result {
  metadata: {
    score: number;
    notes: string[];
  };
  consistency: {
    score: number;
    notes: string[];
  };
  visualForensics: {
    score: number;
    notes: string[];
  };
  contentIntegrity: {
    score: number;
    notes: string[];
  }
}

interface PipelineStore {
  result?: Result;
  config: PipelineConfig;
  file?: File;
  resultHydrated: boolean;

  setParam: (stepTitle: string, paramName: string, value: any) => void;
  setFile: (file: File | null) => void;
  setResult: (result: Result | null) => void;
  reset: () => void;
}

const defaultConfig = {
  "Content Integrity": {
    "fontTolerance": 0.9
  }
};

export const usePipelineStore = create<PipelineStore>((set) => ({
  config: defaultConfig,
  resultHydrated: false,

  setParam: (stepTitle, paramName, value) =>
    set((state) => ({
      config: {
        ...state.config,
        [stepTitle]: {
          ...state.config[stepTitle],
          [paramName]: value,
        },
      },
    })),

  setFile: (file) =>
    set(() => ({
      file: file ?? undefined,
    })),

  setResult: (result: Result | null) =>
    set(() => ({
      result: result ?? undefined,
      resultHydrated: !!result,
    })),

  reset: () => set({ config: defaultConfig, file: undefined, result: undefined }),
}));

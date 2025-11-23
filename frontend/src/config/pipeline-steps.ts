// /config/pipelineSteps.ts

import { FileSearch, Workflow, Settings, ShieldCheck, FileCheck } from "lucide-react";

// Parameter type with optional displayName and select support
interface StepParameter<T> {
  name: string;
  displayName?: string; // human-friendly label for UI
  type: "string" | "number" | "boolean" | "array";
  default?: T;
  description?: string;
  options?: T[]; // if provided, render as a select menu in UI
}

// Step type
interface PipelineStep {
  title: string;
  icon: any; // can be typed more strictly for your icon library
  description?: string;
  parameters?: StepParameter<any>[]; // optional
}

// Pipeline configuration
export const pipelineSteps: PipelineStep[] = [
  {
    title: "Metadata Analysis",
    icon: FileSearch,
    description: "Extract and validate metadata like author, creation date, software used, etc.",
    parameters: [
      {
        name: "ignoreFields",
        displayName: "Ignored Metadata Fields",
        type: "array",
        default: [],
        description: "List of metadata fields to ignore during analysis (e.g., timestamps that vary automatically).",
      },
      {
        name: "dateRange",
        displayName: "Allowed Date Range",
        type: "array",
        description: "Expected creation/modification date range [start, end] in ISO format.",
      },
    ],
  },
  {
    title: "Visual Forensics",
    icon: Workflow,
    description: "Detect visual alterations or inconsistencies in scanned document images.",
    parameters: [
      {
        name: "detectionThreshold",
        displayName: "Detection Threshold",
        type: "number",
        default: 0.8,
        description: "Sensitivity threshold for alteration detection (0-1).",
      },
      {
        name: "colorChannels",
        displayName: "Color Channels",
        type: "string",
        default: "grayscale",
        options: ["R", "G", "B", "grayscale"], // will render as select
        description: "Which color channel to analyze.",
      },
      {
        name: "noiseFilter",
        displayName: "Apply Noise Filter",
        type: "boolean",
        default: true,
        description: "Enable preprocessing noise removal to reduce false positives.",
      },
      {
        name: "regionsOfInterest",
        displayName: "Regions of Interest",
        type: "array",
        description: "Optional specific areas (x,y,width,height) to focus analysis on.",
      },
    ],
  },
  {
    title: "Content Integrity",
    icon: ShieldCheck,
    description: "Check textual content, fonts, formatting, and potential plagiarism.",
    parameters: [
      {
        name: "plagiarismCheck",
        displayName: "Enable Plagiarism Check",
        type: "boolean",
        default: false,
        description: "Enable or disable plagiarism analysis.",
      },
      {
        name: "fontTolerance",
        displayName: "Font Tolerance",
        type: "number",
        default: 0.9,
        description: "How strictly font inconsistencies are detected (0-1).",
      },
      {
        name: "regexChecks",
        displayName: "Regex Validation Patterns",
        type: "array",
        description: "Optional regex patterns to validate structured content (dates, IDs, etc.)",
      },
    ],
  },
  {
    title: "Consistency",
    icon: FileCheck,
    description: "Validate internal consistency between metadata, content, and signatures.",
    parameters: [
      {
        name: "checkDates",
        displayName: "Check Dates",
        type: "boolean",
        default: true,
        description: "Verify chronological consistency between document elements.",
      },
      {
        name: "checkSignatures",
        displayName: "Check Signatures",
        type: "boolean",
        default: true,
        description: "Enable signature/digital certificate validation.",
      },
      {
        name: "consistencyRules",
        displayName: "Consistency Rules",
        type: "array",
        description: "Optional custom rules to validate logical consistency across document fields.",
      },
    ],
  },
];

export type { PipelineStep, StepParameter };

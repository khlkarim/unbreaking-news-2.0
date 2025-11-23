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
        name: "expectedAuthor",
        displayName: "Expected Author",
        type: "string",
        description: "Author name to validate against, if known.",
      },
      {
        name: "dateRange",
        displayName: "Allowed Date Range",
        type: "array",
        description: "Expected creation/modification date range [start, end] in ISO format.",
      },
      {
        name: "hashCheck",
        displayName: "Enable Hash Verification",
        type: "boolean",
        default: true,
        description: "Enable verification against known file hashes.",
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
    title: "Preprocessing",
    icon: Settings,
    description: "Standardize documents for analysis (OCR, binarization, deskewing, etc.)",
    parameters: [
      {
        name: "resizeDimensions",
        displayName: "Resize Dimensions",
        type: "array",
        description: "[width, height] to resize images for uniform processing.",
      },
      {
        name: "binarizationMethod",
        displayName: "Binarization Method",
        type: "string",
        default: "otsu",
        options: ["otsu", "adaptive", "simple"], // select menu
        description: "Thresholding algorithm used for OCR preprocessing.",
      },
      {
        name: "ocrLanguage",
        displayName: "OCR Language",
        type: "string",
        default: "eng",
        description: "Language code for OCR engine.",
      },
      {
        name: "deskew",
        displayName: "Deskew Image",
        type: "boolean",
        default: true,
        description: "Correct skewed images before further analysis.",
      },
      {
        name: "denoise",
        displayName: "Denoise Image",
        type: "boolean",
        default: true,
        description: "Filter out image noise before analysis.",
      },
    ],
  },
  {
    title: "Content Integrity",
    icon: ShieldCheck,
    description: "Check textual content, fonts, formatting, and potential plagiarism.",
    parameters: [
      {
        name: "hashDatabase",
        displayName: "Hash Database",
        type: "array",
        description: "Reference hashes for document integrity verification.",
      },
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

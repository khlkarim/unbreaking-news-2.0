import {
  Upload,
  Workflow,
  FileSearch,
  Settings,
  ShieldCheck,
  GitCompare,
  FileCheck,
  type LucideIcon
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Authentification Pipeline",
    items: [
      {
        title: "Metadata Analysis",
        url: "/dashboard/metadata-analysis",
        icon: FileSearch,
      },
      {
        title: "Visual Forensics",
        url: "/dashboard/visual-forensics",
        icon: Workflow,
      },
      {
        title: "Preprocessing",
        url: "/dashboard/preprocessing",
        icon: Settings,
      },
      {
        title: "Content Integrity",
        url: "/dashboard/content-integrity",
        icon: ShieldCheck,
      },
      {
        title: "Consistency",
        url: "/dashboard/consistency",
        icon: FileCheck,
      },
      // {
      //   title: "Authentication",
      //   url: "/auth",
      //   icon: Fingerprint,
      //   subItems: [
      //     { title: "Login v1", url: "/auth/v1/login", newTab: true },
      //     { title: "Login v2", url: "/auth/v2/login", newTab: true },
      //     { title: "Register v1", url: "/auth/v1/register", newTab: true },
      //     { title: "Register v2", url: "/auth/v2/register", newTab: true },
      //   ],
      // },
    ],
  }
];

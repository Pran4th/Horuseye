import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  File,
} from "lucide-react";
import { title } from "process";

export const NavData = {
  teams: [
    {
      name: "Big Corp Finance Ltd.",
      logo: GalleryVerticalEnd,
      type: "Enterprise",
    },
    {
      name: "Whitecoast Security",
      logo: AudioWaveform,
      type: "Organization",
    },
    {
      name: "Startup Labs",
      logo: Command,
      type: "Organization",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/u/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/u/dashboard",
        },
        {
          title: "Analytics",
          url: "/u/dashboard",
        },
      ],
    },
    {
      title: "Scans",
      url: "/u/scans",
      icon: Bot,
      items: [
        {
          title: "Overview",
          url: "/u/scans/overview",
        },
        {
          title: "New Scan",
          url: "#",
        },
      ],
    },
    {
      title: "Files",
      url: "/u/files",
      icon: File,
      items: [
        {
          title: "Reports",
          url: "/u/files",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/u/docs/introduction",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/u/docs/introduction",
        },
        {
          title: "Quick Start",
          url: "/u/docs/quick-start",
        },
        {
          title: "Recon Tools",
          url: "/u/docs/tools/recon",
        },
        {
          title: "Vulnerability Tools",
          url: "/u/docs/tools/vulnr",
        },
        {
          title: "Exploitation Tools",
          url: "/u/docs/tools/exploit",
        },
        {
          title: "Report Insights",
          url: "/u/docs/report-insight",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

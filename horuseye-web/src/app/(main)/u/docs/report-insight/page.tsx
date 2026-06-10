"use client"; // Add "use client" for hooks and client-side logic

import React from "react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  Lightbulb,
  ShieldAlert,
  BarChart3,
  Check,
  ArrowLeft, // Import new icon
  ArrowRight, // Import new icon
} from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import { v4 as uuidv4 } from "uuid"; // Import uuid

// --- Navigation Button Component ---
// In a real app, you might move this to its own file
const DocsNavigation = ({
  prev,
  next,
}: {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) => {
  return (
    <div className="mt-12 flex w-full justify-between border-t pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="hover:bg-muted flex w-auto max-w-[48%] flex-col items-start gap-1 rounded-md border p-4 text-left transition-colors"
        >
          <span className="text-muted-foreground text-xs">Previous</span>
          <span className="text-primary flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div /> // Empty div to maintain spacing
      )}
      {next ? (
        <Link
          href={next.href}
          className="hover:bg-muted flex w-auto max-w-[48%] flex-col items-end gap-1 rounded-md border p-4 text-right transition-colors"
        >
          <span className="text-muted-foreground text-xs">Next</span>
          <span className="text-primary flex items-center gap-2 font-medium">
            <span className="truncate">{next.title}</span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </span>
        </Link>
      ) : (
        <div /> // Empty div to maintain spacing
      )}
    </div>
  );
};

// --- Page Component ---

export default function UnderstandingReport() {
  const router = useRouter(); // Initialize router

  // --- NEW: Function to handle starting a new scan ---
  const handleNewScan = () => {
    const id = uuidv4();

    if (typeof window !== "undefined") {
      // Clear any old, incomplete scan data
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scan-")) {
          localStorage.removeItem(key);
        }
      });

      // Create a new scan object in local storage
      const newScan = {
        id,
        createdAt: Date.now(),
        data: {}, // Start with empty data
      };
      localStorage.setItem(`scan-${id}`, JSON.stringify(newScan));
    }

    // Redirect the user to the new scan wizard
    router.push(`/u/new-scan/${id}`);
  };

  return (
    // Wrapper with consistent styling
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* --- NEW: Top Navigation --- */}
      <div className="mb-4 flex justify-between">
        <Link
          href="/u/docs/tools/exploit"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Exploitation Tools
        </Link>
        {/* No next link at the top */}
      </div>
      {/* --- End Top Navigation --- */}

      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold">Understanding Your Report</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your scan is complete. This guide breaks down the structure of your
          report to help you prioritize findings and take action.
        </p>
      </div>

      {/* Main content block */}
      <div className="mt-12 space-y-12">
        {/* --- 1. The Executive Summary --- */}
        <div id="summary" className="scroll-m-20">
          <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <BarChart3 className="h-6 w-6" />
            Section 1: Executive Summary
          </h2>
          <p className="text-muted-foreground mt-4 leading-7">
            This is a high-level, human-readable overview of the scan's most
            important results. It's written by our AI to give you an
            "at-a-glance" understanding of your security posture.
          </p>
          <p className="text-muted-foreground mt-4 leading-7">
            Look for this section to understand:
          </p>
          <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5">
            <li>
              The overall risk profile of the target (e.g., "heightened risk").
            </li>
            <li>
              Key themes found, such as <strong>outdated software</strong> or{" "}
              <strong>unusual open ports</strong>.
            </li>
            <li>A top-level conclusion on what to investigate first.</li>
          </ul>
        </div>

        {/* --- 2. Critical Findings --- */}
        <div id="critical-findings" className="scroll-m-20">
          <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <ShieldAlert className="text-destructive h-6 w-6" />
            Section 2: Critical Findings
          </h2>
          <p className="text-muted-foreground mt-4 leading-7">
            This section lists the most severe, high-impact vulnerabilities that
            require your immediate attention. These are not just raw logs; they
            are <strong>correlated findings</strong> that combine data from
            multiple tools.
          </p>

          <p className="text-muted-foreground mt-4 leading-7">
            Each finding in this list is broken down into three parts:
          </p>
          <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5">
            <li>
              <strong>Description:</strong> What we found, consolidating data
              (e.g., "Tool A found an open port, and Tool B confirmed it's
              running an outdated service").
            </li>
            <li>
              <strong>Impact:</strong> Why it's a problem (e.g., "A successful
              exploit...could lead to full unauthorized remote access").
            </li>
            <li>
              <strong>Recommendation:</strong> What to do right now (e.g.,
              "Immediately update the server" and "harden the configuration").
            </li>
          </ul>
        </div>

        {/* --- 3. Detailed Analysis --- */}
        <div id="detailed-analysis" className="scroll-m-20">
          <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <FileText className="h-6 w-6" />
            Section 3: Detailed Analysis
          </h2>
          <p className="text-muted-foreground mt-4 leading-7">
            This is the complete, tool-by-tool breakdown of every single finding
            from the scan. This is where you can see the raw data and evidence
            for each issue.
          </p>
          <p className="text-muted-foreground mt-4 leading-7">
            The findings are grouped by the <strong>tool</strong> that found
            them (e.g., `NMAP`, `MASSCAN`, `WHATWEB`). Each individual finding
            includes:
          </p>
          <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5">
            <li>
              <strong>Severity:</strong> The risk of this *specific* finding,
              such as `High`, `Medium`, or `Informational`.
            </li>
            <li>
              <strong>Evidence:</strong> The exact, raw output from the tool,
              such as a log line or a JSON object.
            </li>
            <li>
              <strong>Recommendation:</strong> A specific fix for this
              individual finding.
            </li>
          </ul>

          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>How to Use This Section</AlertTitle>
            <AlertDescription>
              This section is perfect for your technical team to verify the
              results. For example, an `Informational` finding from `MASSCAN`
              (like "port 80 is open") is used as evidence for a `High` severity
              finding from `NMAP` (which confirmed "Apache 2.4.7" on that port).
            </AlertDescription>
          </Alert>
        </div>

        {/* --- UPDATED Call to Action --- */}
        <div className="bg-card mt-12 rounded-xl border p-6">
          <h2 className="text-2xl font-semibold">Ready to Find Your Own?</h2>
          <p className="text-muted-foreground mt-3">
            Now that you understand how a report is structured, you're ready to
            run your own scan. Head over to the Quick Start guide to configure
            and launch your first test.
          </p>
          <div className="mt-6">
            {/* --- MODIFIED: Changed from Link to Button with onClick --- */}
            <button
              onClick={handleNewScan}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 cursor-pointer items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
            >
              Get Started with Your First Scan
            </button>
          </div>
        </div>

        {/* --- NEW: Page Navigation --- */}
        <DocsNavigation
          prev={{
            title: "Exploitation Tools",
            href: "/u/docs/tools/exploit",
          }}
          // No next link, as this is the end of the guide flow
        />
      </div>
    </div>
  );
}

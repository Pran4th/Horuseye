import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import new icons

// --- Icon components (You would import these from 'lucide-react') ---

// Icon for Step 1: Basic Config
const FormIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

// Icon for Step 2: ROE
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// Icon for Step 3: Recon
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

// Icon for Step 4: Vuln (Using the ShieldAlert icon)
const BugIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

// Icon for Step 5: Exploit
const BoltIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m13.29 12-2.12 5.5a.5.5 0 0 0 .92.32L14 13h-2.12a.5.5 0 0 1-.44-.71L13 6l-2.71 5.5A.5.5 0 0 0 10.7 12h2.6z" />
  </svg>
);

// Icon for Step 6: Preview
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// --- Navigation Button Component ---
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

// --- Quick Start Page Component ---

export default function QuickStart() {
  return (
    // Use the exact same wrapper as your forms for consistent width and padding
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* --- NEW: Top Navigation --- */}
      <div className="mb-4 flex justify-between">
        <Link
          href="/u/docs/introduction"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Introduction
        </Link>
        <Link
          href="/u/docs/tools/recon"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          Next: Recon Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {/* --- End Top Navigation --- */}

      {/* Page Title and Lead Paragraph:
        - h1: Matches 'text-4xl font-bold'
        - p: Matches 'text-lg text-muted-foreground mt-2'
      */}
      <div>
        <h1 className="text-4xl font-bold">Configuring Your First Scan</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          This guide walks you through the step-by-step wizard for setting up
          and launching a new scan.
        </p>
      </div>

      {/* Prerequisite Card */}
      <div className="bg-card mt-8 rounded-lg border p-5">
        <h3 className="font-semibold">Before You Begin</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          To start a new scan, you must first have a <strong>Project</strong>{" "}
          created. From your project's dashboard, click the{" "}
          <strong>"New Scan"</strong> button to open this 6-step wizard.
        </p>
      </div>

      {/* Main content block, using `mt-12` to match your forms' content start */}
      <div className="mt-12">
        <div className="bg-card rounded-xl border p-6 md:p-8">
          <div className="flex flex-col gap-10">
            {/* --- Step 1: Basic Scan Configuration --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  1
                </span>
                <FormIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Basic Scan Configuration
                </h3>
                <p className="text-muted-foreground mt-2">
                  This step defines the "what, where, and when" of your scan.
                </p>
                <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Target Type / Value</strong>: Define your target.
                    Currently, you must select `IP Address` and enter a valid
                    `IPv4` address.
                  </li>
                  <li>
                    <strong>Scan Name</strong>: A unique name for this scan,
                    like `Prod_Web_Server_Scan`. Only letters, numbers, hyphens
                    (`-`), and underscores (`_`) are allowed.
                  </li>
                  <li>
                    <strong>Additional Options</strong>: Click this to expand
                    options for
                    <strong>Scan Intensity</strong> (e.g., `Deep`),{" "}
                    <strong>Schedule</strong> (e.g., `Weekly`), and notification
                    toggles.
                  </li>
                </ul>
              </div>
            </div>

            {/* --- Step 2: Rules of Engagement --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  2
                </span>
                <ShieldIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Rules of Engagement</h3>
                <p className="text-muted-foreground mt-2">
                  You must provide a Rules of Engagement (ROE) or purpose
                  statement. You can either:
                </p>
                <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Type directly</strong> into the text area.
                  </li>
                  <li>
                    <strong>Upload a document</strong> (`.docx`, `.png`, `.jpg`)
                    to automatically extract the text.
                  </li>
                </ul>
                <p className="text-muted-foreground mt-2 text-xs">
                  Note: The final statement must be at least 1000 characters
                  long to proceed.
                </p>
              </div>
            </div>

            {/* --- Step 3: Reconnaissance Tools --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  3
                </span>
                <SearchIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Reconnaissance Tools</h3>
                <p className="text-muted-foreground mt-2">
                  This screen uses two tabs to configure your discovery tools.
                </p>
                <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Tool Selection Tab</strong>: Use the switches to
                    enable the recon tools you want, like `nmap` or
                    `theHarvester`.
                  </li>
                  <li>
                    <strong>Configuration Tab</strong>: For each tool you
                    enabled, you can add or modify parameters (e.g., select
                    boolean flags or provide input for values).
                  </li>
                </ul>
              </div>
            </div>

            {/* --- Step 4: Vulnerability Tools --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  4
                </span>
                <BugIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Vulnerability Assessment
                </h3>
                <p className="text-muted-foreground mt-2">
                  Similar to the recon step, this page allows you to configure
                  your vulnerability scanners.
                </p>
                <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    <strong>Tool Selection Tab</strong>: Enable tools like
                    `nikto`, `nuclei`, or `httpx`.
                  </li>
                  <li>
                    <strong>Configuration Tab</strong>: Fine-tune the parameters
                    for each selected vulnerability scanner.
                  </li>
                </ul>
              </div>
            </div>

            {/* --- Step 5: Exploitation (Optional) --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  5
                </span>
                <BoltIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  Advanced Exploitation (Optional)
                </h3>
                <p className="text-muted-foreground mt-2">
                  This step is disabled by default.
                </p>
                <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 text-sm">
                  <li>
                    To <strong>skip</strong> this phase, simply leave the
                    `Attempt Exploitation` checkbox unchecked and click "Next".
                  </li>
                  <li>
                    To <strong>enable</strong> it, check the box. This will
                    unlock the `Tool Selection` and `Configuration` tabs,
                    allowing you to add exploitation tools.
                  </li>
                </ul>
              </div>
            </div>

            {/* --- Step 6: Final Scan Preview --- */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <span className="bg-muted text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold">
                  6
                </span>
                <CheckIcon className="text-muted-foreground hidden h-8 w-8 md:block" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Final Scan Preview</h3>
                <p className="text-muted-foreground mt-2">
                  You're all set. This final screen shows a read-only summary of
                  your entire configuration, including your target, ROE, and all
                  selected tools.
                </p>
                <p className="text-muted-foreground mt-2">
                  Review everything carefully. When you're ready, hit{" "}
                  <strong>"Start Security Scan"</strong> to launch the test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODIFIED "What's Next" block --- */}
      <div className="bg-card mt-8 rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">What's Next?</h2>
        <p className="text-muted-foreground mt-3">
          Your scan is now running. While you wait, why not learn more about the
          powerful tools HorusEye uses in its automated workflows?
        </p>
        <div className="mt-6">
          <Link
            href="/u/docs/tools/recon" // Updated link
            // Standard shadcn-style button
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            Explore Tools
          </Link>
        </div>
      </div>

      {/* --- NEW: Page Navigation --- */}
      <DocsNavigation
        prev={{ title: "Introduction", href: "/u/docs/introduction" }}
        next={{
          title: "Reconnaissance Tools",
          href: "/u/docs/tools/recon",
        }}
      />
    </div>
  );
}

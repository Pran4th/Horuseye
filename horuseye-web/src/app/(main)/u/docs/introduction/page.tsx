import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import ArrowRight

// --- Icon components (place these here or import from 'lucide-react') ---

const ZapIcon = ({ className }: { className?: string }) => (
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
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const BotIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
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
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </svg>
);

// --- Introduction Page Component ---

export default function Introduction() {
  return (
    // Use the exact same wrapper as your form for consistent width and padding
    <div className="mx-auto w-full max-w-4xl p-6">
      {/* --- NEW: Next Button --- */}
      <div className="mb-4 flex justify-end">
        <Link
          href="/u/docs/quick-start" // Points to the quick-start page
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          Next: Quick Start
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Page Title and Lead Paragraph:
        - h1: Matches the 'text-4xl font-bold' from your form
        - p: Matches the 'text-lg text-muted-foreground mt-2' from your form
      */}
      <div>
        <h1 className="text-4xl font-bold">What is HorusEye?</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          HorusEye is an automated, AI-powered penetration testing platform. We
          provide continuous security monitoring for your web apps, APIs, and
          cloud infrastructure.
        </p>
      </div>

      {/* Main content block, using `mt-12` to match your form's content start */}
      <div className="mt-12">
        <p className="text-muted-foreground leading-7">
          Instead of running periodic, time-consuming manual tests, HorusEye
          integrates directly into your workflow. We automate the entire
          pentesting process: from <strong>reconnaissance</strong> and
          <strong>vulnerability scanning</strong> to safe{" "}
          <strong>exploitation and validation</strong>. Our goal is to find
          security flaws before attackers do.
        </p>
      </div>

      {/* --- Core Features Section --- */}
      {/* We use a grid here for a professional, card-like layout */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold tracking-tight">Core Features</h2>

        <div className="mt-6 grid auto-rows-min gap-4 md:grid-cols-3">
          {/* Card 1: Replaces `bg-muted/50` with a full `bg-card` style */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border p-5">
            <ZapIcon className="text-primary h-6 w-6" />
            <h3 className="font-semibold">Full Workflow Automation</h3>
            <p className="text-muted-foreground text-sm">
              We chain industry-standard tools into a seamless, automated
              workflow.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border p-5">
            <BotIcon className="text-primary h-6 w-6" />
            <h3 className="font-semibold">AI-Powered Reports</h3>
            <p className="text-muted-foreground text-sm">
              Our LLM analyzes findings, prioritizes risks, and provides
              actionable remediation advice.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card flex flex-col gap-3 rounded-xl border p-5">
            <CodeIcon className="text-primary h-6 w-6" />
            <h3 className="font-semibold">Developer-First IntegrATIONS</h3>
            <p className="text-muted-foreground text-sm">
              Get alerts in Slack, JIRA, or webhooks to fit directly into your
              CI/CD pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* --- Call to Action --- */}
      {/* This uses the same card style from the QuickStart page */}
      <div className="bg-card mt-12 rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">Ready to Start?</h2>
        <p className="text-muted-foreground mt-3">
          Run your first scan in under 5 minutes. Head over to our Quick Start
          guide to set up your account and define your first target.
        </p>
        <div className="mt-6">
          <Link
            href="/u/docs/quick-start"
            // Standard shadcn-style button
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            Go to Quick Start
          </Link>
        </div>
      </div>
    </div>
  );
}

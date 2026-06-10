import React from "react";
import Link from "next/link"; // Import Link
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react"; // Import new icons

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

export default function ExploreVulnTools() {
  // This is the JSON data you provided for vuln_assessment
  const vulnAssessmentTools = [
    {
      name: "nuclei",
      default_command: "nuclei -u <target>",
      parameters: [
        {
          flag: "-t",
          description:
            "Custom template file or directory path to use. If not provided, all templates will be used.",
          requiresValue: true,
          example: "-t /path/to/my/custom-checks/",
        },
        {
          flag: "-tags",
          description:
            "Filter templates by tags (e.g., cve,misconfig,default-logins).",
          requiresValue: true,
          example: "-tags cve,rce",
        },
        {
          flag: "-severity",
          description: "Filter templates by severity.",
          requiresValue: true,
          example: "-severity high,critical",
          options: ["info", "low", "medium", "high", "critical"],
        },
        {
          flag: "-c",
          description: "Concurrency (number of templates to run in parallel).",
          requiresValue: true,
          example: "-c 25",
        },
        {
          flag: "-rate-limit",
          description: "Requests per second rate limit.",
          requiresValue: true,
          example: "-rate-limit 150",
        },
        {
          flag: "-proxy",
          description: "Use a proxy for requests.",
          requiresValue: true,
          example: "-proxy http://127.0.0.1:8080",
        },
      ],
      notes:
        "Nuclei is a powerful, template-based vulnerability scanner. By default, it runs against the entire template library. You can provide a custom template path with -t to narrow the scope.",
    },
    {
      name: "nikto",
      parameters: [
        {
          flag: "-p",
          description: "Ports to scan (comma or range).",
          requiresValue: true,
          example: "80,443",
        },
        {
          flag: "-Tuning",
          description:
            "Tuning options: 1-9 to include/exclude classes of checks (lower values are safer).",
          requiresValue: true,
          example: "1,2,3",
        },
        {
          flag: "-Plugins",
          description:
            "Limit scanning to specific plugins (semicolon-separated).",
          requiresValue: true,
          example: "apache_expect_xss;subdomain",
        },
        {
          flag: "-ssl",
          description: "Force SSL connection.",
          requiresValue: false,
          example: "-ssl",
        },
        {
          flag: "-useragent",
          description: "Set custom User-Agent header.",
          requiresValue: true,
          example: "Mozilla/5.0",
        },
        {
          flag: "-timeout",
          description: "Socket timeout (seconds).",
          requiresValue: true,
          example: "10",
        },
        {
          flag: "-maxtime",
          description:
            "Maximum time for a full scan (e.g., '1h', '30m', '600s').",
          requiresValue: true,
          example: "10m",
        },
      ],
      notes:
        "Nikto is a webserver scanner with many checks; keep tuning low and avoid high-risk tests if your UI must be non-destructive.",
    },
    {
      name: "sqlmap",
      parameters: [
        {
          flag: "--data",
          description: "POST data (for testing POST endpoints).",
          requiresValue: true,
          example: "--data 'id=1&cat=2'",
        },
        {
          flag: "--cookie",
          description: "Set cookie header.",
          requiresValue: true,
          example: "--cookie 'SESSION=abc'",
        },
        {
          flag: "--threads",
          description: "Number of concurrent threads.",
          requiresValue: true,
          example: "--threads 2",
        },
        {
          flag: "--risk",
          description: "Risk level (1-3). Higher may run more intrusive tests.",
          requiresValue: true,
          example: "--risk 1",
        },
        {
          flag: "--level",
          description:
            "Level of tests to perform (1-5). Higher increases checks.",
          requiresValue: true,
          example: "--level 2",
        },
        {
          flag: "--technique",
          description:
            "Force specific techniques (B/T/U/E/S) — use conservative options.",
          requiresValue: true,
          example: "--technique BE",
        },
        {
          flag: "--dbs",
          description: "Enumerate DBMS databases (read-only).",
          requiresValue: false,
          example: "--dbs",
        },
        {
          flag: "--dump",
          description:
            "Dump DB table contents (sensitive; only use if authorized).",
          requiresValue: false,
          example: "--dump",
        },
        {
          flag: "--random-agent",
          description: "Use random User-Agent for each request.",
          requiresValue: false,
          example: "--random-agent",
        },
      ],
      notes:
        "sqlmap can be intrusive. Excluded exploit flags (e.g. --os-shell) from this list. In UI enforce low --risk/--level defaults.",
    },
    {
      name: "trivy",
      parameters: [
        {
          flag: "imageName",
          description:
            "The full name of the Docker image to scan (e.g., 'python:3.8-slim-buster').",
          requiresValue: true,
          example: "nginx:latest",
        },
        {
          flag: "--severity",
          description: "Filter by severity: CRITICAL,HIGH,MEDIUM,LOW,UNKNOWN.",
          requiresValue: true,
          example: "--severity HIGH,CRITICAL",
        },
        {
          flag: "--ignore-unfixed",
          description: "Ignore vulnerabilities that do not have a fix yet.",
          requiresValue: false,
          example: "--ignore-unfixed",
        },
        {
          flag: "--vuln-type",
          description:
            "Comma-separated list of vulnerability types to scan for (os, library).",
          requiresValue: true,
          example: "--vuln-type os,library",
        },
        {
          flag: "--timeout",
          description: "Set overall timeout for the scan (e.g., 5m, 1h).",
          requiresValue: true,
          example: "--timeout 5m",
        },
      ],
      notes:
        "Trivy scans container images for vulnerabilities. The main 'target' field is ignored; you must provide a Docker image name.",
    },
    {
      name: "lynis",
      parameters: [
        {
          flag: "--tests",
          description: "Comma-separated list of specific tests to run.",
          requiresValue: true,
          example: "--tests KRNL-5820,FILE-7524",
        },
        {
          flag: "--quick",
          description: "Run a quick scan (faster, less comprehensive).",
          requiresValue: false,
          example: "--quick",
        },
        {
          flag: "--auditor",
          description: "Set the auditor name for reports.",
          requiresValue: true,
          example: '--auditor "Automated Scan"',
        },
      ],
      notes:
        "Lynis inspects the security posture of the system it runs on (this container). The main 'target' field from your request is ignored.",
    },
    {
      name: "wpscan",
      parameters: [
        {
          flag: "--enumerate",
          description:
            "Enumeration options (u=users, p=plugins, t=themes, vp=vulnerable plugins).",
          requiresValue: true,
          example: "--enumerate u,vp",
        },
        {
          flag: "--plugins-detection",
          description: "Method to detect plugins (passive/active).",
          requiresValue: true,
          example: "--plugins-detection passive",
        },
        {
          flag: "--api-token",
          description: "WPVulnDB API token for vulnerability lookups.",
          requiresValue: true,
          example: "--api-token <your_token>",
        },
        {
          flag: "--random-agent",
          description: "Use a random User-Agent for each request.",
          requiresValue: false,
          example: "--random-agent",
        },
        {
          flag: "--threads",
          description: "Number of concurrent threads.",
          requiresValue: true,
          example: "--threads 5",
        },
      ],
      notes:
        "WPScan is a WordPress security scanner. The target must be a WordPress site.",
    },
    {
      name: "zap",
      parameters: [
        {
          flag: "targetURL",
          description:
            "The full URL to scan (e.g., http://example.com). This is required for ZAP.",
          requiresValue: true,
          example: "http://testphp.vulnweb.com",
        },
        {
          flag: "-l",
          description: "Minimum risk level to report (LOW, MEDIUM, HIGH, INFO)",
          requiresValue: true,
          example: "MEDIUM",
          valueOptions: ["INFO", "LOW", "MEDIUM", "HIGH"],
        },
      ],
      notes:
        "Runs a baseline dynamic scan. The main 'target' field is ignored; you must provide the full 'targetURL' below.",
    },
    {
      name: "semgrep",
      parameters: [
        {
          flag: "gitURL",
          description:
            "The full Git repository URL to clone and scan (e.g., https://github.com/user/repo.git). Required for Semgrep.",
          requiresValue: true,
          example: "https://github.com/juice-shop/juice-shop.git",
        },
        {
          flag: "--config",
          description:
            "Specific Semgrep rules to use (e.g., 'p/ci', 'p/owasp-top-ten'). Defaults to 'auto'.",
          requiresValue: true,
          example: "p/ci",
        },
        {
          flag: "--severity",
          description: "Only show findings of this severity or higher.",
          requiresValue: true,
          example: "ERROR",
          valueOptions: ["INFO", "WARNING", "ERROR"],
        },
        {
          flag: "--exclude",
          description: "Comma-separated paths to exclude from the scan.",
          requiresValue: true,
          example: "tests,docs",
        },
      ],
      notes:
        "Static analysis scanner. The main 'target' field is ignored; you must provide the 'gitURL' of a public repository below.",
    },
    {
      name: "trufflehog",
      notes: "Finds secrets and credentials in git repositories.",
      parameters: [
        {
          flag: "repoURL",
          description: "The URL of the Git repository to scan.",
          requiresValue: true,
          example: "https://github.com/trufflesecurity/test-repo",
        },
        {
          flag: "--only-verified",
          description: "Only show verified results.",
          requiresValue: false,
        },
        {
          flag: "--fail",
          description: "Exit with 1 if results are found.",
          requiresValue: false,
        },
      ],
    },
    {
      name: "gitleaks",
      parameters: [
        {
          flag: "repoURL",
          description: "The URL of the git repository to scan.",
          requiresValue: true,
          example: "https://github.com/gitleaks/fake-leaks",
        },
        {
          flag: "--verbose",
          description: "Show verbose output.",
          requiresValue: false,
        },
        {
          flag: "--redact",
          description: "Redact secrets from output.",
          requiresValue: false,
        },
      ],
      notes: "Specialized Git repository secrets scanner.",
    },
    {
      name: "yara",
      parameters: [
        {
          flag: "repoURL",
          description:
            "The URL of the Git repository to scan for malware patterns.",
          requiresValue: true,
          example: "https://github.com/Yara-Rules/rules",
        },
        {
          flag: "-s",
          description: "Print matching strings in the output.",
          requiresValue: false,
        },
        {
          flag: "-m",
          description: "Print metadata for matching rules.",
          requiresValue: false,
        },
        {
          flag: "-w",
          description: "Disable warnings.",
          requiresValue: false,
        },
      ],
      notes:
        "Pattern matching for malware detection and file analysis. Uses a comprehensive set of community rules.",
    },
    {
      name: "httpx",
      notes: "Fast HTTP service probing with technology detection.",
      parameters: [],
    },
  ];

  // --- NEW, MORE DETAILED DESCRIPTIONS ---
  const getToolDescription = (toolName: string) => {
    switch (toolName) {
      case "nuclei":
        return "Nuclei is a fast, template-based vulnerability scanner that sends requests across targets based on a library of YAML templates. It's used to find a wide variety of misconfigurations and known vulnerabilities (CVEs) with high speed and accuracy. You can filter by severity, tags, or even provide your own custom templates.";
      case "nikto":
        return "Nikto is a classic open-source web server scanner. It performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/programs, checks for outdated server versions, and version-specific problems. It's a great tool for finding 'low-hanging fruit' and common misconfigurations.";
      case "sqlmap":
        return "Sqlmap is the most powerful open-source tool for detecting and exploiting SQL injection flaws. It automates the entire process, from finding vulnerable parameters to fingerprinting the database, and even dumping data. Our platform restricts its most dangerous features, allowing you to safely find and confirm SQLi flaws.";
      case "trivy":
        return "Trivy is a comprehensive, simple-to-use vulnerability scanner specifically for container images. It scans for vulnerabilities in both the Operating System (OS) packages (like Alpine, RHEL, Debian) and application dependencies (like npm, pip, bundler). It's essential for securing your CI/CD pipeline and containerized environments.";
      case "lynis":
        return "Lynis is a security auditing tool for Unix-based systems. Unlike other tools that scan a target *over the network*, Lynis runs *on* the host system (in our case, the scanner container itself) to check for security misconfigurations, software hardening, and compliance. It performs an in-depth health check of the system's security posture.";
      case "wpscan":
        return "WPScan is a 'black box' WordPress security scanner. It's specifically designed to find vulnerabilities in WordPress sites. It can enumerate themes, plugins, and users, and it cross-references this information with a vulnerability database to find known security flaws in your WordPress installation.";
      case "zap":
        return "OWASP ZAP (Zed Attack Proxy) is one of the world's most popular free security tools. We use its 'baseline scan' feature, which is a fast, passive DAST (Dynamic Application Security Testing) scan. It spiders the target URL and checks for common web application vulnerabilities like missing security headers, insecure cookies, and misconfigurations.";
      case "semgrep":
        return "Semgrep is a fast, open-source static analysis (SAST) tool. It scans source code for security vulnerabilities and bugs without ever running the code. It's ideal for finding issues like hardcoded credentials, XSS, or improper input validation. You must provide a Git URL for it to scan.";
      case "trufflehog":
        return "TruffleHog is a specialized tool that scans Git repositories for secrets. It digs deep into the commit history of a repository to find high-entropy strings and patterns that match keys for services like AWS, GitHub, and more. It's highly effective at finding credentials that have been accidentally committed to code.";
      case "gitleaks":
        return "Gitleaks is another powerful secrets scanner for Git repositories. It scans the history of a repository for hardcoded API keys, passwords, and other credentials using a wide range of regular expressions and patterns. It's a critical tool for preventing secret leaks in your codebase.";
      case "yara":
        return "YARA is often called 'the pattern matching swiss-knife' for malware researchers. It scans files based on a set of rules (signatures) to identify malware or other malicious files. We use it to scan a provided Git repository against a large, community-sourced set of YARA rules to find potential threats.";
      case "httpx":
        return "HTTPX is a fast and multi-purpose HTTP toolkit. While it's also used in recon, in the vulnerability phase, it's primarily used to probe a list of web servers to confirm they are live, extract technology information, and check for common misconfigurations or takeover vulnerabilities. It's the 'glue' that verifies which targets are scannable.";
      default:
        return "A tool used for security scanning.";
    }
  };

  return (
    // Wrapper with consistent styling
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* --- NEW: Top Navigation --- */}
      <div className="mb-4 flex justify-between">
        <Link
          href="/u/docs/tools/recon"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Reconnaissance Tools
        </Link>
        <Link
          href="/u/docs/tools/exploit"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          Next: Exploitation Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {/* --- End Top Navigation --- */}

      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold">Vulnerability Assessment Tools</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A detailed reference for all available vulnerability scanning tools in
          the HorusEye platform.
        </p>
      </div>

      {/* --- NEW: Tool Index (Grid-style) --- */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Tool Index</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {vulnAssessmentTools.map((tool) => (
            <a
              key={tool.name}
              href={`#${tool.name}`}
              className="bg-muted text-primary hover:bg-muted/80 inline-block rounded-md border px-3 py-1 font-mono text-sm transition-colors"
            >
              {tool.name}
            </a>
          ))}
        </div>
      </div>
      {/* --- End Tool Index --- */}

      {/* Main content block */}
      <div className="mt-12 space-y-12">
        {vulnAssessmentTools.map((tool) => {
          // We only want to show parameters the user can actually change
          const configurableParams = tool.parameters.filter(
            (p) => (p as any).configurable !== false,
          );

          return (
            // --- Added id and scroll-m-20 for anchor linking ---
            <div key={tool.name} id={tool.name} className="scroll-m-20">
              {/* Tool Header */}
              <h2 className="font-mono text-3xl font-semibold">{tool.name}</h2>
              <p className="text-muted-foreground mt-2 leading-7">
                {getToolDescription(tool.name)}
              </p>

              {/* Default Command */}
              {tool.default_command && (
                <div className="mt-4">
                  <span className="text-sm font-semibold">
                    Default Command:
                  </span>
                  <code className="bg-muted text-muted-foreground ml-2 rounded p-1 font-mono text-sm">
                    {tool.default_command}
                  </code>
                </div>
              )}

              {/* Configurable Parameters Table */}
              {configurableParams.length > 0 ? (
                <>
                  <h3 className="mt-6 text-xl font-semibold">
                    Configurable Parameters
                  </h3>
                  <div className="mt-4 rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Flag</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Example</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {configurableParams.map((param) => (
                          <TableRow key={param.flag}>
                            <TableCell>
                              <code className="font-mono">{param.flag}</code>
                              {/* Add a badge if it's just a flag (no value) */}
                              {!param.requiresValue && (
                                <Badge variant="outline" className="ml-2">
                                  Flag
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{param.description}</TableCell>
                            <TableCell>
                              <code className="text-muted-foreground font-mono text-xs">
                                {param.example}
                              </code>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground mt-4 text-sm">
                  This tool runs with a pre-defined configuration and has no
                  user-adjustable parameters.
                </p>
              )}

              {/* Notes Alert */}
              {tool.notes && (
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>{tool.notes}</AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </div>

      {/* --- NEW: Page Navigation --- */}
      <DocsNavigation
        prev={{
          title: "Reconnaissance Tools",
          href: "/u/docs/tools/recon",
        }}
        next={{
          title: "Exploitation Tools",
          href: "/u/docs/tools/exploit",
        }}
      />
    </div>
  );
}

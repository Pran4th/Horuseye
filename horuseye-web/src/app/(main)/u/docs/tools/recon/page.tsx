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
import { Info, ArrowLeft, ArrowRight } from "lucide-react"; // Import new icons

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

export default function ExploreReconTools() {
  // This is the JSON data you provided for recon tools
  const reconTools = [
    {
      name: "nmap",
      default_command: "nmap -sV -O",
      parameters: [
        {
          flag: "<target>",
          description: "Target host/IP/CIDR (positional).",
          requiresValue: true,
          example: "<target>",
          configurable: false,
        },
        {
          flag: "-sS",
          description: "SYN stealth TCP scan (fast and common).",
          requiresValue: false,
          example: "-sS",
        },
        // ... (other nmap params) ...
        {
          flag: "-p",
          description: "Port(s) to scan; single, range or comma list.",
          requiresValue: true,
          example: "-p 22,80,443 or -p 1-65535",
        },
        {
          flag: "-p-",
          description: "Scan all TCP ports (1-65535).",
          requiresValue: false,
          example: "-p-",
        },
        {
          flag: "-A",
          description:
            "Aggressive: OS/version/script/traceroute (noisy; use with caution).",
          requiresValue: false,
          example: "-A",
        },
        {
          flag: "-Pn",
          description: "Skip host discovery (treat host(s) as up).",
          requiresValue: false,
          example: "-Pn",
        },
        {
          flag: "-T",
          description: "Timing template 0 (paranoid) to 5 (insane).",
          requiresValue: true,
          example: "-T4",
        },
        {
          flag: "-oA",
          description: "Output in all formats using base name.",
          requiresValue: true,
          example: "-oA scan_base",
          configurable: false,
        },
        {
          flag: "--script",
          description:
            "Run NSE scripts (restrict to safe categories like 'default','discovery').",
          requiresValue: true,
          example: "--script=default",
          configurable: false,
        },
        {
          flag: "-6",
          description: "Enable IPv6 scanning.",
          requiresValue: false,
          example: "-6",
        },
      ],
    },
    {
      name: "masscan",
      default_command: "masscan -p1-65535 --rate 1000",
      parameters: [
        {
          flag: "<target>",
          description: "Target IP/CIDR/file (positional).",
          requiresValue: true,
          example: "<target>",
          configurable: false,
        },
        {
          flag: "-p",
          description: "Port(s) to scan (single, range, list).",
          requiresValue: true,
          example: "-p 80,443 or -p 1-1024",
        },
        {
          flag: "--rate",
          description: "Packets per second; keep conservative (e.g. 100–1000).",
          requiresValue: true,
          example: "--rate 1000",
        },
        {
          flag: "-oJ",
          description: "Output JSON to file.",
          requiresValue: true,
          example: "-oJ masscan.json",
          configurable: false,
        },
        {
          flag: "--wait",
          description: "Wait seconds to flush results after finishing.",
          requiresValue: true,
          example: "--wait 5",
        },
        {
          flag: "--exclude",
          description: "Exclude a target/CIDR from scan.",
          requiresValue: true,
          example: "--exclude 203.0.113.0/24",
        },
      ],
      notes:
        "masscan is extremely fast and can overload networks; enforce conservative --rate values.",
    },
    {
      name: "amass",
      default_command: "amass enum",
      parameters: [
        {
          flag: "-d",
          description: "Domain to enumerate.",
          requiresValue: true,
          example: "-d <domain>",
          configurable: false,
        },
        {
          flag: "enum",
          description: "Enumeration mode (discover subdomains).",
          requiresValue: false,
          example: "enum",
        },
        {
          flag: "-src",
          description: "Show data source for each finding.",
          requiresValue: false,
          example: "-src",
        },
        {
          flag: "-oA",
          description: "Write output in multiple formats with base name.",
          requiresValue: true,
          example: "-oA amass_all",
          configurable: false,
        },
        {
          flag: "-ip",
          description: "Show resolved IP addresses alongside names.",
          requiresValue: false,
          example: "-ip",
        },
        {
          flag: "-active",
          description:
            "Active scraping (DNS brute/zone transfer) — noisy; use in-scope only.",
          requiresValue: false,
          example: "-active",
        },
        {
          flag: "-brute",
          description: "Enable brute force subdomain generation (noisy).",
          requiresValue: false,
          example: "-brute",
        },
        {
          flag: "-passive",
          description: "Only passive sources (quiet).",
          requiresValue: false,
          example: "-passive",
        },
      ],
      notes: "Prefer passive mode initially; active modes can be noisy.",
    },
    {
      name: "subfinder",
      default_command: "subfinder",
      parameters: [
        {
          flag: "-d",
          description: "Domain to enumerate.",
          requiresValue: true,
          example: "-d <domain>",
          configurable: false,
        },
        {
          flag: "-oJ",
          description: "Write results in JSON format.",
          requiresValue: true,
          example: "-oJ subfinder-out.json",
          configurable: false,
        },
        {
          flag: "-silent",
          description: "Minimal verbosity.",
          requiresValue: false,
          example: "-silent",
        },
        {
          flag: "-all",
          description: "Use all configured sources (may require API keys).",
          requiresValue: false,
          example: "-all",
        },
        {
          flag: "-rate",
          description: "Concurrent request rate (be conservative).",
          requiresValue: true,
          example: "-rate 50",
        },
      ],
    },
    {
      name: "theHarvester",
      default_command: "theHarvester",
      parameters: [
        {
          flag: "-d",
          description: "Domain to search.",
          requiresValue: true,
          example: "-d <domain>",
          configurable: false,
        },
        {
          flag: "-b",
          description: "Data source (google, bing, crtsh, all, etc.).",
          requiresValue: true,
          example: "-b all",
        },
        {
          flag: "-l",
          description: "Limit results per source.",
          requiresValue: true,
          example: "-l 200",
        },
        {
          flag: "-f",
          description: "Output file (HTML/CSV).",
          requiresValue: true,
          example: "-f theharvester-out.html",
          configurable: false,
        },
      ],
      notes: "Uses public sources; rate limits may apply.",
    },
    {
      name: "recon_ng",
      default_command: "recon-ng --workspace <workspace> -r <script>",
      parameters: [
        {
          flag: "--workspace",
          description:
            "Specify a custom workspace name. If omitted, one will be generated automatically.",
          requiresValue: true,
          example: "--workspace my_target",
        },
      ],
      notes:
        "This tool runs a predefined, safe workflow including module 'recon/domains-hosts/hackertarget' and generates an HTML report.",
    },
    {
      name: "gobuster",
      default_command:
        "gobuster dir -w /path/wordlist.txt -t 50 -x php,html,txt",
      parameters: [
        {
          flag: "mode",
          description: "Mode: dir, dns, or vhost.",
          requiresValue: true,
          example: "dir",
        },
        {
          flag: "-u",
          description: "Target URL (for dir/vhost modes).",
          requiresValue: true,
          example: "-u <target_url>",
        },
        {
          flag: "-w",
          description: "Use the default web content wordlist.",
          requiresValue: false,
          example: "-w",
        },
        {
          flag: "-x",
          description: "Extensions to append (comma-separated).",
          requiresValue: true,
          example: "-x php,html,txt",
        },
        {
          flag: "-t",
          description: "Concurrent threads (keep conservative).",
          requiresValue: true,
          example: "-t 50",
        },
        {
          flag: "-o",
          description: "Output file.",
          requiresValue: true,
          example: "-o gobuster-out.txt",
          configurable: false,
        },
      ],
      notes:
        "Wordlist-driven scans can be heavy; enforce limits and sane defaults.",
    },
    {
      name: "dirsearch",
      default_command:
        "python3 dirsearch/dirsearch.py -e php,html,txt -w /path/wordlist.txt",
      parameters: [
        {
          flag: "-u",
          description: "Target base URL.",
          requiresValue: true,
          example: "-u <target_url>",
        },
        {
          flag: "-w",
          description: "Use the default web directory wordlist.",
          requiresValue: false,
          example: "-w",
        },
        {
          flag: "-e",
          description: "Extensions to search (comma list).",
          requiresValue: true,
          example: "-e php,html,txt",
        },
        {
          flag: "-t",
          description: "Number of threads (conservative).",
          requiresValue: true,
          example: "-t 20",
        },
        {
          flag: "-o",
          description: "Output file.",
          requiresValue: true,
          example: "-o dirsearch-out.txt",
          configurable: false,
        },
      ],
      notes: "Offers HTTP options; use conservative threads and timeouts.",
    },
    {
      name: "whatweb",
      default_command: "whatweb",
      parameters: [
        {
          flag: "<target>",
          description: "Target URL or host.",
          requiresValue: true,
          example: "<target>",
        },
        {
          flag: "--log-brief",
          description: "Write brief log to file.",
          requiresValue: true,
          example: "--log-brief whatweb-out.txt",
          configurable: false,
        },
        {
          flag: "-v",
          description: "Verbose output.",
          requiresValue: false,
          example: "-v",
        },
        {
          flag: "-a",
          description: "Aggressiveness 0-3 (higher is noisier).",
          requiresValue: true,
          example: "-a 2",
        },
      ],
      notes: "Adjust -a for quieter fingerprinting.",
    },
    {
      name: "dnsenum",
      default_command: "dnsenum",
      parameters: [
        {
          flag: "--enum",
          description:
            "Full enumeration (whois, NS, MX, zone transfer attempts).",
          requiresValue: false,
          example: "--enum",
        },
        {
          flag: "--threads",
          description: "Number of threads.",
          requiresValue: true,
          example: "--threads 5",
        },
        {
          flag: "--file",
          description: "Use default wordlist for brute-forcing.",
          requiresValue: false,
          example: "--file",
        },
        {
          flag: "-o",
          description: "Output file name.",
          requiresValue: true,
          example: "-o dnsenum-out.txt",
          configurable: false,
        },
      ],
      notes:
        "Zone transfer (AXFR) attempts may reveal whole DNS zones; treat any successful result as sensitive.",
    },
  ];

  // --- NEW, MORE DETAILED DESCRIPTIONS ---
  const getToolDescription = (toolName: string) => {
    switch (toolName) {
      case "nmap":
        return "Nmap (Network Mapper) is the industry-standard tool for network exploration and security auditing. It's used to discover hosts and services on a network by sending packets and analyzing the responses. You'd use it to find open ports, identify what services are running (and their versions), and detect the operating system of a target.";
      case "masscan":
        return "Masscan is an incredibly fast, asynchronous TCP port scanner. Unlike Nmap, its primary purpose is speed, and it's capable of scanning the entire internet in minutes. You'd use this for an initial, broad sweep to quickly find open ports before running a more in-depth Nmap scan on the discovered hosts.";
      case "amass":
        return "The OWASP AMASS project is a powerful tool for in-depth asset discovery and network mapping. It goes beyond basic subdomain enumeration by using a wide range of OSINT (Open Source Intelligence) techniques and active reconnaissance to build a comprehensive map of a target's external attack surface.";
      case "subfinder":
        return "Subfinder is a high-performance passive subdomain discovery tool. It queries dozens of public data sources (like search engines, certificate transparency logs, etc.) to find valid subdomains for a given domain. It's 'passive,' meaning it never directly connects to the target, making it a safe and stealthy first step.";
      case "theHarvester":
        return "theHarvester is a classic OSINT tool. It gathers publicly available information such as email addresses, subdomains, hosts, and employee names from various public sources like search engines (Google, Bing) and public registries (crt.sh). This information is crucial for building a target profile.";
      case "recon_ng":
        return "Recon-ng is a full-featured web reconnaissance framework with a modular, Metasploit-like interface. In our platform, we use it to run a predefined, safe workflow (like the 'hackertarget' module) to automatically gather host information and generate a report, streamlining the OSINT process.";
      case "gobuster":
        return "Gobuster is a high-speed, Go-based tool used for brute-forcing. Its primary modes are finding hidden directories and files on a web server (`dir` mode) and discovering subdomains (`dns` mode). You use it to find unlinked or 'hidden' content that might contain sensitive information or admin panels.";
      case "dirsearch":
        return "Dirsearch is another popular tool for brute-forcing web server directories and files. It's known for its extensive, pre-built wordlists and its ability to handle different extensions, HTTP methods, and recursion. It's a great alternative or addition to Gobuster for comprehensive content discovery.";
      case "whatweb":
        return "WhatWeb identifies the technologies a website is built with. It can detect Content Management Systems (e.g., WordPress), JavaScript libraries (e.g., React), and server software (e.g., Nginx). This is vital for 'fingerprinting' a target to find technology-specific vulnerabilities.";
      case "dnsenum":
        return "Dnsenum is a classic Perl script for enumerating DNS information. It's used to find host records (A, MX, NS), and it can attempt more aggressive techniques like DNS zone transfers (AXFR). A successful zone transfer can reveal a target's entire internal network structure.";
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
          href="/u/docs/quick-start"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quick Start
        </Link>
        <Link
          href="/u/docs/tools/vulnr"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm transition-colors"
        >
          Next: Vulnerability Tools
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {/* --- End Top Navigation --- */}

      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold">Reconnaissance Tools</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A detailed reference for all available reconnaissance tools in the
          HorusEye platform.
        </p>
      </div>

      {/* --- Tool Index --- */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Tool Index</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {reconTools.map((tool) => (
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
        {reconTools.map((tool) => {
          // We only want to show parameters the user can actually change
          const configurableParams = tool.parameters.filter(
            (p) => p.configurable !== false,
          );

          return (
            // --- NEW: Added id and scroll-m-20 for anchor linking ---
            <div key={tool.name} id={tool.name} className="scroll-m-20">
              {/* Tool Header */}
              <h2 className="font-mono text-3xl font-semibold">{tool.name}</h2>
              <p className="text-muted-foreground mt-2 leading-7">
                {getToolDescription(tool.name)}
              </p>

              {/* Default Command */}
              <div className="mt-4">
                <span className="text-sm font-semibold">Default Command:</span>
                <code className="bg-muted text-muted-foreground ml-2 rounded p-1 font-mono text-sm">
                  {tool.default_command}
                </code>
              </div>

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
        prev={{ title: "Quick Start", href: "/u/docs/quick-start" }}
        next={{
          title: "Vulnerability Tools",
          href: "/u/docs/tools/vulnr",
        }}
      />
    </div>
  );
}

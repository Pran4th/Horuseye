"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Target,
  Clock,
  Gauge,
  Calendar,
  AlertTriangle,
  Loader2,
  FileText,
  Search,
  ShieldAlert,
  Bolt,
  CheckCircle2,
  XCircle,
} from "lucide-react";
// Import your store
import { useScanResultsStore } from "@/stores/useScanResultsStore";

// --- Types ---
// (You would typically have these in a central types file)
type Scan = {
  id: string;
  name: string;
  target: string;
  status: string;
  createdAt: string;
  configuration: ScanConfiguration;
  toolExecutions: ToolExecution[];
};

type ScanConfiguration = {
  id: string;
  data: {
    roe: { rulesOfEngagementStatement: string };
    recon: { reconTools: ToolConfig[] };
    vulnr: { vulnrTools: ToolConfig[] };
    exploit: { exploitTools: ToolConfig[]; attemptExploitation: boolean };
    basicDetails: BasicDetails;
  };
  createdAt: number;
};

type ToolConfig = {
  name: string;
  enabled: boolean;
  parameters: Record<string, string>;
  generated_command: string | null;
};

type BasicDetails = {
  scanName: string;
  targetType: string;
  description: string;
  maxDuration: string;
  targetValue: string;
  scanSchedule: string;
  scanIntensity: string;
  generateReport: boolean;
  saveConfiguration: boolean;
  notifyOnCompletion: boolean;
};

type ToolExecution = {
  toolName: string;
  status: string;
  parameters: { flag: string; value: string }[];
  startTime: string;
  endTime: string;
};

/**
 * Helper function to get a color-coded badge based on scan status.
 */
const getStatusBadge = (status: string) => {
  let formattedStatus = "Unknown";
  let variant: "default" | "secondary" | "destructive" | "outline" =
    "secondary";
  let showPulse = false;

  switch (status) {
    case "recon_complete":
      formattedStatus = "Recon Scan Complete";
      variant = "secondary";
      break;
    case "vuln_report_complete":
      formattedStatus = "Complete";
      variant = "default";
      break;
    case "vuln_complete":
      formattedStatus = "Vuln Scan Complete";
      variant = "secondary";
      break;
    case "recon_report_complete":
      formattedStatus = "Recon Report Complete";
      variant = "secondary";
      break;
    case "vuln_running":
      formattedStatus = "Scanning (Vuln)";
      variant = "outline";
      showPulse = true;
      break;
    case "recon_running":
      formattedStatus = "Scanning (Recon)";
      variant = "outline";
      showPulse = true;
      break;
    case "submitted":
      formattedStatus = "Submitted";
      variant = "secondary";
      showPulse = true;
      break;
    case "pending":
      formattedStatus = "Pending";
      variant = "secondary";
      break;
    case "failed":
      formattedStatus = "Failed";
      variant = "destructive";
      break;
    default:
      formattedStatus = status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      variant = "secondary";
  }

  return (
    <Badge variant={variant} className="flex items-center gap-1.5">
      {showPulse && (
        <span className="relative flex h-2 w-2">
          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
        </span>
      )}
      {formattedStatus}
    </Badge>
  );
};

// --- The Page Component ---
export default function ScanOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // --- Use state from your Zustand store ---
  const {
    currentScanDetails,
    isLoading,
    error,
    fetchScanDetails,
    clearCurrentScanDetails,
  } = useScanResultsStore();

  useEffect(() => {
    if (id) {
      console.log(`Fetching details for scan: ${id}`);
      fetchScanDetails(id as string);
    }

    // Clear the details when the component unmounts
    return () => {
      clearCurrentScanDetails();
    };
  }, [id, fetchScanDetails, clearCurrentScanDetails]);

  // --- Render Functions ---

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error || !currentScanDetails) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Scan</AlertTitle>
          <AlertDescription>
            {error || "Scan data could not be found."}
          </AlertDescription>
        </Alert>
        {/* Updated router path to reflect your project structure */}
        <Button
          variant="outline"
          onClick={() => router.push("/u/scans/overview")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Scans
        </Button>
      </div>
    );
  }

  // Helper to format timestamps correctly (as UTC)
  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return "N/A";
    // Ensure we append 'Z' only when it's not already present
    const iso = ts.endsWith("Z") ? ts : ts + "Z";
    return formatInTimeZone(
      new Date(iso),
      "Asia/Kolkata",
      "dd/MM/yyyy, h:mm:ss a",
    );
  };

  // --- Filter out unwanted tools ---
  const filteredExecutions = currentScanDetails.toolExecutions.filter(
    (tool) =>
      tool.toolName !== "llm-recon-report" &&
      tool.toolName !== "llm-vuln-report" &&
      tool.toolName !== "llm-vulnr-report",
  );

  const filteredReconTools =
    currentScanDetails.configuration.data.recon.reconTools.filter(
      (tool: any) =>
        tool.name !== "llm-recon-report" &&
        tool.name !== "llm-vuln-report" &&
        tool.name !== "llm-vulnr-report",
    );

  const filteredVulnrTools =
    currentScanDetails.configuration.data.vulnr.vulnrTools.filter(
      (tool: any) =>
        tool.name !== "llm-recon-report" && tool.name !== "llm-vuln-report",
    );

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => router.push("/u/scans/overview")} // Updated path
            className="text-muted-foreground mb-2 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Scans
          </Button>
          <h1 className="text-4xl font-bold">{currentScanDetails.name}</h1>
          {currentScanDetails.configuration.data.basicDetails.description && (
            <p className="text-muted-foreground mt-2 text-lg">
              {currentScanDetails.configuration.data.basicDetails.description}
            </p>
          )}
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() =>
            router.push(`/u/files/report/${currentScanDetails.id}`)
          } // Placeholder for report page
        >
          <FileText className="mr-2 h-4 w-4" />
          View Full Report
        </Button>
      </div>

      {/* --- Overview Card --- */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scan Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <Target className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-muted-foreground text-sm">Target</p>
              <p className="font-mono text-lg font-medium">
                {currentScanDetails.target}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <div className="text-lg font-medium">
                {getStatusBadge(currentScanDetails.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-muted-foreground text-sm">Created</p>
              <p className="text-lg font-medium">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {formatDistanceToNow(
                        new Date(currentScanDetails.createdAt + "Z"),
                        {
                          addSuffix: true,
                        },
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {formatTimestamp(currentScanDetails.createdAt)}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Gauge className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-muted-foreground text-sm">Intensity</p>
              <p className="text-lg font-medium capitalize">
                {
                  currentScanDetails.configuration.data.basicDetails
                    .scanIntensity
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Main Content Tabs --- */}
      <Tabs defaultValue="execution" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="execution">Execution Timeline</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        {/* --- Execution Timeline Tab --- */}
        <TabsContent value="execution">
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
              <CardDescription>
                A detailed log of each tool that was executed during this scan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time (IST)</TableHead>
                    <TableHead>End Time (IST)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions && filteredExecutions.length > 0 ? (
                    filteredExecutions.map((tool) => (
                      <TableRow key={tool.toolName}>
                        <TableCell className="font-mono font-medium">
                          {tool.toolName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tool.status === "completed"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {tool.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTimestamp(tool.startTime)}</TableCell>
                        <TableCell>{formatTimestamp(tool.endTime)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No tool execution data available for this scan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Configuration Tab --- */}
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
              <CardDescription>
                The exact settings this scan was launched with.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* --- Basic Details Card --- */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-semibold">Basic Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Scan Name</p>
                    <p className="font-medium">
                      {
                        currentScanDetails.configuration.data.basicDetails
                          .scanName
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-mono font-medium">
                      {
                        currentScanDetails.configuration.data.basicDetails
                          .targetValue
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Schedule</p>
                    <p className="font-medium capitalize">
                      {
                        currentScanDetails.configuration.data.basicDetails
                          .scanSchedule
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Duration</p>
                    <p className="font-medium">
                      {
                        currentScanDetails.configuration.data.basicDetails
                          .maxDuration
                      }{" "}
                      minutes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentScanDetails.configuration.data.basicDetails
                      .generateReport ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="text-muted-foreground h-4 w-4" />
                    )}
                    <p>Generate Report</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentScanDetails.configuration.data.basicDetails
                      .notifyOnCompletion ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="text-muted-foreground h-4 w-4" />
                    )}
                    <p>Notify on Completion</p>
                  </div>
                </div>
              </div>

              {/* --- Tool Config Cards --- */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Search className="h-5 w-5" />
                    <CardTitle>Reconnaissance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5">
                      {filteredReconTools.length > 0 ? (
                        filteredReconTools.map((tool: any) => (
                          <li key={tool.name} className="font-mono">
                            {tool.name}
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No recon tools were configured.
                        </p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <ShieldAlert className="h-5 w-5" />
                    <CardTitle>Vulnerability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5">
                      {filteredVulnrTools.length > 0 ? (
                        filteredVulnrTools.map((tool: any) => (
                          <li key={tool.name} className="font-mono">
                            {tool.name}
                          </li>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No vulnerability tools were configured.
                        </p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0">
                    <Bolt className="h-5 w-5" />
                    <CardTitle>Exploitation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {currentScanDetails.configuration.data.exploit
                        .attemptExploitation ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="text-muted-foreground h-4 w-4" />
                      )}
                      <p>Attempt Exploitation</p>
                    </div>
                    {currentScanDetails.configuration.data.exploit
                      .attemptExploitation && (
                      <ul className="list-disc space-y-1 pl-5">
                        {currentScanDetails.configuration.data.exploit
                          .exploitTools.length > 0 ? (
                          currentScanDetails.configuration.data.exploit.exploitTools.map(
                            (tool: any) => (
                              <li key={tool.name} className="font-mono">
                                {tool.name}
                              </li>
                            ),
                          )
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            No exploit tools were configured.
                          </p>
                        )}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

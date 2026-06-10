"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScanResultsStore } from "@/stores/useScanResultsStore"; // Adjust path as needed
import { type ScanBasicResponse } from "@/lib/scan-api"; // Adjust path as needed
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

// --- Shadcn/ui Components ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Icons ---
import {
  // RefreshCw, // Removed
  Plus,
  AlertTriangle,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";

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
export default function ScansPage() {
  const router = useRouter();
  const {
    scans,
    isLoading,
    // isRefreshing, // Removed
    error,
    fetchScans,
    // refreshScanStatus, // Removed
  } = useScanResultsStore();

  // Local state to track which specific scan is being refreshed - Removed
  // const [refreshingId, setRefreshingId] = useState<string | null>(null);

  // Fetch scans when the component mounts
  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  // Handle clicking the "New Scan" button
  const handleNewScan = () => {
    const id = uuidv4();

    if (typeof window !== "undefined") {
      // Clear any old, incomplete scan data from local storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scan-")) {
          localStorage.removeItem(key);
        }
      });

      // Create a new empty scan object
      const newScan = {
        id,
        createdAt: Date.now(),
        data: {},
      };
      localStorage.setItem(`scan-${id}`, JSON.stringify(newScan));
    }

    // Redirect to the new scan wizard
    router.push(`/u/new-scan/${id}`);
  };

  // Handle clicking a scan row to view its details
  const handleRowClick = (scanId: string) => {
    // Navigate to the dynamic detail page for this scan
    router.push(`/u/files/report/${scanId}`);
  };

  // Handle clicking the refresh button on a single scan - Removed
  // const handleRefreshClick = ...

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Scan Files & Reports</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            View, manage, and track your security scans.
          </p>
        </div>
        <Button onClick={handleNewScan} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {/* --- Error Display --- */}
      {error && !isLoading && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* --- Scans Table --- */}
      <Card className="!rounded-sm !py-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-3">Scan Name</TableHead>
                <TableHead className="p-3">Status</TableHead>
                <TableHead className="p-3">Files</TableHead>
                <TableHead className="p-3">Created</TableHead>
                <TableHead className="p-3 text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && scans.length === 0 ? (
                // --- Loading State ---
                <TableRow>
                  <TableCell colSpan={5} className="h-48 p-3 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !isLoading && scans.length === 0 ? (
                // --- Empty State ---
                <TableRow>
                  <TableCell colSpan={5} className="h-48 p-3 text-center">
                    <h3 className="text-lg font-semibold">No scans found</h3>
                    <p className="text-muted-foreground text-sm">
                      Create your first scan to get started.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                // --- Data State ---
                scans.map((scan: ScanBasicResponse) => (
                  <TableRow
                    key={scan.id}
                    onClick={() => handleRowClick(scan.id)}
                    className="group cursor-pointer"
                  >
                    <TableCell className="p-3 font-medium">
                      {scan.name}
                    </TableCell>
                    <TableCell className="p-3">
                      {getStatusBadge(scan.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground p-3">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {scan.reportCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground p-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {formatDistanceToNow(
                              new Date(scan.createdAt + "Z"), // Add 'Z' to ensure UTC parsing
                              {
                                addSuffix: true,
                              },
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {formatInTimeZone(
                                new Date(scan.createdAt + "Z"), // Add 'Z' to ensure UTC parsing
                                "Asia/Kolkata",
                                "dd/MM/yyyy, h:mm:ss a",
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Refresh Button Removed */}
                        <ChevronRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScanResultsStore } from "@/stores/useScanResultsStore";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns"; // For relative time
import { formatInTimeZone } from "date-fns-tz"; // Import for timezone conversion

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
  RefreshCw,
  Plus,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from "lucide-react";

// --- Types ---
type Scan = {
  id: string;
  name: string;
  target: string;
  status: string;
  createdAt: string;
};

/**
 * Helper function to get a color-coded badge based on scan status.
 * You can customize this to match all your possible statuses.
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
      // A simple formatter for other cases
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

const ScansPage = () => {
  const router = useRouter();
  const {
    scans,
    isLoading,
    isRefreshing,
    error,
    fetchScans,
    refreshScanStatus,
  } = useScanResultsStore();

  // Local state to track which specific scan is being refreshed
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  // Fetch all scans on initial page load
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
    // You can change this path to match your app's routing
    router.push(`/u/scans/overview/${scanId}`);
  };

  // Handle clicking the refresh button on a single scan
  const handleRefreshClick = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation(); // VERY IMPORTANT: Prevents the row's onClick from firing
    setRefreshingId(scanId); // Show animation on this specific button
    try {
      await refreshScanStatus(scanId);
    } catch (err) {
      console.error("Failed to refresh scan:", err);
      // Error is already handled globally in the store
    } finally {
      setTimeout(() => setRefreshingId(null), 500); // Stop animation after a short delay
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
      {/* --- Header --- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Scans</h1>
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
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // --- Loading State ---
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : scans.length === 0 ? (
                // --- Empty State ---
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <h3 className="text-lg font-semibold">No scans found</h3>
                    <p className="text-muted-foreground text-sm">
                      Create your first scan to get started.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                // --- Data State ---
                scans.map((scan: Scan) => (
                  <TableRow
                    key={scan.id}
                    onClick={() => handleRowClick(scan.id)}
                    className="group cursor-pointer"
                  >
                    <TableCell className="font-medium">{scan.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono">
                      {scan.target}
                    </TableCell>
                    <TableCell>{getStatusBadge(scan.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {/* --- MODIFIED LINE: Added 'Z' --- */}
                            {formatDistanceToNow(
                              new Date(scan.createdAt + "Z"),
                              {
                                addSuffix: true,
                              },
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {/* --- MODIFIED LINE: Added 'Z' --- */}
                              {formatInTimeZone(
                                new Date(scan.createdAt + "Z"),
                                "Asia/Kolkata",
                                "dd/MM/yyyy, h:mm:ss a zzz",
                              )}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={(e) => handleRefreshClick(e, scan.id)}
                          disabled={isRefreshing}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <RefreshCw
                            className={`text-muted-foreground h-4 w-4 ${
                              isRefreshing && refreshingId === scan.id
                                ? "animate-spin"
                                : ""
                            }`}
                          />
                          <span className="sr-only">Refresh status</span>
                        </Button>
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
};

export default ScansPage;

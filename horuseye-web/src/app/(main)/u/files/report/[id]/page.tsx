"use client";

import React, { useEffect, useMemo, useState, use } from "react"; // ✅ note the new `use`
import { useParams, useRouter } from "next/navigation";
import { useScanResultsStore } from "@/stores/useScanResultsStore"; // Adjust path as needed
import { type ScanFileResponse, type ScanBasicResponse } from "@/lib/scan-api"; // Adjust path as needed
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
  ArrowLeft,
  Target,
  Calendar,
  AlertTriangle,
  Loader2,
  FileText,
  Download,
} from "lucide-react";

/**
 * Helper function to get a color-coded badge based on scan status.
 * (Copied from scans-page.tsx for consistency)
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

/**
 * Helper to format timestamps (assuming UTC input)
 */
const formatTimestamp = (ts: string) => {
  if (!ts) return "N/A";
  const iso = ts.endsWith("Z") ? ts : ts + "Z";
  return formatInTimeZone(
    new Date(iso),
    "Asia/Kolkata",
    "dd/MM/yyyy, h:mm:ss a",
  );
};

/**
 * A sub-component to render a single file row
 * This handles its own download state.
 */
const FileRow = ({ file }: { file: ScanFileResponse }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Get the download function directly from the store's static state
  const { generateDownloadUrl } = useScanResultsStore.getState();

  const handleDownloadClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setIsDownloading(true);
    setDownloadError(null);
    try {
      // Call the API function from the store
      const url = await generateDownloadUrl(file.id);
      console.log("Generated presigned URL:", url);
      // Open the URL in a new tab to start the download
      window.open(url, "_blank");
    } catch (err) {
      setDownloadError((err as Error).message || "Failed to get URL");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="p-3 font-medium">
        <span className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-4 w-4" />
          {file.fileName}
        </span>
      </TableCell>
      <TableCell className="p-3 text-right">
        <Button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          variant="outline"
          size="sm"
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isDownloading ? "Generating..." : "Download"}
        </Button>
        {downloadError && (
          <p className="text-destructive mt-1 text-xs">{downloadError}</p>
        )}
      </TableCell>
    </TableRow>
  );
};

/**
 * The main scan detail page component
 */
type ScanDetailPageProps = { params: { id?: string } };
export default function ScanDetailPage({ params }: ScanDetailPageProps) {
  const { id: scanId } = params;
  const router = useRouter();

  const {
    currentScanDetails,
    currentScanFiles,
    isLoading: isLoadingDetails, // Renamed for clarity
    isLoadingFiles,
    error: detailError, // Renamed for clarity
    fileError,
    fetchScanDetails,
    fetchScanFiles,
  } = useScanResultsStore();

  useEffect(() => {
    if (scanId) {
      fetchScanDetails(scanId as string);
      fetchScanFiles(scanId as string); // This triggers the backend caching
    }
  }, [scanId, fetchScanDetails, fetchScanFiles]);

  // Helper function to render the main scan details
  const renderDetails = () => {
    if (isLoadingDetails) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <div className="bg-muted h-8 w-3/4 animate-pulse rounded"></div>
            <div className="bg-muted mt-2 h-4 w-1/2 animate-pulse rounded"></div>
          </CardHeader>
        </Card>
      );
    }

    if (detailError)
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Details</AlertTitle>
          <AlertDescription>{detailError}</AlertDescription>
        </Alert>
      );

    if (!currentScanDetails) return <p>No scan details found.</p>;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{currentScanDetails.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <div className="text-lg font-medium">
                {getStatusBadge(currentScanDetails.status)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Helper function to render the list of files
  const renderFiles = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Files</CardTitle>
          <CardDescription>
            Download reports and raw output files generated by the scan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-3">File Name</TableHead>
                <TableHead className="p-3 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingFiles ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 p-3 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : fileError ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 p-3 text-center">
                    <p className="text-destructive">
                      Error loading files: {fileError}
                    </p>
                  </TableCell>
                </TableRow>
              ) : currentScanFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 p-3 text-center">
                    <p className="text-muted-foreground">
                      No files found for this scan.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                currentScanFiles.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/u/files")} // Make sure this route is correct
        className="text-muted-foreground mb-4 -ml-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Scans
      </Button>
      <h1 className="mb-6 text-4xl font-bold">Scan Report Details</h1>
      {renderDetails()}
      {renderFiles()}
    </div>
  );
}

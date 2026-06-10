import { useScanStore } from "@/stores/useScanStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Target,
  Clock,
  Gauge,
  FileText,
} from "lucide-react";
import { authenticatedFetch } from "@/lib/api-client";
import { useState } from "react";

const FinalScanPreview = ({
  onClickNext,
  onClickBack,
}: {
  onClickNext: () => void;
  onClickBack: () => void;
}) => {
  const { currentScan } = useScanStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(
    "Current Scan in Final Preview:",
    JSON.stringify(currentScan, null, 2),
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Submitting scan to backend...");
    setError(null);
    setIsLoading(true);

    try {
      // Use authenticatedFetch - it handles the token and base URL
      const result = await authenticatedFetch(
        "/api/v1/scan/start", // Relative path
        {
          method: "POST",
          // No need for Content-Type or Authorization headers here
          body: JSON.stringify(currentScan),
        },
      );

      console.log("Scan submitted successfully:", result);
      onClickNext();
    } catch (err) {
      console.error("Failed to submit scan:", err);
      // authenticatedFetch throws an error with the message already
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentScan?.data?.basicDetails) {
    return (
      <div className="w-4xl max-w-5xl p-6">
        <div>
          <h2 className="text-4xl font-bold">Final Preview</h2>
          <p className="text-muted-foreground mt-2">
            Please review your selected tools and configurations carefully
            before proceeding. Any unauthorized or malicious attempts may result
            in{" "}
            <span className="text-destructive">
              legal consequences or blacklisting.{" "}
            </span>
            Additionally,{" "}
            <span className="text-destructive">
              improper or weak configurations
            </span>{" "}
            can lead to{" "}
            <span className="text-destructive">inaccurate scan results.</span>{" "}
            Ensure everything is set correctly to avoid potential issues.
          </p>
          <form
            className="mt-12 space-y-6"
            id="final-preview"
            onSubmit={handleSubmit}
          >
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No scan configuration found
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const { basicDetails, roe, recon, vulnr, exploit } = currentScan.data;

  return (
    <div className="w-4xl max-w-5xl p-6">
      <div>
        <h2 className="text-4xl font-bold">Final Preview</h2>
        <p className="text-muted-foreground mt-2">
          Please review your selected tools and configurations carefully before
          proceeding. Any unauthorized or malicious attempts may result in{" "}
          <span className="text-destructive">
            legal consequences or blacklisting.{" "}
          </span>
          Additionally,{" "}
          <span className="text-destructive">
            improper or weak configurations
          </span>{" "}
          can lead to{" "}
          <span className="text-destructive">inaccurate scan results.</span>{" "}
          Ensure everything is set correctly to avoid potential issues.
        </p>
        <Separator className="my-6" />
        <div className="space-y-6">
          <div>
            <div>
              <h2 className="text-2xl font-bold dark:text-zinc-300">
                Scan Configuration
              </h2>
            </div>
            <div className="mt-2 space-y-6 rounded-sm border px-4 pt-3 pb-2">
              <div className="flex flex-col">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold dark:text-zinc-300">
                      <Target className="h-5 w-5" />
                      Target Information
                    </h3>
                    <div className="flex flex-wrap justify-start gap-16 space-y-3">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Scan Name
                        </p>
                        <p className="text-md font-medium dark:text-zinc-300">
                          {basicDetails.scanName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">Target</p>
                        <div className="flex items-center gap-3">
                          <p className="text-md font-mono font-medium dark:text-zinc-300">
                            {basicDetails.targetValue}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs dark:text-zinc-300"
                          >
                            {basicDetails.targetType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {basicDetails.description && (
                      <div className="mb-4">
                        <p className="text-muted-foreground text-sm">
                          Description
                        </p>
                        <p className="text-md dark:text-zinc-300">
                          {basicDetails.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="mt-4 space-y-4">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold dark:text-zinc-300">
                    <Gauge className="h-5 w-5" />
                    Scan Settings
                  </h3>
                  <div className="flex flex-wrap justify-between gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm">Intensity</p>
                      <p className="text-md font-medium capitalize dark:text-zinc-300">
                        {basicDetails.scanIntensity}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Schedule</p>
                      <p className="text-md font-medium capitalize dark:text-zinc-300">
                        {basicDetails.scanSchedule}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Max Duration
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <p className="text-md font-medium dark:text-zinc-300">
                          {basicDetails.maxDuration} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold dark:text-zinc-300">
                  <FileText className="h-5 w-5" />
                  Additional Options
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {basicDetails.notifyOnCompletion ? (
                      <CheckCircle2 className="h-5 w-5 dark:text-zinc-300" />
                    ) : (
                      <XCircle className="text-muted-foreground h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium dark:text-zinc-300">
                        Notify on Completion
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Receive scan completion alerts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {basicDetails.generateReport ? (
                      <CheckCircle2 className="h-5 w-5 dark:text-zinc-300" />
                    ) : (
                      <XCircle className="text-muted-foreground h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium dark:text-zinc-300">
                        Generate Report
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Create detailed scan report
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {basicDetails.saveConfiguration ? (
                      <CheckCircle2 className="h-5 w-5 dark:text-zinc-300" />
                    ) : (
                      <XCircle className="text-muted-foreground h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium dark:text-zinc-300">
                        Save Configuration
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Store settings for future use
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <div>
              <p className="text-2xl font-bold dark:text-zinc-300">
                Rules of Engagement
              </p>
            </div>
            <div className="mt-2">
              <ScrollArea className="h-60 rounded-md border p-4">
                <p className="dark:text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {roe?.rulesOfEngagementStatement}
                </p>
              </ScrollArea>
            </div>
          </div>
          <Separator />
          <div>
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold dark:text-zinc-300">
                Reconnaissance Tools
                <Badge variant="secondary" className="ml-2 dark:text-zinc-300">
                  {recon?.reconTools.filter((tool: any) => tool.enabled).length}{" "}
                  enabled
                </Badge>
              </p>
            </div>
            <div className="mt-2 space-y-6 rounded-sm border px-4 pt-4 pb-2">
              {recon?.reconTools.map((tool: any, index: any) => (
                <div key={tool.name} className="space-y-4 dark:text-zinc-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-semibold">
                        {tool.name}
                      </span>
                      <Badge variant={tool.enabled ? "default" : "outline"}>
                        {tool.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {tool.enabled && Object.keys(tool.parameters).length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {Object.entries(tool.parameters).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-3 rounded-lg border p-1"
                          >
                            <code className="flex-1 rounded px-2 py-1 font-mono text-sm">
                              {value as any}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {index < recon.reconTools.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold dark:text-zinc-300">
                Vulnerability Assessment
                <Badge variant="secondary" className="ml-2 dark:text-zinc-300">
                  {vulnr?.vulnrTools.filter((tool: any) => tool.enabled).length}{" "}
                  enabled
                </Badge>
              </p>
            </div>
            <div className="mt-2 space-y-6 rounded-sm border px-4 pt-4 pb-2">
              {vulnr?.vulnrTools.map((tool: any, index: any) => (
                <div key={tool.name} className="space-y-4 dark:text-zinc-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-semibold">
                        {tool.name}
                      </span>
                      <Badge variant={tool.enabled ? "default" : "outline"}>
                        {tool.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {tool.enabled && Object.keys(tool.parameters).length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {Object.entries(tool.parameters).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-3 rounded-lg border p-1"
                          >
                            <code className="flex-1 rounded px-2 py-1 font-mono text-sm">
                              {value as any}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {index < vulnr.vulnrTools.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>

          <Separator />
          <div>
            <div>
              <p className="flex items-center gap-2 text-2xl font-bold dark:text-zinc-300">
                Exploitation Settings
              </p>
            </div>
            <div className="mt-4 space-y-4 rounded-sm border px-4 pt-4 pb-2">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-lg font-semibold dark:text-zinc-300">
                      Exploitation Attempt
                    </p>
                    <p className="text-muted-foreground text-base">
                      {exploit?.attemptExploitation
                        ? "Active exploitation will be attempted on discovered vulnerabilities"
                        : "Exploitation phase is disabled - assessment only"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    exploit?.attemptExploitation ? "destructive" : "outline"
                  }
                  className="text-base dark:text-zinc-300"
                >
                  {exploit?.attemptExploitation ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              {exploit?.attemptExploitation &&
                exploit?.exploitTools.length > 0 && (
                  <div className="space-y-3 pb-2 pl-2">
                    <p className="text-lg font-medium dark:text-zinc-300">
                      Exploitation Tools
                    </p>
                    <div className="mt-2 space-y-6 rounded-sm border px-4 pt-4 pb-2">
                      {exploit?.exploitTools.map((tool: any, index: any) => (
                        <div
                          key={tool.name}
                          className="space-y-4 dark:text-zinc-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xl font-semibold">
                                {tool.name}
                              </span>
                              <Badge
                                variant={tool.enabled ? "default" : "outline"}
                              >
                                {tool.enabled ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>

                          {tool.enabled &&
                            Object.keys(tool.parameters).length > 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  {Object.entries(tool.parameters).map(
                                    ([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex items-center gap-3 rounded-lg border p-1"
                                      >
                                        <code className="flex-1 rounded px-2 py-1 font-mono text-sm">
                                          {value as any}
                                        </code>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {index < exploit.exploitTools.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={onClickBack}
            >
              Back to Configuration
            </Button>
            <Button
              type="submit"
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Start Security Scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalScanPreview;

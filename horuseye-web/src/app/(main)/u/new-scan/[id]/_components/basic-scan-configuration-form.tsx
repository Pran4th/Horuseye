"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useScanStore } from "@/stores/useScanStore";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type BasicFormData = {
  targetType: string;
  targetValue: string;
  scanName: string;
  description: string;
  scanIntensity: string;
  scanSchedule: string;
  maxDuration: string;
  notifyOnCompletion: boolean;
  generateReport: boolean;
  saveConfiguration: boolean;
};

const initialFormData: BasicFormData = {
  targetType: "",
  targetValue: "",
  scanName: "",
  description: "",
  scanIntensity: "medium",
  scanSchedule: "once",
  maxDuration: "60",
  notifyOnCompletion: true,
  generateReport: true,
  saveConfiguration: false,
};

interface BasicScanConfigurationFormProps {
  onClickBack: () => void;
  onClickNext: () => void;
  setStepCount: Dispatch<SetStateAction<number>>;
}

export function BasicScanConfigurationForm({
  setStepCount,
  onClickBack,
  onClickNext,
}: BasicScanConfigurationFormProps) {
  const params = useParams();
  const id = params?.id as string | undefined;

  const currentScan = useScanStore((state) => state.currentScan);
  const setCurrentScan = useScanStore((state) => state.setCurrentScan);
  const updateSection = useScanStore((state) => state.updateSection);

  const [submitting, setSubmitting] = useState(false);
  const [basicDetails, setBasicDetails] = useState<BasicFormData>(
    currentScan?.data.basicDetails ?? initialFormData,
  );
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    field: keyof BasicFormData,
    value: string | boolean,
  ) => {
    setBasicDetails({ ...basicDetails, [field]: value });
  };

  useEffect(() => {
    if (!currentScan && id) {
      const stored = localStorage.getItem(`scan-${id}`);
      if (stored) {
        setCurrentScan(JSON.parse(stored));
      }
    }
  }, [id, currentScan, setCurrentScan]);

  console.log("Target type: ", basicDetails.targetType);

  useEffect(() => {
    if (currentScan?.data.basicDetails) {
      setBasicDetails(currentScan.data.basicDetails);
    }
  }, [currentScan?.data.basicDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const newErrors: { [key: string]: string } = {};
      const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
      const scanNameRegex = /^[A-Za-z0-9_-]+$/;

      if (!basicDetails.targetType.trim()) {
        newErrors.targetType = "Please select a target type.";
      }

      if (!basicDetails.targetValue.trim()) {
        newErrors.targetValue = "Please enter a target value.";
      } else if (!ipv4Regex.test(basicDetails.targetValue)) {
        newErrors.targetValue = "Enter a valid IPv4 address.";
      }

      const duration = Number(basicDetails.maxDuration);
      if (isNaN(duration) || duration < 5 || duration > 1440) {
        newErrors.maxDuration =
          "Max duration must be between 5 and 1440 minutes.";
      }
      if (!basicDetails.scanName.trim()) {
        newErrors.scanName = "Scan name is required.";
      } else if (!scanNameRegex.test(basicDetails.scanName)) {
        newErrors.scanName =
          "Scan name can only contain letters, numbers, hyphens (-), and underscores (_).";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});

      const scanId = window.location.pathname.split("/").pop()!;

      const { currentScan, setCurrentScan } = useScanStore.getState();

      if (!currentScan || currentScan.id !== scanId) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("scan-")) {
            localStorage.removeItem(key);
          }
        });

        const newScan = {
          id: scanId,
          createdAt: Date.now(),
          data: { basicDetails },
        };
        setCurrentScan(newScan);
        localStorage.setItem(`scan-${scanId}`, JSON.stringify(newScan));
      } else {
        updateSection("basicDetails", basicDetails);
      }

      toast("Basic scan configuration saved.", {
        description: "You can proceed to the next step.",
        duration: 3000,
      });
      onClickNext();
    } catch (error) {
      toast.error("Something went wrong.", {
        description: "Please try after some time.",
        duration: 3000,
      });
      console.log("Error in submitting basic details form: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-4xl max-w-5xl p-6">
      <div>
        <h2 className="text-4xl font-bold">Basic Scan Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Precisely define your security testing parameters to uncover
          vulnerabilities with surgical precision. Customize scan depth,
          scheduling, and output options for optimal results.
        </p>

        <form
          id="basic-details-form"
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetType">Target Type</Label>
                <Select
                  value={basicDetails.targetType}
                  onValueChange={(value) =>
                    handleInputChange("targetType", value)
                  }
                  disabled={submitting}
                  defaultValue={basicDetails.targetType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Domain Name" disabled>
                      Domain Name
                    </SelectItem>
                    <SelectItem value="IP Address">IP Address</SelectItem>
                    <SelectItem value="Network Range" disabled>
                      Network Range
                    </SelectItem>
                    <SelectItem value="API Endpoint" disabled>
                      API Endpoint
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.targetType && (
                  <p className="text-destructive ml-1 text-sm">
                    {errors.targetType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetValue">
                  {basicDetails.targetType === "domain"
                    ? "Domain Name"
                    : basicDetails.targetType === "ip"
                      ? "IP Address"
                      : basicDetails.targetType === "network"
                        ? "Network Range (CIDR)"
                        : "API Endpoint URL"}
                </Label>
                <Input
                  id="targetValue"
                  disabled={submitting}
                  placeholder={
                    basicDetails.targetType === "Domain Name"
                      ? "example.com"
                      : basicDetails.targetType === "IP Address"
                        ? "192.168.1.1"
                        : basicDetails.targetType === "Network Range"
                          ? "192.168.1.0/24"
                          : "https://api.example.com/endpoint"
                  }
                  value={basicDetails.targetValue}
                  onChange={(e) =>
                    handleInputChange("targetValue", e.target.value)
                  }
                />
                {errors.targetValue && (
                  <p className="text-destructive ml-1 text-sm">
                    {errors.targetValue}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scanName">Scan Name</Label>
              <Input
                id="scanName"
                placeholder="Production Server Scan"
                value={basicDetails.scanName}
                disabled={submitting}
                onChange={(e) => handleInputChange("scanName", e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                Note: No space or special characters allowed except hyphen and
                underscore
              </p>
              {errors.scanName && (
                <p className="text-destructive ml-1 text-sm">
                  {errors.scanName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                disabled={submitting}
                id="description"
                placeholder="Brief description of this scan purpose..."
                value={basicDetails.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={10}
                className="min-h-40 resize-none"
              />
            </div>
          </div>

          <Separator className="my-8" />

          <div className="pt-4">
            <button
              type="button"
              disabled={submitting}
              className="flex w-full items-center justify-between text-left"
              onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                Additional Options
              </h3>
              {showAdditionalOptions ? (
                <ChevronUp className="text-muted-foreground h-5 w-5" />
              ) : (
                <ChevronDown className="text-muted-foreground h-5 w-5" />
              )}
            </button>

            <AnimatePresence>
              {showAdditionalOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pt-4">
                    <div className="flex w-full items-center justify-center gap-2">
                      <div className="w-full space-y-2">
                        <Label htmlFor="scanIntensity">Scan Intensity</Label>
                        <Select
                          disabled={submitting}
                          value={basicDetails.scanIntensity}
                          onValueChange={(value) =>
                            handleInputChange("scanIntensity", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="deep">Deep</SelectItem>
                            <SelectItem value="aggressive">
                              Aggressive
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full space-y-2">
                        <Label htmlFor="scanSchedule">Schedule</Label>
                        <Select
                          disabled={submitting}
                          value={basicDetails.scanSchedule}
                          onValueChange={(value) =>
                            handleInputChange("scanSchedule", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Run once</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="w-full space-y-2">
                        <Label htmlFor="maxDuration">Max Duration (min)</Label>
                        <Input
                          disabled={submitting}
                          id="maxDuration"
                          type="number"
                          min="5"
                          max="1440"
                          value={basicDetails.maxDuration}
                          className="mb-2 w-full"
                          onChange={(e) =>
                            handleInputChange("maxDuration", e.target.value)
                          }
                        />
                        {errors.maxDuration && (
                          <p className="text-destructive absolute ml-1 text-sm">
                            {errors.maxDuration}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="notifyOnCompletion"
                          className="text-base"
                        >
                          Notify on completion
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Send email when scan is complete
                        </p>
                      </div>
                      <Switch
                        disabled={submitting}
                        id="notifyOnCompletion"
                        checked={basicDetails.notifyOnCompletion}
                        onCheckedChange={(checked) =>
                          handleInputChange("notifyOnCompletion", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="generateReport" className="text-base">
                          Generate detailed report
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Create comprehensive PDF report
                        </p>
                      </div>
                      <Switch
                        disabled={submitting}
                        id="generateReport"
                        checked={basicDetails.generateReport}
                        onCheckedChange={(checked) =>
                          handleInputChange("generateReport", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="saveConfiguration"
                          className="text-base"
                        >
                          Save configuration
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Save settings for future scans
                        </p>
                      </div>
                      <Switch
                        disabled={submitting}
                        id="saveConfiguration"
                        checked={basicDetails.saveConfiguration}
                        onCheckedChange={(checked) =>
                          handleInputChange("saveConfiguration", checked)
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Info, AlertTriangle } from "lucide-react";
import { getToolImage } from "@/lib/toolmap";
import available_tools from "@/data/available_tools.json";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import { useScanStore } from "@/stores/useScanStore";

interface SelectedTool {
  name: string;
  parameters: { [key: string]: string };
  enabled: boolean;
}

interface VulnrScanToolsSelectionFormProps {
  onClickBack: () => void;
  onClickNext: () => void;
  setStepCount: Dispatch<SetStateAction<number>>;
}

export default function VulnrScanToolsSelectionForm({
  onClickNext,
}: VulnrScanToolsSelectionFormProps) {
  const [selectedTools, setSelectedTools] = useState<
    Record<string, SelectedTool>
  >({});
  const [activeTab, setActiveTab] = useState("selection");
  const [target, setTarget] = useState("");

  useEffect(() => {
    const scanId =
      typeof window !== "undefined"
        ? window.location.pathname.split("/").pop()!
        : "";

    const { currentScan, setCurrentScan } = useScanStore.getState();

    if (!currentScan && scanId) {
      const stored = localStorage.getItem(`scan-${scanId}`);
      if (stored) {
        setCurrentScan(JSON.parse(stored));
      }
    }

    const vulnrTools =
      useScanStore.getState().currentScan?.data.vulnr?.vulnrTools;
    if (vulnrTools) {
      setSelectedTools(
        vulnrTools.reduce((acc: Record<string, SelectedTool>, tool: any) => {
          acc[tool.name] = tool;
          return acc;
        }, {}),
      );
    }
  }, []);

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) => {
      if (prev[toolName]) {
        const newState = { ...prev };
        delete newState[toolName];
        return newState;
      } else {
        return {
          ...prev,
          [toolName]: {
            name: toolName,
            parameters: {},
            enabled: true,
          },
        };
      }
    });
  };

  const updateParameter = (
    toolName: string,
    parameterFlag: string,
    value: string | Record<string, string>,
  ) => {
    setSelectedTools((prev) => {
      const existing = prev[toolName];
      const currentParams = existing?.parameters ?? {};

      let newParams: Record<string, string>;

      if (parameterFlag === "__bulk__" && typeof value === "object") {
        newParams = { ...currentParams, ...value };

        Object.keys(currentParams).forEach((flag) => {
          const wasBoolean =
            currentParams[flag] === "true" || currentParams[flag] === "false";
          if (wasBoolean && !(flag in value)) {
            newParams[flag] = "false";
          }
        });
      } else {
        newParams = {
          ...currentParams,
          [parameterFlag]: value as string,
        };
      }

      return {
        ...prev,
        [toolName]: {
          name: existing?.name ?? toolName,
          enabled: existing?.enabled ?? true,
          parameters: newParams,
        },
      };
    });
  };

  const generateCommand = (tool: any, selectedTool: SelectedTool) => {
    let command = tool.default_command;

    Object.entries(selectedTool.parameters).forEach(([flag, value]) => {
      if (flag === "<target>" || flag === "<domain>") {
        command = command.replace(flag, value || target);
      } else if (value === "true") {
        command += ` ${flag}`;
      } else if (value && value !== "false") {
        command += ` ${flag} ${value}`;
      }
    });

    return command;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!selectedTools || Object.keys(selectedTools).length === 0) {
      toast.error("Please select at least one tool.");
      return;
    }

    const vulnrTools = Object.values(selectedTools).map((tool) => {
      const cleanedParams = Object.fromEntries(
        Object.entries(tool.parameters).filter(
          ([, value]) => value !== "false",
        ),
      );
      const generatedCommand = generateCommand(tool, {
        ...tool,
        parameters: cleanedParams,
      });

      return {
        ...tool,
        parameters: cleanedParams,
        generated_command: generatedCommand,
      };
    });

    const vulnrData = { vulnrTools };

    const scanId =
      typeof window !== "undefined"
        ? window.location.pathname.split("/").pop()!
        : "";

    const { currentScan, setCurrentScan, updateSection } =
      useScanStore.getState();

    if (!currentScan || currentScan.id !== scanId) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scan-")) {
          localStorage.removeItem(key);
        }
      });

      const newScan = {
        id: scanId,
        createdAt: Date.now(),
        data: { vulnr: vulnrData },
      };
      setCurrentScan(newScan);
      localStorage.setItem(`scan-${scanId}`, JSON.stringify(newScan));
    } else {
      updateSection("vulnr", vulnrData);
    }

    toast("Vulnerability Assessment tools configuration saved", {
      description: "You can change it later if needed.",
      duration: 3000,
    });
    onClickNext?.();
  };

  return (
    <div className="w-5xl max-w-6xl p-6">
      <h2 className="text-4xl font-bold">
        Vulnerability Assessment Configuration
      </h2>
      <p className="text-muted-foreground mt-2">
        Select and configure the vulnerability scanning tools to identify
        security weaknesses in your target environment. Specify your target
        (domain, IP address, or URL) to enable comprehensive security analysis.
        Our platform handles all tool dependencies and setup requirements,
        allowing you to focus on the assessment results rather than installation
        complexities.
      </p>
      <form className="mt-6" id="vulnr-form" onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="selection">Tool Selection</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {available_tools?.vuln_assessment?.map((tool) => (
                <ToolCard
                  key={tool.name}
                  tool={tool}
                  isSelected={!!selectedTools[tool.name]}
                  onToggle={() => toggleTool(tool.name)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configuration">
            {Object.keys(selectedTools).length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No tools selected</AlertTitle>
                <AlertDescription>
                  Please select at least one tool from the Selection tab to
                  configure.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedTools).map(
                  ([toolName, selectedTool]) => {
                    const tool = available_tools?.vuln_assessment?.find(
                      (t) => t.name === toolName,
                    );
                    if (!tool) return null;

                    return (
                      <ToolConfiguration
                        generateCommand={generateCommand}
                        key={toolName}
                        tool={tool}
                        selectedTool={selectedTool}
                        target={target}
                        onParameterChange={updateParameter}
                      />
                    );
                  },
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}

function ToolCard({
  tool,
  isSelected,
  onToggle,
}: {
  tool: any;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const toolImage = getToolImage(tool.name, "vuln_assessment");

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 ${isSelected ? "ring-primary ring-2" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {toolImage && (
              <img
                src={toolImage}
                alt={tool.name}
                className="h-10 w-10 rounded-lg object-contain"
              />
            )}
            <div>
              <CardTitle className="font-mono text-lg">{tool.name}</CardTitle>
              <CardDescription>{tool.default_command}</CardDescription>
            </div>
          </div>
          <Switch checked={isSelected} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap gap-1">
          {tool.parameters.slice(0, 4).map((param: any) => (
            <Badge key={param.flag} variant="secondary" className="text-xs">
              {param.flag}
            </Badge>
          ))}
          {tool.parameters.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{tool.parameters.length - 4} more
            </Badge>
          )}
        </div>
        {tool.notes && (
          <Alert className="py-2 text-xs">
            <Info className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {tool.notes}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function ToolConfiguration({
  tool,
  selectedTool,
  target,
  onParameterChange,
  generateCommand,
}: {
  tool: any;
  selectedTool: SelectedTool;
  target: string;
  onParameterChange: (
    toolName: string,
    parameterFlag: string,
    value: string | Record<string, string>,
  ) => void;
  generateCommand: (tool: any, selectedTool: SelectedTool) => string;
}) {
  const toolImage = getToolImage(tool.name, "vuln_assessment");
  const generatedCommand = generateCommand(tool, selectedTool);

  const booleanParameters = tool.parameters.filter(
    (param: any) => !param.requiresValue,
  );

  const selectedTools = useScanStore(
    (s) => s.currentScan?.data.vulnr?.vulnrTools,
  );

  const savedTool = selectedTools?.find((t: any) => t.name === tool.name);

  const selectedBooleanParams = savedTool
    ? Object.entries(savedTool.parameters || {})
        .filter(([, v]) => v === "true")
        .map(([flag]) => flag)
    : [];

  const handleBooleanParamsChange = (selected: string[]) => {
    const updatedParams: Record<string, string> = {};

    selected.forEach((flag) => {
      updatedParams[flag] = "true";
    });

    const prevParams = savedTool?.parameters || {};
    Object.entries(prevParams).forEach(([flag, value]) => {
      if (!(flag in updatedParams)) {
        if (value !== "true" && value !== "false") {
          updatedParams[flag] = value as string;
        }
      }
    });

    onParameterChange(tool.name, "__bulk__", updatedParams);
  };

  const booleanOptions = booleanParameters.map((param: any) => ({
    value: param.flag,
    label: param.flag,
    description: param.description,
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {toolImage && (
            <img
              src={toolImage}
              alt={tool.name}
              className="h-12 w-12 rounded-lg object-contain"
            />
          )}
          <div>
            <CardTitle className="font-mono text-xl">{tool.name}</CardTitle>
            <CardDescription>
              Configure parameters for {tool.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {booleanOptions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Flags & Options</Label>
            <MultiSelect
              defaultValue={selectedBooleanParams}
              options={booleanOptions}
              value={selectedBooleanParams}
              onValueChange={handleBooleanParamsChange}
              placeholder="Select flags and options..."
              className="w-fit"
            />
            <p className="text-muted-foreground text-xs">
              Choose from available boolean flags and options
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tool.parameters.map((param: any) =>
            param.configurable === false
              ? null
              : param.requiresValue && (
                  <div key={param.flag} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor={`${tool.name}-${param.flag}`}
                        className="font-mono text-sm"
                      >
                        {param.flag}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="text-muted-foreground h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              {param.description}
                            </p>
                            {param.example && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                Example: {param.example}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {param.flag === "<target>" || param.flag === "<domain>" ? (
                      <Input
                        id={`${tool.name}-${param.flag}`}
                        value={selectedTool.parameters[param.flag] || target}
                        onChange={(e) =>
                          onParameterChange(
                            tool.name,
                            param.flag,
                            e.target.value,
                          )
                        }
                        placeholder={param.example}
                      />
                    ) : (
                      <Input
                        id={`${tool.name}-${param.flag}`}
                        value={selectedTool.parameters[param.flag] || ""}
                        onChange={(e) =>
                          onParameterChange(
                            tool.name,
                            param.flag,
                            e.target.value,
                          )
                        }
                        placeholder={param.example}
                      />
                    )}
                  </div>
                ),
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="mb-2 text-sm font-medium">Generated Command</h4>
          <div className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-sm">
            {generatedCommand}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

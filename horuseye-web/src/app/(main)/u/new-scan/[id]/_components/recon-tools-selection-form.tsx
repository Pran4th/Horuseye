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
  generated_command?: string;
}

interface ReconToolsSelectionFormProps {
  onClickBack: () => void;
  onClickNext: () => void;
  setStepCount: Dispatch<SetStateAction<number>>;
}

export default function ReconToolsSelectionForm({
  onClickNext,
}: ReconToolsSelectionFormProps) {
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

    const reconTools =
      useScanStore.getState().currentScan?.data.recon?.reconTools;
    if (reconTools) {
      setSelectedTools(
        reconTools.reduce((acc: Record<string, SelectedTool>, tool: any) => {
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

    const reconTools = Object.values(selectedTools).map((tool) => {
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
      };
    });

    const reconData = { reconTools };

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
        data: { recon: reconData },
      };
      setCurrentScan(newScan);
      localStorage.setItem(`scan-${scanId}`, JSON.stringify(newScan));
    } else {
      updateSection("recon", reconData);
    }

    toast("Reconnaisance tools configuration saved", {
      description: "You can change it later if needed.",
      duration: 3000,
    });
    onClickNext?.();
  };

  return (
    <div className="w-5xl max-w-6xl p-6">
      <h2 className="text-4xl font-bold">Reconnaisance Tools Configuration</h2>
      <p className="text-muted-foreground mt-2">
        Select and configure the reconnaissance tools you want to use for your
        scan. Make sure to provide a valid target (domain or URL) for accurate
        results. Note that some tools may require additional setup which is not
        provided by you and taken care by us.
      </p>
      <form className="mt-6" id="recon-form" onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="selection">Tool Selection</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="selection">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {available_tools?.recon?.map((tool) => (
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
                    const tool = available_tools?.recon?.find(
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
  const toolImage = getToolImage(tool.name, "recon");

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
  const toolImage = getToolImage(tool.name, "recon");
  const generatedCommand = generateCommand(tool, selectedTool);

  const booleanParameters = tool.parameters.filter(
    (param: any) => !param.requiresValue,
  );

  const selectedTools = useScanStore(
    (s) => s.currentScan?.data.recon?.reconTools,
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

/**
  So, I have already build up four things. The web frontend, recon service (flask), vulnr service (flask), and the fastapi API gateway.
  Now, as the architecture describes message queue and argo workflows, i am not at all familiar with both of them at all. I know basics of kubernetes and have kubectl installed.
  I have dockerized both of my applications, the recon service as well as the vulnr service. The goal of this notebook is going to be able to integrate the system built yet properly. 

  I am going to provide you the Dockerfile, docker-compose.yml, and the payload (example) both vulnr and recon services expect. I will also send you my current json payload getting prepared.
  Now i am not familiar with which particular data should i manipulate, though i would obviously prefer to change web data (and any future argo templates or anything related that would need to be prepared) instead of the two services already built.

  Just get the context of the structure of system first and only when i tell, we will proceed.


  Following is the payload structure being generated in frontend.
  {
  "id": "606af155-8463-46db-a7ca-6d4579e0ff9e",
  "createdAt": 1761404807981,
  "data": {
    "basicDetails": {
      "targetType": "IP Address",
      "targetValue": "192.168.1.1",
      "scanName": "Scan-01",
      "description": "bkbjbjk",
      "scanIntensity": "deep",
      "scanSchedule": "weekly",
      "maxDuration": "60",
      "notifyOnCompletion": true,
      "generateReport": true,
      "saveConfiguration": true
    },
    "roe": {
      "rulesOfEngagementStatement": "ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE ROE "
    },
    "recon": {
      "reconTools": [
        {
          "name": "nmap",
          "enabled": true,
          "parameters": {
            "-p": "-p 1-65535",
            "-T": "-T4"
          },
        },
        {
          "name": "theHarvester",
          "enabled": true,
          "parameters": {
            "-b": "baidu",
            "-v": "true"
          },
        }
      ]
    },
    "vulnr": {
      "vulnrTools": [
        {
          "name": "nikto",
          "parameters": {},
          "enabled": true
        },
        {
          "name": "httpx",
          "parameters": {},
          "enabled": true
        }
      ]
    },
    "exploit": {
      "attemptExploitation": false,
      "exploitTools": []
    }
  }
}

This is the dockerfile, docker-compose.yml, and payload structure for recon service.
  Dockerfile: 
  # Stage 1: Builder - Installs all tools and build dependencies
FROM kalilinux/kali-rolling AS builder

WORKDIR /build
ENV DEBIAN_FRONTEND=noninteractive

# Install build dependencies and tools in a single layer with cleanup
RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  build-essential \
  libpcap-dev \
  python3 \
  python3-pip \
  python3-setuptools \
  nmap \
  ruby \
  ruby-dev \
  perl \
  dnsenum \
  whatweb \
  golang-go \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install masscan from source and clean up in same layer
RUN git clone --depth 1 https://github.com/robertdavidgraham/masscan.git && \
  cd masscan && \
  make -j$(nproc) && \
  mv bin/masscan /usr/local/bin/masscan && \
  cd .. && \
  rm -rf masscan

# Set up Go environment and install Go-based tools with caching optimization
ENV GOPATH=/go
ENV PATH=$GOPATH/bin:$PATH
RUN --mount=type=cache,target=/go/pkg/mod \
  --mount=type=cache,target=/root/.cache/go-build \
  go install -v github.com/owasp-amass/amass/v4/...@v4.2.0 && \
  go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@v2.6.5 && \
  go install github.com/OJ/gobuster/v3@v3.6.0

# Install Python-based tools with cache and cleanup
RUN git clone --depth 1 https://github.com/laramies/theHarvester.git /opt/theHarvester && \
  cd /opt/theHarvester && \
  pip3 install --no-cache-dir --break-system-packages . && \
  git clone --depth 1 https://github.com/lanmaster53/recon-ng.git /opt/recon-ng && \
  cd /opt/recon-ng && \
  pip3 install --no-cache-dir --break-system-packages -r REQUIREMENTS && \
  git clone --depth 1 https://github.com/maurosoria/dirsearch.git /opt/dirsearch && \
  rm -rf /root/.cache/pip

# Stage 2: Final Image - Minimal runtime
FROM kalilinux/kali-rolling

ENV DEBIAN_FRONTEND=noninteractive

# Install only essential runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  nmap \
  ruby \
  perl \
  dnsenum \
  whatweb \
  libnet-dns-perl \
  libnet-ip-perl \
  libnet-whois-ip-perl \
  libwww-perl \
  libpq-dev \
  python3 \
  python3-pip \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy only necessary binaries and tools
COPY --from=builder /usr/local/bin/masscan /usr/local/bin/
COPY --from=builder /go/bin/amass /usr/local/bin/
COPY --from=builder /go/bin/subfinder /usr/local/bin/
COPY --from=builder /go/bin/gobuster /usr/local/bin/
COPY --from=builder /opt/theHarvester /opt/theharvester
COPY --from=builder /opt/recon-ng /opt/recon-ng
COPY --from=builder /opt/dirsearch /opt/dirsearch

WORKDIR /app

# Copy application files and install dependencies
COPY . .
RUN pip3 install --no-cache-dir --break-system-packages /opt/theharvester && \
  pip3 install --no-cache-dir --break-system-packages -r /opt/dirsearch/requirements.txt && \
  pip3 install --no-cache-dir --break-system-packages -r requirements.txt && \
  rm -rf /root/.cache/pip

# Create symlinks for tools
RUN ln -s /opt/theharvester/theHarvester.py /usr/local/bin/theharvester && \
  ln -s /opt/recon-ng/recon-ng /usr/local/bin/recon-ng && \
  ln -s /opt/dirsearch/dirsearch.py /usr/local/bin/dirsearch

EXPOSE 8080

CMD ["python3", "main.py"]
docker-compose.yml:
services:
  api:
    build: .
    image: horuseye/recon-service
    command: flask run --host=0.0.0.0 --port=8080
    ports:
      - "8080:8080"
    volumes:
      - ./outputs:/app/outputs
      - ./gcloud-credentials.json:/app/gcloud-credentials.json:ro
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-credentials.json
      - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    env_file:
      - .env
    cap_add:
      - NET_ADMIN
      - NET_RAW
    depends_on:
      redis-recon:
        condition: service_healthy

  worker:
    build: .
    image: horuseye/recon-service
    command: celery -A tasks worker --loglevel=info
    volumes:
      - ./outputs:/app/outputs
      - ./gcloud-credentials.json:/app/gcloud-credentials.json:ro
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-credentials.json
      - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    depends_on:
      redis-recon:
        condition: service_healthy

  redis-recon:
    image: "redis/redis-stack:latest"
    ports:
      - "6380:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5


payload structure: {
    "target": "scanme.nmap.org",
    "scan_id": "recon_test_1",
    "tools": [
        {
            "name": "nmap",
            "parameters": [
                { "flag": "-sV", "value": "true" },
                { "flag": "-O", "value": "true" },
                { "flag": "-T4", "value": "true" },
                { "flag": "--top-ports", "value": "100" }
            ]
        },
        {
            "name": "whatweb",
            "parameters": [
                 { "flag": "-v", "value": "true" }
            ]
        },
        {
            "name": "dnsenum",
            "parameters": [
                { "flag": "--enum", "value": "true" }
            ]
        }
  ]
}

This is the dockerfile, docker-compose.yml, and payload structure for vulnr service.
Dockerfile: FROM golang:1.24-alpine AS builder

ENV GOBIN=/go/bin GOPATH=/go

WORKDIR /src

RUN apk add --no-cache git ca-certificates

RUN set -eux; \
    go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest; \
    go install -v github.com/zricethezav/gitleaks/v8@latest; \
    go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

RUN git clone --depth 1 https://github.com/trufflesecurity/trufflehog.git . \
    && go build -o /go/bin/trufflehog .

FROM python:3.12-slim

WORKDIR /app

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    git \
    perl \
    curl \
    iputils-ping \
    sqlmap \
    lynis \
    ruby \
    ruby-dev \
    build-essential \
    wget \
    yara; \
    git clone --depth 1 https://github.com/sullo/nikto.git /opt/nikto; \
    git clone --depth 1 https://github.com/Yara-Rules/rules.git /opt/yara-rules; \
    gem install wpscan; wpscan --update || true; \
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin; \
    apt-get remove -y --purge ruby-dev build-essential; \
    apt-get autoremove -y; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=builder /go/bin/nuclei /usr/local/bin/
COPY --from=builder /go/bin/gitleaks /usr/local/bin/
COPY --from=builder /go/bin/httpx /usr/local/bin/
COPY --from=builder /go/bin/trufflehog /usr/local/bin/

RUN nuclei -update-templates || true

COPY requirements.txt .

RUN python -m pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8081

CMD ["python", "main.py"]
docker-compose.yml: 
services:
  api:
    build: .
    image: horuseye/vuln-service
    command: flask run --host=0.0.0.0 --port=8081
    ports:
      - "8081:8081"
    volumes:
      - ./outputs:/app/outputs
      - ./gcloud-credentials.json:/app/gcloud-credentials.json:ro
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-credentials.json
      - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    env_file:
      - .env
    depends_on:
      redis:
        condition: service_healthy

  worker:
    build: .
    image: horuseye/vuln-service
    command: celery -A tasks worker --loglevel=info
    volumes:
      - ./outputs:/app/outputs
      - ./gcloud-credentials.json:/app/gcloud-credentials.json:ro
    env_file:
      - .env
    environment:
      - GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-credentials.json
      - GCS_BUCKET_NAME=${GCS_BUCKET_NAME}
    depends_on:
      redis:
        condition: service_healthy

  redis:
    image: "redis/redis-stack:latest"
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

payload structure: 
{
  "scan_id": "recon_test_1",
  "target": "scanme.nmap.org",
  "tools": [
        {
        "name": "nuclei",
        "parameters": [
            {
                "flag": "templateCategories",
                "value": [
                    "cves",
                    "exposed-panels"
                ],
                "requiresValue": true
            },
            {
                "flag": "-severity",
                "value": "high,critical",
                "requiresValue": true
            },
            {
                "flag": "-rate-limit",
                "value": "50",
                "requiresValue": true
            }
        ]
    },
    {
      "name": "httpx",
      "parameters": [
        
      ]
    }
  ]
}

  
 */

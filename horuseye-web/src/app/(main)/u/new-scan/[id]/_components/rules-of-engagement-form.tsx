"use client";

import {
  useState,
  useRef,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FiFileText,
  FiUpload,
  FiLoader,
  FiFile,
  FiImage,
  FiFileText as FiDoc,
  FiX,
} from "react-icons/fi";
import {
  extractTextFromDOCX,
  extractTextFromImage,
  getFileExtension,
} from "@/lib/client/document-processor";
import { useScanStore } from "@/stores/useScanStore";

interface RulesOfEngagementProps {
  onClickBack: () => void;
  onClickNext: () => void;
  setStepCount: Dispatch<SetStateAction<number>>;
}

export function RulesOfEngagementForm({
  setStepCount,
  onClickBack,
  onClickNext,
}: RulesOfEngagementProps) {
  const currentScan = useScanStore((state) => state.currentScan);
  const setCurrentScan = useScanStore((state) => state.setCurrentScan);
  const updateSection = useScanStore((state) => state.updateSection);

  const [rulesOfEngagementStatement, setRulesOfEngagementStatement] =
    useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const scanId =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()!
      : "";

  useEffect(() => {
    if (!currentScan && scanId) {
      const stored = localStorage.getItem(`scan-${scanId}`);
      if (stored) {
        setCurrentScan(JSON.parse(stored));
      }
    }
  }, [scanId, currentScan, setCurrentScan]);

  useEffect(() => {
    if (currentScan?.data.roe?.rulesOfEngagementStatement) {
      setRulesOfEngagementStatement(
        currentScan.data.roe.rulesOfEngagementStatement,
      );
    }
  }, [currentScan?.data.roe]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      if (!rulesOfEngagementStatement.trim()) {
        toast.error("Please enter a purpose statement");
        return;
      }

      if (rulesOfEngagementStatement.length < 1000) {
        setError("Purpose statement must be at least 100 characters");
        return;
      }
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
          data: { roe: { rulesOfEngagementStatement } },
        };
        setCurrentScan(newScan);
        localStorage.setItem(`scan-${scanId}`, JSON.stringify(newScan));
      } else {
        updateSection("roe", { rulesOfEngagementStatement });
      }

      toast("Rules of engagement saved.", { duration: 3000 });
      setError(null);
      onClickNext();
    } catch (error) {
      setError("Failed to save purpose statement");
      toast("Failed to save purpose statement", { duration: 3000 });
    } finally {
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = getFileExtension(file.name);
    const allowedExtensions = ["docx", "doc", "png", "jpg", "jpeg"];

    if (!allowedExtensions.includes(extension)) {
      toast.error("Unsupported file type. Please upload DOCX, or image files.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "File size too large. Please upload files smaller than 10MB.",
      );
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);
    toast.info("Processing document...");

    try {
      let extractedText = "";

      if (["docx", "doc"].includes(extension)) {
        extractedText = await extractTextFromDOCX(file);
      } else {
        extractedText = await extractTextFromImage(file);
      }

      setRulesOfEngagementStatement(extractedText);
      toast.success("Text extracted successfully from document!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to extract text from document. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    if (["pdf"].includes(extension)) return <FiFileText className="h-5 w-5" />;
    if (["docx", "doc"].includes(extension))
      return <FiDoc className="h-5 w-5" />;
    if (["png", "jpg", "jpeg", "tiff", "bmp"].includes(extension))
      return <FiImage className="h-5 w-5" />;
    return <FiFile className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-4xl max-w-5xl p-6">
      <form onSubmit={onSubmit} id="roe-form" className="">
        <h2 className="text-4xl font-bold">Rules Of Engagement Document</h2>
        <p className="text-muted-foreground mt-2">
          Define the scope and objectives of this security assessment. You can
          type directly or upload documents to extract text.{" "}
        </p>

        <div className="mt-12">
          <div className="space-y-6">
            <div className="rounded-lg border border-dashed border-gray-300 p-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <FiUpload className="h-8 w-8 text-gray-400" />

                {uploadedFile ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {getFileIcon(uploadedFile.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="max-w-xs truncate text-sm font-medium text-gray-700">
                            {uploadedFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(uploadedFile.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isProcessing}
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Upload DOCX, or image files to extract text
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: DOCX, PNG, JPG
                    </p>
                  </>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.tiff,.bmp"
                  className="hidden"
                />

                {!uploadedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    disabled={isProcessing}
                    className="gap-1"
                  >
                    {isProcessing ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiUpload className="h-4 w-4" />
                        Upload Document
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="purpose-statement"
                  className="block text-sm font-medium"
                >
                  ROE/Purpose Statement
                </label>
                {isProcessing && (
                  <div className="flex items-center text-xs text-blue-600">
                    <FiLoader className="mr-1 h-3 w-3 animate-spin" />
                    Extracting text...
                  </div>
                )}
              </div>
              <div className="relative">
                <Textarea
                  id="purpose-statement"
                  value={rulesOfEngagementStatement}
                  onChange={(e) =>
                    setRulesOfEngagementStatement(e.target.value)
                  }
                  placeholder="Example: This penetration test is being conducted to identify vulnerabilities in our external web applications prior to the Q2 release. The scope includes all customer-facing endpoints on *.example.com..."
                  className="max-h-[400px] min-h-[250px] resize-none text-sm"
                  disabled={isProcessing}
                  style={{ overflowY: "auto" }}
                />
                {rulesOfEngagementStatement.length > 1000 && (
                  <div className="absolute right-2 bottom-2 rounded px-2 py-1 text-xs">
                    Scroll to see more
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-between">
                <p className="text-xs">
                  {rulesOfEngagementStatement.length}/50000 characters
                </p>
                <p className="text-xs">Minimum 1000 characters required</p>
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

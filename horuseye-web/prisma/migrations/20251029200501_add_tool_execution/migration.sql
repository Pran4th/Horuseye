-- CreateTable
CREATE TABLE "public"."Invalidated_tokens" (
    "id" TEXT NOT NULL,
    "exp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Invalidated_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Scan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ToolExecution" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "parameters" JSONB,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScanFile" (
    "id" TEXT NOT NULL,
    "toolExecutionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "gcsPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Scan_userId_idx" ON "public"."Scan"("userId");

-- CreateIndex
CREATE INDEX "ToolExecution_scanId_idx" ON "public"."ToolExecution"("scanId");

-- CreateIndex
CREATE UNIQUE INDEX "ScanFile_gcsPath_key" ON "public"."ScanFile"("gcsPath");

-- CreateIndex
CREATE INDEX "ScanFile_toolExecutionId_idx" ON "public"."ScanFile"("toolExecutionId");

-- AddForeignKey
ALTER TABLE "public"."Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ToolExecution" ADD CONSTRAINT "ToolExecution_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "public"."Scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScanFile" ADD CONSTRAINT "ScanFile_toolExecutionId_fkey" FOREIGN KEY ("toolExecutionId") REFERENCES "public"."ToolExecution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

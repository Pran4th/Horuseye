-- AlterTable
ALTER TABLE "public"."Scan" ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."ToolExecution" ALTER COLUMN "status" SET DEFAULT 'pending';

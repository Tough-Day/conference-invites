-- AlterTable
ALTER TABLE "form_fields" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "originalFieldId" TEXT;

-- CreateIndex
CREATE INDEX "form_fields_conferenceId_isActive_idx" ON "form_fields"("conferenceId", "isActive");

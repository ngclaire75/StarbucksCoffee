-- AlterTable: add securityCode to PaymentCard
ALTER TABLE "PaymentCard" ADD COLUMN IF NOT EXISTS "securityCode" TEXT;

-- AlterTable: add phone to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- CreateTable: SavedStore
CREATE TABLE IF NOT EXISTS "SavedStore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "storeData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedStore_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PaymentCard
CREATE TABLE IF NOT EXISTS "PaymentCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "expMonth" INTEGER NOT NULL,
    "expYear" INTEGER NOT NULL,
    "nameOnCard" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SavedStore_userId_placeId_key" ON "SavedStore"("userId", "placeId");
CREATE INDEX IF NOT EXISTS "SavedStore_userId_idx" ON "SavedStore"("userId");
CREATE INDEX IF NOT EXISTS "PaymentCard_userId_idx" ON "PaymentCard"("userId");

-- AddForeignKey
ALTER TABLE "SavedStore" ADD CONSTRAINT "SavedStore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PaymentCard" ADD CONSTRAINT "PaymentCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

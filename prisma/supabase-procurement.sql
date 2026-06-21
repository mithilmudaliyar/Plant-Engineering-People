-- Run this in your Supabase SQL Editor
CREATE TABLE "BuyOrderSheet" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "uploadedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BuyOrderItem" (
  "id" SERIAL PRIMARY KEY,
  "sheetId" INTEGER NOT NULL,
  "productName" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "specification" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BuyOrderItem_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "BuyOrderSheet"("id") ON DELETE CASCADE
);

CREATE TABLE "SupplierQuote" (
  "id" SERIAL PRIMARY KEY,
  "itemId" INTEGER NOT NULL,
  "supplierId" INTEGER NOT NULL,
  "pricePerUnit" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SupplierQuote_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "BuyOrderItem"("id") ON DELETE CASCADE,
  CONSTRAINT "SupplierQuote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE,
  CONSTRAINT "SupplierQuote_itemId_supplierId_key" UNIQUE ("itemId", "supplierId")
);

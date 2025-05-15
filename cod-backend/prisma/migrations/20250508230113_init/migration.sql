-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updatedAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyIntegration" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "domain" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updatedAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "ShopifyIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZRIntegration" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "token" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),
    "updatedAt" TIMESTAMPTZ(6) DEFAULT timezone('utc'::text, now()),

    CONSTRAINT "ZRIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyIntegration_userId_key" ON "ShopifyIntegration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ZRIntegration_userId_key" ON "ZRIntegration"("userId");

-- AddForeignKey
ALTER TABLE "ShopifyIntegration" ADD CONSTRAINT "ShopifyIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ZRIntegration" ADD CONSTRAINT "ZRIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

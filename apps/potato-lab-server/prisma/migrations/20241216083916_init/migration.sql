-- CreateEnum
CREATE TYPE "SourcePlatform" AS ENUM ('BINANCE', 'BYBIT', 'MEDX');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "performance" JSONB NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourcePlatform" "SourcePlatform" NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "portfolioId" INTEGER NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FavouritePortfolio" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FavouritePortfolio_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_id_key" ON "Portfolio"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Position_id_key" ON "Position"("id");

-- CreateIndex
CREATE INDEX "_FavouritePortfolio_B_index" ON "_FavouritePortfolio"("B");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouritePortfolio" ADD CONSTRAINT "_FavouritePortfolio_A_fkey" FOREIGN KEY ("A") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavouritePortfolio" ADD CONSTRAINT "_FavouritePortfolio_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

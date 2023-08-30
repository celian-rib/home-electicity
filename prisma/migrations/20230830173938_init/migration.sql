-- CreateTable
CREATE TABLE "Ping" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUp" BOOLEAN NOT NULL,

    CONSTRAINT "Ping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUp" BOOLEAN NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alertee" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alertee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlertToAlertee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlertToAlertee_AB_unique" ON "_AlertToAlertee"("A", "B");

-- CreateIndex
CREATE INDEX "_AlertToAlertee_B_index" ON "_AlertToAlertee"("B");

-- AddForeignKey
ALTER TABLE "_AlertToAlertee" ADD CONSTRAINT "_AlertToAlertee_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertToAlertee" ADD CONSTRAINT "_AlertToAlertee_B_fkey" FOREIGN KEY ("B") REFERENCES "Alertee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

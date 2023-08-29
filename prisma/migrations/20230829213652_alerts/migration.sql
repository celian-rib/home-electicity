-- CreateTable
CREATE TABLE "Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUp" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Alertee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_AlertToAlertee" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlertToAlertee_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlertToAlertee_B_fkey" FOREIGN KEY ("B") REFERENCES "Alertee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlertToAlertee_AB_unique" ON "_AlertToAlertee"("A", "B");

-- CreateIndex
CREATE INDEX "_AlertToAlertee_B_index" ON "_AlertToAlertee"("B");

-- CreateTable
CREATE TABLE "Ping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUp" BOOLEAN NOT NULL
);
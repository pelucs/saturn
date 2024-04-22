-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idGithub" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idGithub_key" ON "User"("idGithub");

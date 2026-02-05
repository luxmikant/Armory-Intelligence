-- CreateTable
CREATE TABLE "Firearm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "caliber" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "barrelLength" REAL NOT NULL,
    "overallLength" REAL,
    "price" REAL,
    "imageUrl" TEXT,
    "model3dUrl" TEXT,
    "country" TEXT,
    "yearIntroduced" INTEGER,
    "description" TEXT,
    "specifications" TEXT,
    "history" TEXT,
    "safetyFeatures" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MaintenanceGuide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firearmId" TEXT,
    "firearmType" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "timeMinutes" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "tools" TEXT NOT NULL,
    "warnings" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MaintenanceGuide_firearmId_fkey" FOREIGN KEY ("firearmId") REFERENCES "Firearm" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BallisticsData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firearmId" TEXT,
    "caliber" TEXT NOT NULL,
    "bulletWeight" INTEGER NOT NULL,
    "muzzleVelocity" INTEGER NOT NULL,
    "muzzleEnergy" INTEGER NOT NULL,
    "bc" REAL NOT NULL,
    "trajectoryData" TEXT NOT NULL,
    "manufacturer" TEXT,
    "bulletType" TEXT,
    CONSTRAINT "BallisticsData_firearmId_fkey" FOREIGN KEY ("firearmId") REFERENCES "Firearm" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LegalRegulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "state" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "restrictions" TEXT,
    "penalties" TEXT,
    "exemptions" TEXT,
    "effectiveDate" DATETIME,
    "sourceUrl" TEXT,
    "lastVerified" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CCWReciprocity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homeState" TEXT NOT NULL,
    "homeStateCode" TEXT NOT NULL,
    "honoredStates" TEXT NOT NULL,
    "restrictedIn" TEXT,
    "notes" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SafetyChecklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "items" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "audience" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "timeLimit" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oderId" TEXT NOT NULL,
    "completedQuizzes" TEXT NOT NULL DEFAULT '[]',
    "badges" TEXT NOT NULL DEFAULT '[]',
    "certifications" TEXT NOT NULL DEFAULT '[]',
    "savedFirearms" TEXT NOT NULL DEFAULT '[]',
    "preferences" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricalEra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "keyEvents" TEXT NOT NULL,
    "innovations" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "Firearm_type_idx" ON "Firearm"("type");

-- CreateIndex
CREATE INDEX "Firearm_caliber_idx" ON "Firearm"("caliber");

-- CreateIndex
CREATE INDEX "Firearm_manufacturer_idx" ON "Firearm"("manufacturer");

-- CreateIndex
CREATE INDEX "MaintenanceGuide_firearmType_idx" ON "MaintenanceGuide"("firearmType");

-- CreateIndex
CREATE INDEX "MaintenanceGuide_difficulty_idx" ON "MaintenanceGuide"("difficulty");

-- CreateIndex
CREATE INDEX "BallisticsData_caliber_idx" ON "BallisticsData"("caliber");

-- CreateIndex
CREATE INDEX "LegalRegulation_stateCode_idx" ON "LegalRegulation"("stateCode");

-- CreateIndex
CREATE INDEX "LegalRegulation_category_idx" ON "LegalRegulation"("category");

-- CreateIndex
CREATE UNIQUE INDEX "LegalRegulation_state_category_key" ON "LegalRegulation"("state", "category");

-- CreateIndex
CREATE UNIQUE INDEX "CCWReciprocity_homeStateCode_key" ON "CCWReciprocity"("homeStateCode");

-- CreateIndex
CREATE INDEX "SafetyChecklist_category_idx" ON "SafetyChecklist"("category");

-- CreateIndex
CREATE INDEX "Quiz_category_idx" ON "Quiz"("category");

-- CreateIndex
CREATE INDEX "Quiz_difficulty_idx" ON "Quiz"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_oderId_key" ON "UserProgress"("oderId");

-- CreateIndex
CREATE INDEX "HistoricalEra_startYear_idx" ON "HistoricalEra"("startYear");

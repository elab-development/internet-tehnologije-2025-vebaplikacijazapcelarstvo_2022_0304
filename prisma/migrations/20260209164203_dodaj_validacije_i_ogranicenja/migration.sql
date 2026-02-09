/*
  Warnings:

  - You are about to alter the column `naslov` on the `aktivnost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `naziv` on the `kosnica` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `aktivnost` MODIFY `naslov` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `kosnica` MODIFY `naziv` VARCHAR(100) NOT NULL,
    MODIFY `jacina` VARCHAR(191) NOT NULL DEFAULT 'srednja';

-- CreateIndex
CREATE INDEX `Kosnica_naziv_idx` ON `Kosnica`(`naziv`);

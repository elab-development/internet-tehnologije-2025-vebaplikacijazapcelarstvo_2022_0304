/*
  Warnings:

  - You are about to drop the column `aktivnostId` on the `komentar` table. All the data in the column will be lost.
  - Added the required column `kosnicaId` to the `Komentar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `komentar` DROP FOREIGN KEY `Komentar_aktivnostId_fkey`;

-- AlterTable
ALTER TABLE `komentar` DROP COLUMN `aktivnostId`,
    ADD COLUMN `kosnicaId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Komentar_kosnicaId_idx` ON `Komentar`(`kosnicaId`);

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_kosnicaId_fkey` FOREIGN KEY (`kosnicaId`) REFERENCES `Kosnica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

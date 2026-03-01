-- DropForeignKey
ALTER TABLE `Komentar` DROP FOREIGN KEY `Komentar_aktivnostId_fkey`;

-- AlterTable
ALTER TABLE `Komentar` DROP COLUMN `aktivnostId`,
    ADD COLUMN `kosnicaId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Komentar_kosnicaId_idx` ON `Komentar`(`kosnicaId`);

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_kosnicaId_fkey` FOREIGN KEY (`kosnicaId`) REFERENCES `Kosnica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
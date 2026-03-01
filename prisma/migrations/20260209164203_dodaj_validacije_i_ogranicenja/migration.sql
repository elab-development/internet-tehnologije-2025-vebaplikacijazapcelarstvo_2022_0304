-- AlterTable
ALTER TABLE `Aktivnost` MODIFY `naslov` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `Kosnica` MODIFY `naziv` VARCHAR(100) NOT NULL,
    MODIFY `jacina` VARCHAR(191) NOT NULL DEFAULT 'srednja';

-- CreateIndex
CREATE INDEX `Kosnica_naziv_idx` ON `Kosnica`(`naziv`);
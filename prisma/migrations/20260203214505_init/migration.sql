-- CreateTable
CREATE TABLE `Korisnik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ime` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `sifra` VARCHAR(191) NOT NULL,
    `uloga` ENUM('ADMIN', 'KORISNIK', 'MENADZER') NOT NULL DEFAULT 'KORISNIK',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Korisnik_email_key`(`email`),
    INDEX `Korisnik_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kosnica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `naziv` VARCHAR(191) NOT NULL,
    `brPcela` INTEGER NOT NULL,
    `jacina` VARCHAR(191) NOT NULL,
    `brRamova` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `korisnikId` INTEGER NOT NULL,

    INDEX `Kosnica_korisnikId_idx`(`korisnikId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aktivnost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `naslov` VARCHAR(191) NOT NULL,
    `tip` VARCHAR(191) NOT NULL,
    `opis` TEXT NOT NULL,
    `datumPocetka` DATETIME(3) NOT NULL,
    `izvrsena` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `korisnikId` INTEGER NOT NULL,
    `kosnicaId` INTEGER NOT NULL,

    INDEX `Aktivnost_korisnikId_idx`(`korisnikId`),
    INDEX `Aktivnost_kosnicaId_idx`(`kosnicaId`),
    INDEX `Aktivnost_datumPocetka_idx`(`datumPocetka`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Komentar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sadrzaj` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `korisnikId` INTEGER NOT NULL,
    `aktivnostId` INTEGER NOT NULL,

    INDEX `Komentar_korisnikId_idx`(`korisnikId`),
    INDEX `Komentar_aktivnostId_idx`(`aktivnostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifikacija` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poruka` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `korisnikId` INTEGER NOT NULL,
    `aktivnostId` INTEGER NOT NULL,

    INDEX `Notifikacija_korisnikId_idx`(`korisnikId`),
    INDEX `Notifikacija_aktivnostId_idx`(`aktivnostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kosnica` ADD CONSTRAINT `Kosnica_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aktivnost` ADD CONSTRAINT `Aktivnost_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aktivnost` ADD CONSTRAINT `Aktivnost_kosnicaId_fkey` FOREIGN KEY (`kosnicaId`) REFERENCES `Kosnica`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_aktivnostId_fkey` FOREIGN KEY (`aktivnostId`) REFERENCES `Aktivnost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikacija` ADD CONSTRAINT `Notifikacija_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikacija` ADD CONSTRAINT `Notifikacija_aktivnostId_fkey` FOREIGN KEY (`aktivnostId`) REFERENCES `Aktivnost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

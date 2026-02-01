-- CreateTable
CREATE TABLE `Korisnik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ime` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `sifra` VARCHAR(191) NOT NULL,
    `uloga` ENUM('ADMIN', 'KORISNIK', 'MENADZER') NOT NULL,

    UNIQUE INDEX `Korisnik_email_key`(`email`),
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
    `korisnikId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aktivnost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `naslov` VARCHAR(191) NOT NULL,
    `tip` VARCHAR(191) NOT NULL,
    `opis` VARCHAR(191) NOT NULL,
    `datumPocetka` DATETIME(3) NOT NULL,
    `izvrsena` BOOLEAN NOT NULL DEFAULT false,
    `korisnikId` INTEGER NOT NULL,
    `kosnicaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Komentar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sadrzaj` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `korisnikId` INTEGER NOT NULL,
    `aktivnostId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifikacija` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poruka` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `korisnikId` INTEGER NOT NULL,
    `aktivnostId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kosnica` ADD CONSTRAINT `Kosnica_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aktivnost` ADD CONSTRAINT `Aktivnost_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aktivnost` ADD CONSTRAINT `Aktivnost_kosnicaId_fkey` FOREIGN KEY (`kosnicaId`) REFERENCES `Kosnica`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Komentar` ADD CONSTRAINT `Komentar_aktivnostId_fkey` FOREIGN KEY (`aktivnostId`) REFERENCES `Aktivnost`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikacija` ADD CONSTRAINT `Notifikacija_korisnikId_fkey` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifikacija` ADD CONSTRAINT `Notifikacija_aktivnostId_fkey` FOREIGN KEY (`aktivnostId`) REFERENCES `Aktivnost`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

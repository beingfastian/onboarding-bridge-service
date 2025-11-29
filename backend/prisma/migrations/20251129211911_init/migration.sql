-- CreateTable
CREATE TABLE `provisioned_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `ghlContactId` VARCHAR(255) NOT NULL,
    `customAppId` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `provisioned_users_email_key`(`email`),
    INDEX `provisioned_users_email_idx`(`email`),
    INDEX `provisioned_users_ghlContactId_idx`(`ghlContactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

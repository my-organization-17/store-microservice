ALTER TABLE `categories` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `items` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `items` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `updatedAt`;--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `updatedAt`;
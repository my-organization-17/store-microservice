ALTER TABLE `categories` ADD `is_available` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `items` ADD `is_available` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `items` ADD `category_id` varchar(36) NOT NULL;
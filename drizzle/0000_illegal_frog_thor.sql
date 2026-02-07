CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);

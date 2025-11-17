CREATE TABLE `exchanges` (
	`exchange_id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`target_book_id` text NOT NULL,
	`exchange_status` text NOT NULL,
	`exchange_created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `books` (
	`book_id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`book_title` text NOT NULL,
	`description` text NOT NULL,
	`book_author` text NOT NULL,
	`book_available` integer NOT NULL,
	`condition` text NOT NULL,
	`book_created_at` integer NOT NULL
);

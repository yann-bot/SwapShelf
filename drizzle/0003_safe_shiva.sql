PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exchanges` (
	`exchange_id` text PRIMARY KEY NOT NULL,
	`requester_id` text NOT NULL,
	`my_book_id` text NOT NULL,
	`target_book_id` text NOT NULL,
	`exchange_status` text NOT NULL,
	`exchange_created_at` integer NOT NULL,
	FOREIGN KEY (`requester_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`my_book_id`) REFERENCES `books`(`book_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_book_id`) REFERENCES `books`(`book_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exchanges`("exchange_id", "requester_id", "my_book_id", "target_book_id", "exchange_status", "exchange_created_at") SELECT "exchange_id", "requester_id", "my_book_id", "target_book_id", "exchange_status", "exchange_created_at" FROM `exchanges`;--> statement-breakpoint
DROP TABLE `exchanges`;--> statement-breakpoint
ALTER TABLE `__new_exchanges` RENAME TO `exchanges`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL
);

ALTER TABLE "UserFavouritePortfolio" RENAME TO "user_favourite_portfolio";--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" DROP CONSTRAINT "UserFavouritePortfolio_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" DROP CONSTRAINT "UserFavouritePortfolio_portfolioId_Portfolio_id_fk";
--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" DROP CONSTRAINT "UserFavouritePortfolio_userId_portfolioId_pk";--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" ADD CONSTRAINT "user_favourite_portfolio_userId_portfolioId_pk" PRIMARY KEY("userId","portfolioId");--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" ADD CONSTRAINT "user_favourite_portfolio_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favourite_portfolio" ADD CONSTRAINT "user_favourite_portfolio_portfolioId_Portfolio_id_fk" FOREIGN KEY ("portfolioId") REFERENCES "public"."Portfolio"("id") ON DELETE no action ON UPDATE no action;
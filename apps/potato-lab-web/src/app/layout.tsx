import "./global.css";
import type { Metadata } from "next";
import { cn } from "@potato-lab/lib/utils";

import { iosevkaMono } from "../fonts/Iosevka";
import RootProviders from "./providers";
import GlobalDialog from "../components/dialog/GlobalDialog";
import { getUserCookies } from "../server/cookies-actions";

export const metadata: Metadata = {
  title: "Potato Lab - Job Scrapper",
  description: "A platform that automate your jobs hunting"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const getUserData = async () => {
    const result = await getUserCookies();

    if (result.error || !result.data) {
      return;
    }

    return result.data;
  };
  const userData = await getUserData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-mono antialiased transition-opacity duration-300",
          iosevkaMono.variable
        )}
      >
        <RootProviders userData={userData}>{children}</RootProviders>
        <GlobalDialog />
      </body>
    </html>
  );
}

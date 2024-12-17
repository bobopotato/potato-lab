"use client";

import { NavSidebar } from "../nav/nav-sidebar";
import { ContentLayout } from "./content-layout";

export const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavSidebar />
      <ContentLayout title="Testing">{children}</ContentLayout>
    </>
  );
};

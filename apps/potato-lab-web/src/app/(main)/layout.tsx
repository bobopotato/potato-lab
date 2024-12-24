import React from "react";
import { UserLayout } from "../../components/layout/user-layout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <UserLayout>{children}</UserLayout>;
};

export default MainLayout;

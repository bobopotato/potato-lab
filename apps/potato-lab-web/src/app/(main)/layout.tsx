import React, { Suspense } from "react";
import { UserLayout } from "../../components/layout/user-layout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback="loading....">
      <UserLayout>{children}</UserLayout>
    </Suspense>
  );
};

export default MainLayout;

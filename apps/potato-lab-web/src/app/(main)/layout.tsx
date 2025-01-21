import React, { Suspense } from "react";
import { UserLayout } from "../../components/layout/user-layout";
import Loading from "../loading";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <UserLayout>{children}</UserLayout>
    </Suspense>
  );
};

export default MainLayout;

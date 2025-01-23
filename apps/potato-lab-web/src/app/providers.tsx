"use client";

import { ThemeProvider } from "../components/theme/theme-provider";
import { SidebarProvider, Toaster } from "@potato-lab/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "../components/auth/auth-provider";
import { User } from "@potato-lab/shared-types";

const RootProviders = ({
  children,
  userData
}: {
  children: React.ReactNode;
  userData?: { user: Omit<User, "password">; accessToken: string };
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider userData={userData}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SidebarProvider
            style={
              {
                "--sidebar-width-icon": "6rem"
              } as React.CSSProperties
            }
          >
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
      <Toaster richColors closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default RootProviders;

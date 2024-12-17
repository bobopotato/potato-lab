"use client";

import { cn } from "@potato-lab/lib/utils";
import { useSidebar } from "@potato-lab/ui";
import { NavHeader } from "../nav/nav-header";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  const { open } = useSidebar();

  return (
    <main
      className={cn(
        "bg-primary-foreground min-h-[calc(100vh_-var(--header-height))] w-full transition-[margin-left] ease-in-out duration-300",
        open ? "lg-ml-[16rem]" : "lg-ml-[6rem]"
      )}
    >
      <NavHeader title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </main>
  );
}

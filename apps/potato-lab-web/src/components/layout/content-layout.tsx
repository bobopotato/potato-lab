"use client";

import { cn } from "@potato-lab/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  ScrollArea,
  useSidebar
} from "@potato-lab/ui";
import { NavHeader } from "../nav/nav-header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { NavigationItem, navigationItems } from "../nav/nav.config";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  const { open } = useSidebar();
  const pathname = usePathname();

  const breadCrumbs = useMemo(() => {
    let result: NavigationItem[] = [];
    const match = (url: string) => pathname.startsWith(url);
    const checkNestedRoute = (
      items: NavigationItem[],
      selectedItem: NavigationItem[]
    ) => {
      for (const item of items) {
        if (!item.children?.length) {
          const valid = match(item.url);
          if (valid) {
            result = [...selectedItem, item];
            return;
          }
          continue;
        }

        checkNestedRoute(item.children, [...selectedItem, item]);
      }
    };
    checkNestedRoute(navigationItems, []);

    return result;
  }, [pathname]);

  return (
    <main
      className={cn(
        "bg-primary-foreground min-h-[calc(100vh-var(--header-height))] w-full transition-[margin-left] ease-in-out duration-300",
        open ? "lg-ml-[16rem]" : "lg-ml-[6rem]"
      )}
    >
      <NavHeader title={breadCrumbs[0]?.title} />
      <div className="pt-8 pb-8 px-4 sm:px-8">
        <PageBreadCrumbs breadCrumbs={breadCrumbs} pathname={pathname} />
        <ScrollArea className="mt-5 bg-secondary rounded-lg h-[calc(100vh-var(--header-height)-90px-20px)] [&>div>*]:h-full [&>div>div>*]:p-8">
          {children}
        </ScrollArea>
      </div>
    </main>
  );
}

const PageBreadCrumbs = ({
  breadCrumbs,
  pathname
}: {
  breadCrumbs: NavigationItem[];
  pathname: string;
}) => {
  const computedBreadCrumbs = () => {
    const result = [...breadCrumbs];
    const remainingItems = pathname.split("/").slice(1 + breadCrumbs.length); // get rid of first "/"

    remainingItems.forEach((item: string) => {
      result.push({
        title: item
          .split("-")
          ?.map((word: string) => {
            // Capitalize the first letter of each word and keep the rest of the word unchanged
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" "),
        url: `${result.at(-1)?.url}/${item}`
      });
    });

    return result;
  };

  const breadcrumbsList = computedBreadCrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbsList.slice(0, -1).map((item, index) => (
          <div key={index} className="flex flex-row items-center gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.url}>{item?.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-app">
            {breadcrumbsList.at(-1)?.title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

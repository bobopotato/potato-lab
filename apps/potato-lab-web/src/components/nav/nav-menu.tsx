import Link from "next/link";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  DropdownMenu,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  CollapsibleTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  ScrollArea
} from "@potato-lab/ui";
import { cn } from "@potato-lab/lib/utils";
import { usePathname } from "next/navigation";
import { NavigationItem, navigationItems } from "./nav.config";
import { ChevronDown, DotIcon, Loader2 } from "lucide-react";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useJobsScrapperQuery } from "../../queries/use-jobs-scrapper-query";

const isCurrentPath = (pathname: string, path: string) => {
  return (
    (pathname.split("/").length < 4 && pathname.startsWith(path)) ||
    (pathname.split("/").length >= 4 && pathname === path)
  );
};

const NavMenu = () => {
  const pathname = usePathname();
  const { open } = useSidebar();

  const { data: jobsScrapperData, isPending: isJobsScrapperPending } =
    useJobsScrapperQuery();

  const _navigationItems = useMemo(() => {
    if (!jobsScrapperData?.length) {
      if (isJobsScrapperPending) {
        return navigationItems;
      }
      return navigationItems.filter((item) => {
        return item.title !== "Jobs Scrapper Data";
      });
    }

    const clonedNavigationItem = cloneDeep(navigationItems);
    const viewScrapperDataNav = clonedNavigationItem.find(
      (item) => item.title === "Jobs Scrapper Data"
    );

    if (!viewScrapperDataNav || !viewScrapperDataNav.children) {
      return clonedNavigationItem;
    }

    viewScrapperDataNav.children.push(
      ...jobsScrapperData.map((item) => ({
        title: item.name,
        url: `/jobs-scrapper-data/${item.id}/listing`
      }))
    );
    return clonedNavigationItem;
  }, [isJobsScrapperPending, jobsScrapperData]);

  return (
    <ScrollArea>
      <SidebarMenu className="py-2">
        {_navigationItems.map((item) => {
          if (isJobsScrapperPending && item.title === "Jobs Scrapper Data") {
            return (
              <div className="flex gap-2 scale-75 py-3.5" key={item.title}>
                <Loader2 className="animate-spin" />
                <div className="flex gap-2 items-baseline">
                  <span className="animate-pulse">Loading scrapper data</span>
                  <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-200"></div>
                  <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-400"></div>
                  <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-200"></div>
                </div>
              </div>
            );
          }
          if (!item.children?.length) {
            return (
              <NormalMenu key={item.title} item={item} pathname={pathname} />
            );
          }
          return (
            <CollapsibleMenu
              key={item.title}
              item={item}
              isSidebarOpen={open}
              pathname={pathname}
              isJobsScrapperPending={isJobsScrapperPending}
            />
          );
        })}
      </SidebarMenu>
    </ScrollArea>
  );
};

const NormalMenu = ({
  item,
  pathname
}: {
  item: NavigationItem;
  pathname: string;
}) => {
  return (
    <SidebarMenuItem key={item.title} className="mx-4">
      <SidebarMenuButton
        className={cn(
          "w-full transition-all duration-100 ease-in-out dark:hover:bg-primary-foreground hover:bg-gray-200",
          isCurrentPath(pathname, item.url)
            ? "dark:bg-primary-foreground bg-gray-200 font-semibold"
            : ""
        )}
        asChild
        tooltip={item.title}
      >
        <Link href={item.url}>
          {item.icon && <item.icon className="!size-5" />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const CollapsibleMenu = ({
  item,
  isSidebarOpen,
  pathname,
  isJobsScrapperPending
}: {
  item: NavigationItem;
  isSidebarOpen: boolean;
  pathname: string;
  isJobsScrapperPending: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // useEffect(() => {
  //   const checkChildren = (items: NavigationItem[]) => {
  //     for (const child of items) {
  //       if (child.children?.length) {
  //         checkChildren(child.children);
  //         continue;
  //       }
  //       if (pathname.startsWith(child.url)) {
  //         setIsCollapsed(true);
  //         return;
  //       }
  //     }
  //   };

  //   if (item.children?.length) {
  //     checkChildren(item.children);
  //   }
  // }, [item.children, pathname]);

  const button = (
    item: NavigationItem | NonNullable<NavigationItem["children"]>[number],
    buttonSuffix?: React.ReactNode
  ) => {
    return (
      <SidebarMenuButton
        className={cn(
          "mb-1 w-full transition-all duration-100 ease-in-out dark:hover:bg-primary-foreground hover:bg-gray-200",
          (!item.children?.length || !isCollapsed) &&
            isCurrentPath(pathname, item.url)
            ? "dark:bg-primary-foreground bg-gray-200 font-semibold"
            : ""
        )}
        asChild
        tooltip={item.title}
      >
        <Link href={!item.children?.length ? item.url : ""}>
          <div className="flex flex-row flex-auto gap-2">
            {item.icon ? <item.icon className="!size-5" /> : <DotIcon />}
            <span
              className={cn(
                isSidebarOpen === false ? "opacity-0" : "opacity-100"
              )}
            >
              {item.title}
            </span>
          </div>
          {buttonSuffix && isSidebarOpen && buttonSuffix}
        </Link>
      </SidebarMenuButton>
    );
  };

  if (!isSidebarOpen) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="ml-4">{button(item)}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-secondary"
          side="right"
          sideOffset={0}
          align="start"
        >
          <DropdownMenuLabel className="max-w-[190px] truncate">
            {item.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.children?.map(({ url, title }, index) => (
            <DropdownMenuItem key={index} asChild>
              <Link className={`cursor-pointer `} href={url}>
                <p className="max-w-[180px] truncate">{title}</p>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuArrow className="fill-border" />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <SidebarMenuItem key={item.title} className="mx-4">
        <CollapsibleTrigger
          className="[&[data-state=open]>svg]:rotate-180 mb-1"
          asChild
        >
          {button(
            item,
            <ChevronDown
              size={18}
              className="transition-transform duration-200"
            />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="w-full overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {item.children?.map((child, index) => {
            return <div key={index}>{button(child)}</div>;
          })}
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default NavMenu;

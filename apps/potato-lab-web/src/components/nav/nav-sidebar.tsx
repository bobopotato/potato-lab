"use client";

import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@potato-lab/ui";
import {
  LayoutDashboard,
  Search,
  FolderHeart,
  Newspaper,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@potato-lab/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Favourite",
    url: "/favourite",
    icon: FolderHeart,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  return (
    <Sidebar
      className="ease-in-out duration-300 bg-secondary z-30"
      collapsible="icon"
    >
      <div className="invisible lg:visible absolute top-[20px] -right-[16px] z-50">
        <Button
          onClick={toggleSidebar}
          className="rounded-md w-8 h-8"
          variant="outline"
          size="icon"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform ease-in-out duration-700",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </div>

      <SidebarHeader className="mt-2 relative overflow-hidden">
        <div className="flex items-center">
          <Image
            className="invert dark:invert-0"
            width={70}
            height={70}
            src="/potato_lab.svg"
            alt="PotatoLab"
          />
          <h1
            className={cn(
              "text-2xl whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
              open
                ? "translate-x-0 opacity-100"
                : "-translate-x-96 opacity-0 hidden"
            )}
          >
            PotatoLab
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="py-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="mx-4">
              <SidebarMenuButton
                className={cn(
                  "py-6 transition-all duration-100 ease-in-out dark:hover:bg-primary-foreground hover:bg-gray-200",
                  pathname.startsWith(item.url)
                    ? "dark:bg-primary-foreground bg-gray-200 font-semibold"
                    : ""
                )}
                asChild
                tooltip={item.title}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

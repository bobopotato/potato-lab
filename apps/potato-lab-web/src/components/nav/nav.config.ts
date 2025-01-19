import {
  FolderHeartIcon,
  LayoutDashboardIcon,
  LucideProps,
  NewspaperIcon,
  SearchIcon,
  ShovelIcon
} from "lucide-react";
import React from "react";

export interface NavigationItem {
  title: string;
  url: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  children?: NavigationItem[];
  onActive?: () => void;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon
  },
  {
    title: "Scrapper",
    url: "#",
    icon: ShovelIcon,
    children: [
      {
        title: "Jobs Scrapper",
        url: "/scrapper/jobs-scrapper"
      }
      // {
      //   title: "Coming Soon",
      //   url: "/scrapper/coming-soon"
      // }
    ]
  },
  {
    title: "Search",
    url: "/search",
    icon: SearchIcon
  },
  {
    title: "Favourite",
    url: "/favourite",
    icon: FolderHeartIcon
  },
  {
    title: "News",
    url: "/news",
    icon: NewspaperIcon
  }
];
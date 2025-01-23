import {
  FolderHeartIcon,
  LayoutDashboardIcon,
  LucideProps,
  NewspaperIcon,
  SearchIcon,
  ShovelIcon,
  ViewIcon
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
    url: "#",
    icon: LayoutDashboardIcon,
    children: [
      {
        title: "Introduction",
        url: "/dashboard/introduction"
      },
      {
        title: "Overview",
        url: "/dashboard/overview"
      }
    ]
  },
  // {
  //   title: "Scrapper",
  //   url: "#",
  //   icon: ShovelIcon,
  //   children: [
  {
    title: "Jobs Scrapper",
    url: "/jobs-scrapper",
    icon: ShovelIcon
    // children: []
  },
  {
    title: "Jobs Scrapper Data",
    url: "/jobs-scrapper-data",
    icon: ViewIcon,
    children: []
  },
  // {
  //   title: "Coming Soon",
  //   url: "/scrapper/coming-soon"
  // }
  //   ]
  // },
  // {
  //   title: "Search",
  //   url: "/search",
  //   icon: SearchIcon
  // },
  {
    title: "Job Data Map",
    url: "/map",
    icon: FolderHeartIcon
  }
  // {
  //   title: "Favourite",
  //   url: "/favourite",
  //   icon: FolderHeartIcon
  // }
  // {
  //   title: "News",
  //   url: "/news",
  //   icon: NewspaperIcon
  // }
];

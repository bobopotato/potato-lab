"use client";

import { Button } from "@potato-lab/ui";
import { ThemeSwitcher } from "../theme/theme-switcher";

export const NavHeader = ({ title }: { title: string }) => {
  return (
    <header className="w-full h-[--header-height] bg-secondary px-8 py-8 flex items-center justify-between shadow-lg dark:shadow-sm dark:shadow-gray-800 sticky top-0 z-20">
      <h1 className="text-2xl text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Button
          size="sm"
          variant={"secondary"}
          className="outline outline-1 outline-primary/30 hover:bg-gray-200 hover:dark:bg-inherit hover:dark:brightness-200 hover:dark:outline-white transition-all duration-250"
        >
          Sign Up
        </Button>
        <Button
          size="sm"
          variant={"secondary"}
          className="outline outline-1 outline-primary/30 hover:bg-gray-200 hover:dark:bg-inherit hover:dark:brightness-200 hover:dark:outline-white transition-all duration-250"
        >
          Login
        </Button>
      </div>
    </header>
  );
};

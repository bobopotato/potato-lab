"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@potato-lab/ui";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      return setTheme("dark");
    }
    return setTheme("light");
  };

  return (
    <div>
      <Button
        size="icon"
        variant={"secondary"}
        className="rounded-full outline outline-1 outline-primary/30 hover:bg-gray-200  hover:dark:bg-inherit hover:dark:brightness-200 hover:dark:outline-white transition-all duration-250"
        onClick={toggleTheme}
      >
        <Moon className="dark:scale-0 rotate-0 dark:rotate-90 transition-transform ease-in-out duration-300" />
        <Sun className="absolute scale-0 dark:scale-100 rotate-0 dark:-rotate-90 transition-transform ease-in-out duration-300" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

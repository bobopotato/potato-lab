"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@potato-lab/ui";
import { ThemeSwitcher } from "../theme/theme-switcher";
import { useAuth } from "../auth/auth-provider";

export const NavHeader = ({ title }: { title: string }) => {
  const { isLoggedIn, signOut, user } = useAuth();

  return (
    <header className="w-full h-[--header-height] bg-secondary px-8 py-8 flex items-center justify-between shadow-lg dark:shadow-sm dark:shadow-gray-800 sticky top-0 z-20">
      <h1 className="text-2xl text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        {isLoggedIn && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage
                    src={
                      user?.imageUrl
                        ? user.imageUrl
                        : "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-secondary m-2 px-2  justify-items-center">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-300  w-full" />
                <DropdownMenuLabel>
                  <Button
                    size="sm"
                    variant={"secondary"}
                    className="outline outline-1 outline-primary/30 hover:bg-gray-200 hover:dark:bg-inherit hover:dark:brightness-200 hover:dark:outline-white transition-all duration-250"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};

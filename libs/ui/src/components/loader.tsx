import React from "react";
import { Slottable } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@potato-lab/lib/utils";

interface LoadingWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  loadingComponent?: React.ReactNode;
  label?: string;
}

export const LoadingWrapper = ({
  children,
  isLoading,
  loadingComponent,
  label = "Loading",
  className
}: LoadingWrapperProps) => {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <Slottable>{children}</Slottable>
      {isLoading && (
        <Loader loadingComponent={loadingComponent} label={label} />
      )}
    </div>
  );
};

const Loader = ({
  loadingComponent,
  label
}: Pick<LoadingWrapperProps, "loadingComponent" | "label">) => {
  return (
    <div className="absolute left-0 top-0 flex h-full max-h-screen w-full flex-col items-center justify-center gap-3 bg-black/40">
      {loadingComponent ? (
        loadingComponent
      ) : (
        <Loader2 className="size-10 animate-spin items-center" />
      )}
      <div className="flex items-baseline gap-2">
        <span className="animate-pulse">{label}</span>
        <div className="h-1 w-1 animate-pulse rounded-full bg-current delay-200"></div>
        <div className="delay-400 h-1 w-1 animate-pulse rounded-full bg-current"></div>
        <div className="h-1 w-1 animate-pulse rounded-full bg-current delay-200"></div>
      </div>
    </div>
  );
};

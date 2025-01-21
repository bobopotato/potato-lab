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
    <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex flex-col gap-3 items-center justify-center">
      {loadingComponent ? (
        loadingComponent
      ) : (
        <Loader2 className="animate-spin size-10 items-center" />
      )}
      <div className="flex gap-2 items-baseline">
        <span className="animate-pulse">{label}</span>
        <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-200"></div>
        <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-400"></div>
        <div className="h-1 w-1 rounded-full bg-current animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@potato-lab/ui";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon
}: DashboardCardProps) => {
  return (
    <Card className="p-5 bg-primary-foreground space-y-3 flex flex-col">
      <CardTitle className="flex justify-between gap-4  ">
        <h1>{title}</h1>
        <Button
          className="pointer-events-none w-5 h-5 aspect-square"
          variant="ghost"
          asChild
        >
          {icon}
        </Button>
      </CardTitle>
      <CardContent className="p-0 flex-auto text-2xl font-bold self-baseline">
        {value}
      </CardContent>
      <CardDescription className="text-sm text-light-gray justify-end place-items-end justify-items-end">
        {description}
      </CardDescription>
    </Card>
  );
};

export default DashboardCard;

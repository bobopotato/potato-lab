"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  LoadingWrapper,
  Separator
} from "@potato-lab/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { SelectScheduler } from "@potato-lab/shared-types";
import { getErrorMessage } from "../../../utils/error.util";
import { parseCronExpression } from "../../../utils/cron.util";
import { formatDateTime } from "../../../utils/date.util";
import { useJobsScrapperQuery } from "../../../queries/use-jobs-scrapper-query";

const JobsScrapper = () => {
  const { isPending, data, error, refetch } = useJobsScrapperQuery();

  if (error) {
    toast.error(getErrorMessage(error, "Something went wrong"));

    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <h1>
          Something went wrong. Please try to refetch data again.{" "}
          {JSON.stringify(error)}
        </h1>
        <Button onClick={() => refetch()}>Refetch data</Button>
      </div>
    );
  }

  return (
    <LoadingWrapper isLoading={isPending}>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl">Jobs Scrapper</h1>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger>
              <Button asChild size="icon" onClick={console.log}>
                <Link href="./jobs-scrapper/scrapper-configuration">
                  <Plus />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10}>
              <div className="bg-primary text-secondary rounded-lg p-1 px-4">
                Add Scrapper
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {data?.map((item) => (
          <ScrapperCard key={item.id} data={item} />
        ))}
      </div>
    </LoadingWrapper>
  );
};

const ScrapperCard = ({ data }: { data: SelectScheduler }) => {
  return (
    <Link href={`./jobs-scrapper/${data.id}`}>
      <Card className="bg-primary-foreground cursor-pointer hover:scale-[102.5%] transition-transform ease-in-out duration-200">
        <CardHeader className="text-xl">
          <CardTitle>{data.name}</CardTitle>
          {data.description && (
            <CardDescription>{data.description}</CardDescription>
          )}
        </CardHeader>
        <Separator className="bg-gray-500 w-[85%] m-auto mb-4" />
        <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
          <p>Frequency: </p>
          <p className="text-gray-400">
            {parseCronExpression(data.frequencyExpression)}
          </p>
          <p>Keywords: </p>
          <p className="text-gray-400">{data.keywords?.join(", ")}</p>
          <p>Data from: </p>
          <p className="text-gray-400">{data.sourcePlatform?.join(", ")}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-2 text-sm text-gray-500">
          <p>Last triggered at:</p>
          <p className="text-xs">{formatDateTime(data.lastTriggerAt) || "-"}</p>
          <p>Last success at</p>
          <p className="text-xs">{formatDateTime(data.lastEndAt) || "-"}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JobsScrapper;

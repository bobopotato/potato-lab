"use client";

import React, { useMemo } from "react";
import { SchedulerTypeEnum } from "@potato-lab/db";
import SchedulerConfiguration from "../../../../components/scrapper/scheduler-configuration";
import { useJobsScrapperQuery } from "../../../../queries/use-jobs-scrapper-query";
import { selectSchedulerSchema } from "@potato-lab/shared-types";
import { LoadingWrapper } from "@potato-lab/ui";

const ScrapperScheduler = ({ params }: { params: { schedulerId: string } }) => {
  const { data, isPending } = useJobsScrapperQuery();

  const selectedData = useMemo(() => {
    if (!data) {
      return;
    }
    return selectSchedulerSchema.parse(
      data?.find((d) => d.id === params.schedulerId)
    );
  }, [data, params.schedulerId]);

  return (
    <LoadingWrapper isLoading={isPending}>
      <h1 className="text-2xl">Setup Your Job Scrapper Configuration</h1>
      {selectedData && (
        <SchedulerConfiguration
          type={SchedulerTypeEnum.JOBS_SCRAPPER}
          action="update"
          defaultData={selectedData}
        />
      )}
    </LoadingWrapper>
  );
};

export default ScrapperScheduler;

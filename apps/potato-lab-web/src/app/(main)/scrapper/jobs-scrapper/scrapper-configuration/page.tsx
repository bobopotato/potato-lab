import React from "react";
import SchedulerConfiguration from "../../../../../components/scrapper/scheduler-configuration";
import { SchedulerTypeEnum } from "@potato-lab/db";

const ScrapperConfiguration = () => {
  return (
    <div>
      <h1 className="text-2xl">Setup Your Job Scrapper Configuration</h1>
      <SchedulerConfiguration
        type={SchedulerTypeEnum.JOBS_SCRAPPER}
        action="create"
      />
    </div>
  );
};

export default ScrapperConfiguration;

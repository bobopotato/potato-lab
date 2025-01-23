"use client";

import React, { useMemo } from "react";
import DashboardCard from "./dashboard-card";
import DashboardChart from "./dashboard-chart";
import { useJobsScrapperQuery } from "../../../../queries/use-jobs-scrapper-query";

const Overview = () => {
  const { data } = useJobsScrapperQuery();

  const info = useMemo(() => {
    if (!data) {
      return;
    }

    const totalScrapper = data.length;
    const totalDataScraped = data.reduce((acc, item) => {
      const result = item.records?.reduce((_acc, _item) => {
        const _result = Object.values(_item.record || {}).reduce(
          (__acc, __item) => {
            __acc += __item.currentCount;
            return __acc;
          },
          0
        );
        _acc += _result;
        return _acc;
      }, 0);
      acc += result || 0;
      return acc;
    }, 0);

    return {
      totalScrapper,
      totalDataScraped
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-app">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DashboardCard
          title="Total Scrapper"
          value={info?.totalScrapper.toString() || "Loading..."}
          description="Total scrapper created"
          icon={<div>💎</div>}
        />
        <DashboardCard
          title="Total Data Scraped"
          value={info?.totalDataScraped.toString() || "Loading..."}
          description="Data collected among all scrappers"
          icon={<div>🔢</div>}
        />
      </div>
      <DashboardChart />
    </div>
  );
};

export default Overview;

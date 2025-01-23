"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Text,
  XAxis
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  LoadingWrapper,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type ChartConfig
} from "@potato-lab/ui";
import { useJobsScrapperQuery } from "../../../../queries/use-jobs-scrapper-query";
import { formatDateTime } from "../../../../utils/date.util";
import Link from "next/link";
import { selectSchedulerSchema } from "@potato-lab/shared-types";
import { z } from "zod";

const COLOR_LIST = [
  "hsl(173 60% 50%)",
  "hsl(200 80% 50%)",
  "hsl(250 80% 50%)",
  "hsl(300 80% 50%)",
  "hsl(350 80% 50%)",
  "hsl(400 80% 50%)",
  "hsl(450 80% 50%)"
];

const monthOptions = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" }
];

interface ChartData {
  lastTriggerAt: Date | undefined;
  [key: string]: number | Date | undefined;
}

const DashboardChart = () => {
  const { data, isLoading } = useJobsScrapperQuery();

  const [scrapper, setScrapper] = React.useState<string>();
  const [scrapperOptions, setScrapperOptions] = React.useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [month, setMonth] = React.useState(monthOptions?.[0].value);
  const [chartData, setChartData] = React.useState<{
    success: ChartData[];
    failed: ChartData[];
  }>();
  const [chartConfig, setChartConfig] = React.useState<{
    success: ChartConfig;
    failed: ChartConfig;
  }>();

  const _setChartData = useCallback(
    (
      selectedSchedulerRecords:
        | z.infer<typeof selectSchedulerSchema.shape.records>
        | undefined
    ) => {
      const _data = selectedSchedulerRecords?.reduce(
        (acc, record, index) => {
          const data = Object.entries(record.record || {})?.reduce(
            (acc, [key, item]) => {
              acc.success[key] = item.currentCount;
              acc.failed[key] = item.failedCount; // || Math.floor(Math.random() * 20) + 1;
              return acc;
            },
            { success: {}, failed: {} } as {
              success: Record<string, number>;
              failed: Record<string, number>;
            }
          );

          acc.success.push({
            lastTriggerAt: record.lastTriggerAt,
            ...data.success
          });

          acc.failed.push({
            lastTriggerAt: record.lastTriggerAt,
            ...data.failed
          });
          return acc;
        },
        { success: [], failed: [] } as {
          success: ChartData[];
          failed: ChartData[];
        }
      );
      setChartData(_data);
    },
    []
  );

  const _setChartConfig = useCallback(
    (
      selectedSchedulerRecords:
        | z.infer<typeof selectSchedulerSchema.shape.records>
        | undefined
    ) => {
      const _data = selectedSchedulerRecords?.reduce(
        (acc, record) => {
          Object.keys(record.record || {}).forEach(
            (key: string, index: number) => {
              if (acc.success?.[key] && acc.failed?.[key]) {
                return;
              }

              acc.success[key] = {
                label: key,
                color: COLOR_LIST[index % COLOR_LIST.length]
              } as ChartConfig;

              acc.failed[key] = {
                label: key,
                color: COLOR_LIST[index % COLOR_LIST.length] //`hsl(var(--destructive))`
              } as ChartConfig;
            }
          );
          return acc as { success: ChartConfig; failed: ChartConfig };
        },
        { success: {}, failed: {} } as {
          success: ChartConfig;
          failed: ChartConfig;
        }
      );
      setChartConfig(_data);
    },
    []
  );

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const _scrapperOptions = data.map((item) => ({
      value: item.id,
      label: item.name
    }));

    setScrapperOptions(_scrapperOptions);

    if (!_scrapperOptions.find((item) => item.value === scrapper)) {
      setScrapper(_scrapperOptions[0].value);
    }

    const selectedSchedulerRecords = data.find(
      (item) => item.id === scrapper
    )?.records;

    _setChartData(selectedSchedulerRecords);
    _setChartConfig(selectedSchedulerRecords);
  }, [data, scrapper, _setChartData, _setChartConfig]);

  return (
    <LoadingWrapper isLoading={isLoading}>
      <Card className="p-5 pt-10">
        <CardContent>
          <div className="flex flex-wrap justify-start gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span>Scrapper: </span>
              <Select
                value={scrapper}
                onValueChange={(value) => setScrapper(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Select scrapper --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {scrapperOptions &&
                      scrapperOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span>Month: </span>
              <Select
                defaultValue={month}
                onValueChange={(value) => setMonth(value)}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Select month --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          {!scrapperOptions && !isLoading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              <h1>No Jobs Scrapper found. </h1>
              <Button asChild>
                <Link href={`./jobs-scrapper`}>Create a Jobs Scraper Now</Link>
              </Button>
            </div>
          ) : chartData && chartConfig && !isLoading ? (
            <div className="gap-4 py-4">
              <h1 className="text-xl text-app">Success data</h1>
              <Chart
                schedulerId=""
                chartConfig={chartConfig.success}
                chartData={chartData.success}
              />
              <h1 className="text-xl text-app">Failed data</h1>
              <Chart
                schedulerId=""
                chartConfig={chartConfig.failed}
                chartData={chartData.failed}
              />
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
              {!isLoading && (
                <>
                  <h1>No data collected yet. </h1>
                  <Button asChild>
                    <Link href={`/jobs-scrapper/${scrapper}`} target="_blank">
                      Trigger the scrapper
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </LoadingWrapper>
  );
};

const CustomizedAxisTick = ({
  x,
  y,
  payload
}: {
  x: number;
  y: number;
  payload: any;
}) => {
  const displayText = `${formatDateTime(
    payload.value,
    "DD-MM-YYYY"
  )}\n\n${formatDateTime(payload.value, "HH:mm:ss")}`;
  return (
    <Text x={x} y={y} width={75} textAnchor="middle" verticalAnchor="start">
      {displayText}
    </Text>
  );
};

const Chart = ({
  chartConfig,
  chartData
}: {
  schedulerId: string;
  chartConfig: ChartConfig;
  chartData: Array<Record<string, number | Date | undefined>>;
}) => {
  const chartDataZero = useMemo(() => {
    return chartData.every((item) => {
      if (!item) {
        return true;
      }
      return Object.values(item).every((_item) => {
        if (typeof _item === "number") {
          return _item <= 0;
        }
        return true;
      });
    });
  }, [chartData]);
  return (
    <div className="relative">
      <ResponsiveContainer>
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid />
            <XAxis
              dataKey="lastTriggerAt"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={(props) => CustomizedAxisTick(props)}
            />

            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              wrapperStyle={{ whiteSpace: "break-spaces" }}
              content={<ChartLegendContent />}
            />

            {Object.values(chartConfig).map((item, index) => (
              <Bar
                key={index + 10}
                dataKey={item.label as string}
                fill={item.color}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
      {chartDataZero && (
        <div className="absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] items-center justify-center">
          <p className="text-app">Chart data is empty.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardChart;

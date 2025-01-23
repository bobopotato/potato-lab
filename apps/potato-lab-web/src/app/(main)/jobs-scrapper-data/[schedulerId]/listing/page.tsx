"use client";

import {
  Button,
  Card,
  CardContent,
  Input,
  LoadingWrapper,
  PaginationWithLinks,
  ScrollArea
} from "@potato-lab/ui";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useJobsQuery } from "../../../../../queries/use-jobs-query";
import { getErrorMessage } from "../../../../../utils/error.util";
import Image from "next/image";
import { Job } from "@potato-lab/shared-types";
import { formatDateTime } from "../../../../../utils/date.util";
import { debounce } from "lodash";
import { cn } from "@potato-lab/lib/utils";
import Link from "next/link";

const JobListing = ({ params }: { params: { schedulerId: string } }) => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [_keyword, _setKeyword] = React.useState("");
  const [keyword, setKeyword] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const debounceInstance = React.useMemo(
    () =>
      debounce((newKeyword) => {
        console.log("halo?");
        setKeyword(newKeyword);
      }, 1000),
    [] // Ensure debounceInstance is created once
  );

  useEffect(() => {
    debounceInstance(_keyword);
    // Cleanup function to cancel debounce on unmount or before running it again
    return () => {
      debounceInstance.cancel();
    };
  }, [_keyword, debounceInstance]);

  useEffect(() => {
    setSelectedJob(null);
  }, [page]);

  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedJob]);

  const { isFetching, error, refetch, data } = useJobsQuery({
    schedulerId: params.schedulerId,
    keyword, //: query[0] as string | undefined,
    page, //: query[1] as number | undefined,
    pageSize //: query[2] as number | undefined
  });

  if (error) {
    toast.error(getErrorMessage(error, "Something went wrong"));

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1>
          Something went wrong. Please try to refetch data again.{" "}
          {JSON.stringify(error)}
        </h1>
        <Button onClick={() => refetch()}>Refetch data</Button>
      </div>
    );
  }

  if (!isFetching && !data?.data?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1>No job data found</h1>
        <Button onClick={() => refetch()}>Refetch data</Button>
        <h1>Or try to trigger to scrapper to start scrapping data again</h1>
        <Button asChild>
          <Link href={`/scrapper/jobs-scrapper/${params.schedulerId}`}>
            Navigate to scrapper settings
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <LoadingWrapper isLoading={isFetching}>
      <div>
        <div className="flex w-full max-w-[100%] flex-row gap-4">
          <div className="w-[40%] max-w-[40%]">
            <div className="bottom-[32px] space-y-5">
              <Input
                className="m-0.5 outline-none"
                value={_keyword}
                onChange={(e) => _setKeyword(e.target.value)}
                placeholder="Search by keyword"
              />
              <p className="text-light-gray">
                Total result: {data?.pagination?.total || 0}
              </p>
              {data?.data.map((item) => {
                return (
                  <JobCardView
                    key={item.id}
                    data={item}
                    isSelected={selectedJob?.id === item.id}
                    setSelectedJob={setSelectedJob}
                  />
                );
              })}
            </div>
          </div>
          <ScrollArea
            viewportRef={scrollRef}
            className="!sticky top-8 h-[calc(100vh-var(--header-height)-90px-20px-64px-52px)] w-[calc(60%-20px)] rounded-lg"
            scrollBarClassName="bg-app"
          >
            <div className="sticky left-0 top-0 h-full bg-primary-foreground p-6 [overflow-wrap:anywhere]">
              {selectedJob?.detailsTemplate ? (
                <div
                  className="space-y-5 [&_strong]:text-app [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.detailsTemplate.replace(/\\/g, "")
                  }}
                />
              ) : (
                <div className="flex h-[calc(100vh-var(--header-height)-90px-20px-64px-48px-52px)] items-center justify-center">
                  Select any job to see details
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        {!!data?.data.length && (
          <div className="sticky bottom-8 bg-secondary pb-0 pt-4">
            <div className="relative">
              <MyPagination
                page={page}
                pageSize={pageSize}
                total={data?.pagination?.total || 0}
                setPage={setPage}
              />
              <div className="absolute bottom-0 left-0 -z-10 h-[50px] w-full translate-y-8 bg-secondary"></div>
            </div>
          </div>
        )}
      </div>
    </LoadingWrapper>
  );
};

const JobCardView = ({
  data,
  isSelected,
  setSelectedJob
}: {
  data: Job;
  isSelected: boolean;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
}) => {
  return (
    <Card
      className={cn(
        "cursor-pointer bg-primary-foreground pt-6 transition-colors duration-200 ease-in-out hover:border-app",
        isSelected && "border-app"
      )}
      onClick={() => setSelectedJob(data)}
    >
      <CardContent className="flex flex-col gap-2">
        {data.companyImageUrl && (
          <Image
            src={data.companyImageUrl}
            alt={data.companyName}
            width={60}
            height={60}
            className="object-contain"
          />
        )}
        <h1 className="text-lg text-app">{data.title}</h1>
        <p className="font-semibold underline">{data.companyName}</p>
        <p>~ {data.location}</p>
        {data.description && <p>~ {data.description}</p>}
        <p className="text-light-gray">{formatDateTime(data.jobListedAt)}</p>
      </CardContent>
    </Card>
  );
};

const MyPagination = ({
  page,
  total,
  pageSize,
  setPage
}: {
  page: number;
  total: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <PaginationWithLinks
      page={page}
      pageSize={pageSize}
      totalCount={total}
      onChangePage={(page) => setPage(page)}
    />
  );
};

export default JobListing;

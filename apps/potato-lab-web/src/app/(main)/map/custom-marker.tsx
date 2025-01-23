"use client";

import React, { useEffect, useState } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { JobWithCompanyInfo } from "@potato-lab/shared-types";
import JobIcon from "./job-icon";
import { cn } from "@potato-lab/lib/utils";
import Image from "next/image";
import {
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@potato-lab/ui";
import useMapStore from "../../../stores/useMapStore";

export const CustomMarker = ({
  data,
  zoom
}: {
  data: JobWithCompanyInfo;
  zoom: number;
}) => {
  const { selectedMarker, setSelectedMarker } = useMapStore();

  const [hovered, setHovered] = useState(false);
  const position = {
    lat: data.locationGeometry[0],
    lng: data.locationGeometry[1]
  };

  useEffect(() => {
    if (selectedMarker !== data.id && hovered) {
      setSelectedMarker(undefined);
    }
  }, [selectedMarker, hovered, data, setSelectedMarker]);

  const renderCustomPin = () => {
    return (
      <>
        <div className="flex flex-col items-center gap-1">
          <span
            className={cn(
              "font pointer-events-none absolute line-clamp-2 max-h-[60px] max-w-[100px] translate-y-[-110%] scale-0 overflow-hidden truncate text-ellipsis rounded-lg bg-secondary p-1 px-3 text-sm text-app transition-transform duration-200 ease-in-out",
              zoom >= 12 && `scale-[${zoom * 50}%]`
            )}
          >
            {data.name}
          </span>

          <TooltipProvider delayDuration={200}>
            <Tooltip
              open={selectedMarker === data.id || hovered}
              onOpenChange={(open) => {
                console.log(`halo?`);
                setHovered(open);
              }}
            >
              <TooltipTrigger>
                <div
                  className={cn(
                    "h-10 w-10 rounded-full border border-secondary bg-white/70 p-2 transition-all duration-200 ease-in-out hover:scale-125"
                  )}
                >
                  <JobIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="rounded-lg border-2 border-app bg-secondary p-0 text-primary shadow-lg"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setTimeout(() => setHovered(false), 1000)}
              >
                <div
                  className={cn(
                    "min-w-[300px] max-w-[60vw] scale-0 p-5 transition-transform duration-200 ease-in-out",
                    (hovered || selectedMarker === data.id) && "scale-100"
                  )}
                >
                  <div className="flex w-full gap-4">
                    <div className="flex flex-col gap-2 whitespace-break-spaces">
                      {data.jobs[0]?.companyImageUrl && (
                        <Image
                          src={data.jobs[0]?.companyImageUrl}
                          alt={data.name}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      )}
                      <h1 className="text-base font-semibold text-app">
                        {data.name}
                      </h1>
                      <p>~ {data.address}</p>
                      {data.phoneNumber && <p>~ {data.phoneNumber}</p>}
                      {data.website && (
                        <p>
                          ~{" "}
                          <a href={data.website} className="text-app underline">
                            {data.website}
                          </a>
                        </p>
                      )}
                      {data.website && (
                        <p>
                          ~{" "}
                          <a href={data.mapUrl} className="text-app underline">
                            View in google map
                          </a>
                        </p>
                      )}
                    </div>
                    <ScrollArea className="w-full">
                      <h1 className="text-base">Job Listing</h1>
                      {data.jobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex flex-col gap-2 rounded bg-primary-foreground p-2"
                        >
                          <h1 className="text-app">{job.title}</h1>
                          <p>~ {job.position}</p>
                          {job.description && <p>~ {job.description}</p>}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="tip" />
      </>
    );
  };

  return (
    <AdvancedMarker
      position={position}
      title={data.name}
      onClick={() => {
        if (selectedMarker === data.id) {
          setSelectedMarker(undefined);
        } else {
          setSelectedMarker(data.id);
        }
      }}
    >
      {renderCustomPin()}
    </AdvancedMarker>
  );
};

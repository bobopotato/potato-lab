"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import {
  Input,
  LoadingWrapper,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@potato-lab/ui";
import { debounce } from "lodash";
import { useJobsScrapperQuery } from "../../../queries/use-jobs-scrapper-query";
import { useJobsCompanyInfoQuery } from "../../../queries/use-jobs-company-info-query";
import { CustomMarker } from "./custom-marker";
import { useGeolocation } from "@uidotdev/usehooks";
import useMapStore from "../../../stores/useMapStore";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";
const defaultLocation = {
  lat: 4.3,
  lng: 102
};

const JobMap = () => {
  const { latitude: userLat, longitude: userLng } = useGeolocation();
  const { setSelectedMarker } = useMapStore();

  const [zoom, setZoom] = useState<number>(6);
  const [scrapper, setScrapper] = useState<string>();
  const [_keyword, _setKeyword] = React.useState<string>("");
  const [keyword, setKeyword] = React.useState<string>("");
  const { data: jobsScrapperData, isLoading: isJobsScrapperDataLoading } =
    useJobsScrapperQuery();
  const { data: jobsCompanyInfoData, isLoading: isJobsDataLoading } =
    useJobsCompanyInfoQuery({
      schedulerId: scrapper,
      keyword
    });

  const debounceInstance = React.useMemo(
    () =>
      debounce((newKeyword) => {
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

  const scrapperOptions = useMemo(() => {
    return jobsScrapperData?.map((item) => {
      return {
        value: item.id,
        label: item.name
      };
    });
  }, [jobsScrapperData]);

  useEffect(() => {
    if (!scrapperOptions?.length) {
      return;
    }

    setScrapper(scrapperOptions[1].value);
  }, [scrapperOptions]);

  return (
    <LoadingWrapper
      className="flex h-full w-full flex-col gap-4"
      isLoading={isJobsScrapperDataLoading || isJobsDataLoading}
    >
      <h1 className="text-2xl text-app">Job Data Map</h1>
      <div className="flex w-full flex-wrap items-center gap-4">
        <div className="flex items-center gap-4">
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
          <span>Search keyword: </span>
          <Input
            className="m-0.5 outline-none"
            value={_keyword}
            onChange={(e) => _setKeyword(e.target.value)}
            placeholder="Search by keyword"
          />
        </div>

        <p className="text-light-gray">
          Total result: {jobsCompanyInfoData?.length ?? "-"}
        </p>
      </div>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={"google-map"}
          className="h-full w-full"
          defaultCenter={{
            lat: userLat || defaultLocation.lat,
            lng: userLng || defaultLocation.lng
          }}
          defaultZoom={zoom}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          keyboardShortcuts={false}
          onZoomChanged={({ detail: { zoom } }) => {
            setZoom(zoom);
          }}
          onDragstart={() => setSelectedMarker(undefined)}
        >
          {userLat && userLng && (
            <AdvancedMarker
              position={{ lat: userLat, lng: userLng }}
              title={"Current Location"}
            />
          )}
          {jobsCompanyInfoData?.map((data) => (
            <CustomMarker key={data.id} data={data} zoom={zoom} />
          ))}
        </Map>
      </APIProvider>
    </LoadingWrapper>
  );
};

export default JobMap;

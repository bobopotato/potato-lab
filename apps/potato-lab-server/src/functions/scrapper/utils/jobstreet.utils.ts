import { JobListingStatusEnum, JobSourcePlatformEnum } from "@potato-lab/db";
import { InsertJob } from "@potato-lab/shared-types";

import axios from "axios";

export const JOBSTREET_GET_URL = "https://my.jobstreet.com";

export const JOBSTREET_GET_DETAILS_URL = "https://my.jobstreet.com/graphql";

export const getJobStreetData = async (keyword: string, page: number) => {
  const _keyword = keyword.split(" ").join("-");
  const { data } = await axios.get(
    `${JOBSTREET_GET_URL}/${_keyword}-jobs?page=${page}`
  );

  if (data.includes("No matching search results")) {
    console.info(`No matching search results - ${keyword} - ${page}`);
    return;
  }

  const totalJobsCountRegex =
    /<span data-automation="totalJobsCount">\s*(.*?)\s*<\/span> jobs/;
  const jobIdRegex = /data-job-id="(\d+)"/g;

  const totalJobsCount = Number(
    data.match(totalJobsCountRegex)[1].replaceAll(",", "")
  );
  const jobIds = [...data.matchAll(jobIdRegex)].map((match) =>
    String(match[1])
  );

  return {
    totalJobsCount,
    jobIds
  };
};

export const getJobStreetDetails = async (
  jobId: string,
  schedulerId: string
) => {
  const body = {
    operationName: "jobDetails",
    variables: {
      jobId: jobId,
      jobDetailsViewedCorrelationId: "7a2ccdb9-4802-4238-a72e-5300ce98bc7c",
      sessionId: "0dda4321-1ff1-4ce3-9bad-e25b8fe66fcf",
      zone: "asia-5",
      locale: "en-MY",
      languageCode: "en",
      countryCode: "MY",
      timezone: "Asia/Kuala_Lumpur"
    },
    query:
      'query jobDetails($jobId: ID!, $jobDetailsViewedCorrelationId: String!, $sessionId: String!, $zone: Zone!, $locale: Locale!, $languageCode: LanguageCodeIso!, $countryCode: CountryCodeIso2!, $timezone: Timezone!) {\n  jobDetails(\n    id: $jobId\n    tracking: {channel: "WEB", jobDetailsViewedCorrelationId: $jobDetailsViewedCorrelationId, sessionId: $sessionId}\n  ) {\n    ...job\n    learningInsights(platform: WEB, zone: $zone, locale: $locale) {\n      analytics\n      content\n      __typename\n    }\n    gfjInfo {\n      location {\n        countryCode\n        country(locale: $locale)\n        suburb(locale: $locale)\n        region(locale: $locale)\n        state(locale: $locale)\n        postcode\n        __typename\n      }\n      workTypes {\n        label\n        __typename\n      }\n      __typename\n    }\n    seoInfo {\n      normalisedRoleTitle\n      workType\n      classification\n      subClassification\n      where(zone: $zone)\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment job on JobDetails {\n  job {\n    sourceZone\n    tracking {\n      adProductType\n      classificationInfo {\n        classificationId\n        classification\n        subClassificationId\n        subClassification\n        __typename\n      }\n      hasRoleRequirements\n      isPrivateAdvertiser\n      locationInfo {\n        area\n        location\n        locationIds\n        __typename\n      }\n      workTypeIds\n      postedTime\n      __typename\n    }\n    id\n    title\n    phoneNumber\n    isExpired\n    expiresAt {\n      dateTimeUtc\n      __typename\n    }\n    isLinkOut\n    contactMatches {\n      type\n      value\n      __typename\n    }\n    isVerified\n    abstract\n    content(platform: WEB)\n    status\n    listedAt {\n      label(context: JOB_POSTED, length: SHORT, timezone: $timezone, locale: $locale)\n      dateTimeUtc\n      __typename\n    }\n    salary {\n      currencyLabel(zone: $zone)\n      label\n      __typename\n    }\n    shareLink(platform: WEB, zone: $zone, locale: $locale)\n    workTypes {\n      label(locale: $locale)\n      __typename\n    }\n    advertiser {\n      id\n      name(locale: $locale)\n      isVerified\n      registrationDate {\n        dateTimeUtc\n        __typename\n      }\n      __typename\n    }\n    location {\n      label(locale: $locale, type: LONG)\n      __typename\n    }\n    classifications {\n      label(languageCode: $languageCode)\n      __typename\n    }\n    products {\n      branding {\n        id\n        cover {\n          url\n          __typename\n        }\n        thumbnailCover: cover(isThumbnail: true) {\n          url\n          __typename\n        }\n        logo {\n          url\n          __typename\n        }\n        __typename\n      }\n      bullets\n      questionnaire {\n        questions\n        __typename\n      }\n      video {\n        url\n        position\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  companyProfile(zone: $zone) {\n    id\n    name\n    companyNameSlug\n    shouldDisplayReviews\n    branding {\n      logo\n      __typename\n    }\n    overview {\n      description {\n        paragraphs\n        __typename\n      }\n      industry\n      size {\n        description\n        __typename\n      }\n      website {\n        url\n        __typename\n      }\n      __typename\n    }\n    reviewsSummary {\n      overallRating {\n        numberOfReviews {\n          value\n          __typename\n        }\n        value\n        __typename\n      }\n      __typename\n    }\n    perksAndBenefits {\n      title\n      __typename\n    }\n    __typename\n  }\n  companySearchUrl(zone: $zone, languageCode: $languageCode)\n  companyTags {\n    key(languageCode: $languageCode)\n    value\n    __typename\n  }\n  restrictedApplication(countryCode: $countryCode) {\n    label(locale: $locale)\n    __typename\n  }\n  sourcr {\n    image\n    imageMobile\n    link\n    __typename\n  }\n  __typename\n}\n'
  };

  console.log(`Getting job details for ${jobId} - Calling axios`);

  const randomSessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  const res = await axios.post(JOBSTREET_GET_DETAILS_URL, body, {
    headers: {
      "x-seek-ec-sessionid": randomSessionId
    }
  });
  console.log(`Getting job details for ${jobId} - Done Calling axios`);
  const details = res.data.data.jobDetails;

  const jobDetails: InsertJob = {
    id: `${schedulerId}-${jobId}`,
    sourceJobId: jobId,
    sourceUrl: details.job?.shareLink,
    title: details.job?.title,
    companyName: details.job?.advertiser?.name,
    companyImageUrl:
      details.companyProfile?.branding?.logo ||
      details.job?.products?.branding?.logo?.url,
    location: details.job?.location?.label,
    description: details.job?.salary?.label,
    position: details.seoInfo?.normalisedRoleTitle || details.job?.title,
    detailsTemplate: details.job?.content,
    jobListedAt: new Date(details.job?.listedAt?.dateTimeUtc),
    jobListingStatus:
      details.job?.status === "Active"
        ? JobListingStatusEnum.VALID
        : JobListingStatusEnum.EXPIRED,
    sourcePlatform: JobSourcePlatformEnum.JOBSTREET,
    isFavourite: false, // if update need to remain isFavourite
    createdAt: new Date(),
    schedulerId: schedulerId
  };

  return jobDetails;
};

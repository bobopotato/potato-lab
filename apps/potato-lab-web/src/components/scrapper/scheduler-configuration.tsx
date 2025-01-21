"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertSchedulerSchema,
  selectSchedulerSchema,
  uniqueArray,
  updateSchedulerSchema
} from "@potato-lab/shared-types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingWrapper,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@potato-lab/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosAuth } from "../../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/error.util";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { parseCronExpression } from "../../utils/cron.util";
import {
  JobSourcePlatformEnum,
  SchedulerFrequencyEnum,
  SchedulerTypeEnum
} from "@potato-lab/db";
import { cn, enumToArray } from "@potato-lab/lib/utils";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { formatDateTime } from "../../utils/date.util";
import Link from "next/link";

interface SchedulerConfigurationProps {
  type: SchedulerTypeEnum;
  action: "create" | "update";
  defaultData?: z.infer<typeof selectSchedulerSchema>;
}

const frequencies = enumToArray(SchedulerFrequencyEnum);
const sourcePlatforms = enumToArray(JobSourcePlatformEnum);

const SchedulerConfiguration = ({
  type,
  action,
  defaultData
}: SchedulerConfigurationProps & React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [customCron, setCustomCron] = useState<boolean>(false);

  const _schema =
    action === "create" ? insertSchedulerSchema : updateSchedulerSchema;

  const schema = _schema.extend({
    keywords: uniqueArray(
      z.string(),
      type === SchedulerTypeEnum.CRYPTO_SCRAPPER
    )
  });

  const [formData, setFormData] = useState<z.infer<typeof schema>>(
    defaultData as z.infer<typeof schema>
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultData || {
      type: type,
      name: "",
      description: "",
      frequency: undefined,
      sourcePlatform: [],
      keywords: []
    }
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["insert-scheduler"],
    mutationFn: async (data: z.infer<typeof schema>) => {
      if (action === "create") {
        await axiosAuth.post("/scheduler", data);
      } else if (action === "update") {
        await axiosAuth.put("/scheduler", data);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error, "Something went wrong"));
    },
    onSuccess: () => {
      toast.success(`Scheduler ${action}d successfully`);
      queryClient.invalidateQueries({ queryKey: ["jobs-scrapper"] });
      router.push("./");
    }
  });

  const { mutate: triggerScrapper, isPending: isTriggeringScrapper } =
    useMutation({
      mutationKey: ["trigger-scrapper"],
      mutationFn: async (id: string) => {
        if (type === SchedulerTypeEnum.JOBS_SCRAPPER) {
          await axiosAuth.post("/scrapper/job/init", { id });
        } else if (type === SchedulerTypeEnum.CRYPTO_SCRAPPER) {
          await axiosAuth.post("/scrapper/crypto/init", { id });
        }
        toast.success("Scrapper triggered successfully");
      }
    });

  const onFrequencyChange = (value: SchedulerFrequencyEnum) => {
    if (value === SchedulerFrequencyEnum.HOURLY) {
      const cronExpression = "0 * * * *";
      form.setValue("frequencyExpression", cronExpression);
      setCustomCron(false);
      return;
    }

    if (value === SchedulerFrequencyEnum.DAILY) {
      const cronExpression = "0 0 * * *";
      form.setValue("frequencyExpression", cronExpression);
      setCustomCron(false);
      return;
    }

    form.setValue("frequencyExpression", "");
    setCustomCron(true);
    setFormData(form.getValues());
  };

  return (
    <LoadingWrapper isLoading={isPending}>
      <div className="w-full flex flex-row gap-10 justify-evenly items-start">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => mutate(e))}
            className={cn("my-8 space-y-8 flex-auto")}
            onChange={() => {
              setFormData(form.getValues());
            }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <FormLabel htmlFor="name">Scrapper Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="eg: Job Scrapper 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      placeholder="eg: scrape everything from jobstreet"
                      required={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <FormLabel htmlFor="frequency">Frequency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        onFrequencyChange(value as SchedulerFrequencyEnum);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="-- Select a frequency --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>-- Select a frequency --</SelectLabel>
                          {frequencies.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>
                              {frequency}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.getValues("frequency") && !customCron && (
                    <FormDescription>
                      {parseCronExpression(
                        form.getValues("frequencyExpression")
                      )}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {customCron && (
              <FormField
                control={form.control}
                name="frequencyExpression"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-4">
                    <FormLabel htmlFor="frequencyExpression">
                      <div className="flex flex-row  items-baseline gap-2">
                        <span>Custom Frequency Expression</span>
                        <TooltipProvider delayDuration={50}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                size="icon"
                                variant="link"
                                type="button"
                                asChild
                              >
                                <a
                                  href="https://crontab.cronhub.io/"
                                  target="_blank"
                                >
                                  <InfoIcon />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <div>
                                Please refer{" "}
                                <a
                                  href="https://crontab.cronhub.io/"
                                  target="_blank"
                                >
                                  here
                                </a>{" "}
                                for the cron expression reference.
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="frequencyExpression"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.currentTarget.value);
                          console.log(e.currentTarget.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {parseCronExpression(
                        form.getValues("frequencyExpression")
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="sourcePlatform"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-4">
                  <FormLabel htmlFor="sourcePlatform">Scrape from</FormLabel>
                  <div className="flex flex-row flex-wrap gap-4">
                    {sourcePlatforms.map((item) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                JobSourcePlatformEnum[item]
                              )}
                              onCheckedChange={(checked) => {
                                console.log(field);
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item}
                          </FormLabel>
                        </FormItem>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === SchedulerTypeEnum.JOBS_SCRAPPER && (
              <FormField
                control={form.control}
                name="keywords"
                render={({ field, fieldState }) => (
                  <FormItem className="flex flex-col space-y-4">
                    <FormLabel htmlFor="keywords">Keywords to scrape</FormLabel>
                    <FormControl>
                      <Input
                        id="keywords"
                        placeholder="eg: scrape everything from jobstreet"
                        suffix={
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousSibling as HTMLInputElement;
                              const value = input.value.trim();
                              if (value) {
                                const newValue = [
                                  ...(field.value || []),
                                  value
                                ];
                                field.onChange(newValue);
                                form.trigger("keywords");
                                input.value = "";
                              }
                            }}
                          >
                            Add
                          </Button>
                        }
                      />
                    </FormControl>
                    <FormDescription className="flex flex-row flex-wrap gap-2">
                      {field.value?.map((item, index) => {
                        return (
                          <span
                            key={index}
                            className="group flex flex-row gap-2 items-center rounded-lg bg-primary-foreground p-2 pl-3 hover:outline outline-1 outline-red-600"
                          >
                            <span>{item}</span>
                            <XCircleIcon
                              size={16}
                              className="bg-red m-0 p-0 cursor-pointer group-hover:text-red-600"
                              onClick={() => {
                                const newValue = field.value?.filter(
                                  (value, _index) => {
                                    return index !== _index;
                                  }
                                );
                                field.onChange(newValue);
                              }}
                            />
                          </span>
                        );
                      })}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">
              {action === "create" ? "Create" : "Update"}
            </Button>
          </form>
        </Form>
        {
          <Card className="bg-primary-foreground w-[30%]">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl underline">
                Scrapper Information
              </CardTitle>
              <CardDescription>Name: {formData?.name || "-"}</CardDescription>
              <CardDescription>
                Description: {formData?.description || "-"}
              </CardDescription>
              <CardDescription>
                Frequency:{" "}
                {parseCronExpression(formData?.frequencyExpression || "") ||
                  "-"}
              </CardDescription>
              <CardDescription>
                Keywords: {formData?.keywords?.join(", ") || "-"}
              </CardDescription>
              <CardDescription>
                Data from: {formData?.sourcePlatform?.join(", ") || "-"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {defaultData?.id && (
                <>
                  <p>
                    Last triggered at:{" "}
                    {defaultData.records?.[0]?.lastTriggerAt
                      ? formatDateTime(defaultData.records[0].lastTriggerAt)
                      : "-"}
                  </p>
                  <p>
                    Last ended at:{" "}
                    {defaultData.records?.[0]?.lastEndAt
                      ? formatDateTime(defaultData.records[0].lastEndAt)
                      : "-"}
                  </p>
                  <div className="pt-5 flex flex-wrap justify-evenly gap-2">
                    <Button
                      isLoading={isTriggeringScrapper}
                      onClick={() => triggerScrapper(defaultData.id)}
                    >
                      Trigger now
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link href={`./${defaultData.id}/listing`}>
                        View Scrapper
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        }
      </div>
    </LoadingWrapper>
  );
};

export default SchedulerConfiguration;

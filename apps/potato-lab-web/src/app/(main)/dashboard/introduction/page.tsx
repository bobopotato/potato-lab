import { cn } from "@potato-lab/lib/utils";
import { Button, Card, CardContent, CardTitle } from "@potato-lab/ui";
import React from "react";

const Introduction = () => {
  return (
    <div className="pb-4 relative">
      <h1 className="text-3xl text-app mb-6 ">
        A platform that automate your jobs hunting
      </h1>
      <div className="absolute">
        <div className="relative w-full">
          <div className="flex h-[20px] gap-4 justify-center items-center overflow-hidden animate-marquee whitespace-nowrap">
            <span>😎 Personalized your schedule to collect data</span>
            <span>🧐 Get your desired data</span>
            <span>🤩 Accurate & quick data collection</span>
            <span>🤑 Free of charge</span>
          </div>
          <div className="flex absolute top-0 left-4 h-[20px] gap-4 justify-center items-center overflow-hidden animate-marquee2 whitespace-nowrap">
            <span>😎 Personalized your schedule to collect data</span>
            <span>🧐 Get your desired data</span>
            <span>🤩 Accurate & quick data collection</span>
            <span>🤑 Free of charge</span>
          </div>
        </div>
      </div>
      <Card className="mt-20 flex flex-col ">
        <CardTitle className="p-5 pt-10 text-xl underline">
          Start by creating your own jobs scrapper. Here is the steps to do it.
        </CardTitle>
        <CardContent>
          <div className="flex flex-col gap-10 items-start py-10">
            <StepView
              className="opacity-70"
              step={1}
              title="Create your own job scrapper"
              description="Setup and configure based on your needs."
            />
            <StepView
              className="opacity-70"
              step={2}
              title="Customize the scheduler for your scrapper"
              description="Automatically collect data based on the scheduler configuration. Or you can manually trigger it as well."
            />
            <StepView
              step={3}
              title="View your data"
              description="Once the scrapper is triggered & data collected, you can view your data."
              isActive
            />
          </div>
          <Button className="self-end" size="lg">
            Get Started 🚀
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const StepView = ({
  className,
  step,
  title,
  description,
  isActive
}: React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
}) => {
  return (
    <div className={cn("flex items-start justify-around gap-5", className)}>
      <div
        className={cn(
          "flex aspect-square h-[40px] w-[40px] flex-auto items-center justify-center rounded-full bg-app",
          isActive ? "animate-bounce" : ""
        )}
      >
        {step}
      </div>
      <div className="flex flex-col items-start gap-3 text-start">
        <h1 className={cn("text-2xl font-bold", isActive && "text-app")}>
          {title}
        </h1>
        <p className="text-light-gray">{description}</p>
      </div>
    </div>
  );
};

export default Introduction;

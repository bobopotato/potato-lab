import { LoadingWrapper } from "@potato-lab/ui";
import React from "react";

const Loading = () => {
  return (
    <LoadingWrapper isLoading={true}>
      <div className="h-screen w-screen flex items-center justify-center"></div>
    </LoadingWrapper>
  );
};

export default Loading;

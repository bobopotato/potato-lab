"use client";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    console.log(`rendering page`);
  }, []);
  return <div>Page</div>;
};

export default Page;

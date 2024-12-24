"use client";

import { Button } from "@potato-lab/ui";
import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h2>Not Found Gay</h2>
      <p>Could not find requested resource</p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;

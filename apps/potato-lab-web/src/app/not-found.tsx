"use client";

import { Button } from "@potato-lab/ui";
import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button asChild>
        <Link href="/dashboard/introduction">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;

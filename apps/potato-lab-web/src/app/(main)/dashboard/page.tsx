"use client";

import { Button } from "@potato-lab/ui";
import { setCookie, signIn } from "../../../utils/api.util";
import { useState } from "react";
import { toast } from "sonner";
import { axiosAuth } from "../../../lib/axios";

function Dashboard() {
  const [testError, setTestError] = useState(false);

  if (testError) throw new Error("test error.tsx");

  const testAuthApi = async () => {
    await axiosAuth.post("/dashboard/test-auth");
  };

  return (
    <div>
      <p>Dashboard </p>
      <Button onClick={() => setCookie()}>Set Cookie</Button>
      {/* <Button onClick={() => refreshToken()}>Refresh Token</Button> */}
      <Button onClick={() => signIn({ email: "qwe123", password: "password" })}>
        Sign In
      </Button>
      <Button onClick={() => toast.error("Something went wrong")}>Toast</Button>
      <Button onClick={testAuthApi}>Test auth</Button>
    </div>
  );
}

export default Dashboard;

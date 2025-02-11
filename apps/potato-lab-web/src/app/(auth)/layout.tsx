import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center h-screen">
      {children}
    </div>
  );
};

export default layout;

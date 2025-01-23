import React from "react";

const JobIcon = () => {
  return (
    <svg
      fill="#000000"
      viewBox="0 0 24 24"
      id="job"
      data-name="Flat Line"
      xmlns="http://www.w3.org/2000/svg"
      className="icon flat-line"
    >
      <rect
        id="secondary"
        x="5"
        y="5"
        width="14"
        height="18"
        rx="1"
        transform="translate(26 2) rotate(90)"
        style={{
          fill: "hsl(173, 60%, 50%)",
          strokeWidth: 2
        }}
      ></rect>
      <path
        id="primary"
        d="M16,7H8V4A1,1,0,0,1,9,3h6a1,1,0,0,1,1,1Zm1,4H7m8,0v2m6,7V8a1,1,0,0,0-1-1H4A1,1,0,0,0,3,8V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20Z"
        style={{
          fill: "none",
          stroke: "rgb(0, 0, 0)",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }}
      ></path>
    </svg>
  );
};

export default JobIcon;
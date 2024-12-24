import localFont from "next/font/local";

export const iosevkaMono = localFont({
  src: [
    {
      path: "./Iosevka-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./Iosevka-Italic.woff2",
      weight: "400",
      style: "italic"
    },
    {
      path: "./Iosevka-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./Iosevka-MediumItalic.woff2",
      weight: "500",
      style: "italic"
    },
    {
      path: "./Iosevka-SemiBold.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./Iosevka-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic"
    },
    {
      path: "./Iosevka-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "./Iosevka-BoldItalic.woff2",
      weight: "700",
      style: "italic"
    }
  ],
  variable: "--font-iosevka-mono"
});

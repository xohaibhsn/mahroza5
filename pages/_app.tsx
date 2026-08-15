import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { DM_Sans, Fraunces } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${dmSans.variable} ${fraunces.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { InitUser } from "../components/InitUser";
import Appbar from "../components/Appbar";
import Footer from "@/components/Footer";

//fix main page padding later
export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Appbar />
        <InitUser />
        <Component {...pageProps} />
        <Footer />
      </div>
    </RecoilRoot>
  );
}

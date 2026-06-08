import { Metadata } from "next";
import ReaderClient from "./ReaderClient";

export const metadata: Metadata = {
  title: "Reader | Visus",
  description: "Advanced speed reading engine with RSVP and visual semantic clustering.",
};

export default function ReaderPage() {
  return <ReaderClient />;
}

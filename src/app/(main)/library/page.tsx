import { Metadata } from "next";
import LibraryDashboard from "./LibraryDashboard";

export const metadata: Metadata = {
  title: "Library | Visus",
  description: "Manage your book library and track your progress.",
};

export default function LibraryPage() {
  return <LibraryDashboard />;
}

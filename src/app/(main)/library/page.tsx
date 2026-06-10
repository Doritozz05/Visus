import { Metadata } from "next";
import { Flame } from "lucide-react";
import LibraryDashboard from "./LibraryDashboard";

export const metadata: Metadata = {
  title: "Library | Visus",
  description: "Manage your book library and track your progress.",
};

export default function LibraryPage() {
  return (
    <>
      {/* Header area */}
      <header className="hidden md:flex justify-between items-center px-8 py-6 border-b border-border/20">
        <h1 className="text-3xl font-extrabold font-heading text-foreground">Library</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Flame className="text-primary w-4 h-4" />
            <span>Streak: 12 days</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
            VP
          </div>
        </div>
      </header>

      <LibraryDashboard />
    </>
  );
}

import { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Flame } from "lucide-react";
import LibraryDashboard from "./LibraryDashboard";

export const metadata: Metadata = {
  title: "Library | Visus",
  description: "Manage your book library and track your progress.",
};

export default function LibraryPage() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath="/library" />

      {/* Mobile nav */}
      <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-4">
          <Flame className="text-primary w-6 h-6" />
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-border/30">
            VP
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
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
      </main>
    </div>
  );
}

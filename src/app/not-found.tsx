import * as React from "react";
import Link from "next/link";
import { VisiMascot } from "@/components/ui/VisiMascot";
import { Home, Library } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border/30 rounded-3xl p-8 shadow-2xl liquid-glass relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
        
        <div className="relative z-10">
          <VisiMascot variant="error" size={160} className="-mb-4" />
        </div>

        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">404 - Page Missing</h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-xs mx-auto">
            Visi dropped the books! We can't seem to find the page you are looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4 relative z-10">
          <Link
            href="/dashboard"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/library"
            className="w-full py-3 border border-border/30 rounded-xl text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center justify-center gap-2"
          >
            <Library className="h-4 w-4" />
            Go to Library
          </Link>
        </div>
      </div>
    </div>
  );
}

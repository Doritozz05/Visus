"use client";

import * as React from "react";
import Link from "next/link";
import { VisiMascot } from "@/components/ui/VisiMascot";
import { Home, Library } from "lucide-react";

export default function NotFound() {
  const [clickCount, setClickCount] = React.useState(0);
  const [isWiggling, setIsWiggling] = React.useState(false);

  const excuses = [
    "Visi dropped the books! We can't seem to find the page you are looking for. It might have been moved or deleted.",
    "Still missing... maybe it's stuck between two other pages?",
    "Okay, clicking me won't find the page faster, but it is fun!",
    "Have you tried turning the library off and on again?",
    "Are we there yet? No, still a 404.",
    "Alright, I'm hiding. Go back to the dashboard!"
  ];

  const handleMascotClick = () => {
    setClickCount((prev) => prev + 1);
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border/30 rounded-3xl p-8 shadow-2xl liquid-glass relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
        
        <div 
          className="relative z-10 cursor-pointer select-none group" 
          onClick={handleMascotClick}
          title="Click to help Visi!"
        >
          <div className={`transition-all duration-300 ${isWiggling ? 'scale-110 -rotate-6' : 'group-hover:scale-105'}`}>
            <VisiMascot 
              variant={clickCount >= excuses.length - 1 ? "default" : "error"} 
              size={160} 
              className="-mb-2" 
            />
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">
            {clickCount >= excuses.length - 1 ? "404 - I give up!" : "404 - Page missing"}
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-xs mx-auto min-h-[60px] flex items-center justify-center">
            {excuses[Math.min(clickCount, excuses.length - 1)]}
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 mt-4 relative z-10">
          <Link
            href="/dashboard"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href="/library"
            className="w-full py-3 border border-border/30 rounded-xl text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center justify-center gap-2"
          >
            <Library className="h-4 w-4" />
            Go to library
          </Link>
        </div>
      </div>
    </div>
  );
}

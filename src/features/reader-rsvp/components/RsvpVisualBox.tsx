import * as React from "react";

interface RsvpVisualBoxProps {
  leftPart: string;
  focusLetter: string;
  rightPart: string;
}

export function RsvpVisualBox({ leftPart, focusLetter, rightPart }: RsvpVisualBoxProps) {
  return (
    <div className="w-full py-20 border-y border-[#464554]/30 relative flex items-center justify-center bg-[#0b1326] overflow-hidden">
      {/* The Active RSVP Word (Balanced 3-column Flexbox for exact pixel ORP pinning) */}
      <div className="w-full text-4xl md:text-6xl font-heading select-none tracking-tight flex items-center relative z-10">
        {/* Left Part: right-aligned, takes up left half */}
        <div className="flex-1 text-right opacity-30 pr-0.5 text-slate-100 font-bold">
          {leftPart}
        </div>
        
        {/* Focus Letter: exactly in the middle */}
        <div className="shrink-0 text-[#ffb95f] font-bold px-0.5 text-center relative">
          {focusLetter}
        </div>
        
        {/* Right Part: left-aligned, takes up right half */}
        <div className="flex-1 text-left opacity-30 pl-0.5 text-slate-100 font-bold">
          {rightPart}
        </div>
      </div>
    </div>
  );
}

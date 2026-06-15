import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full max-h-[600px] opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] px-[100px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {children}
      </div>

      <Footer />
    </div>
  );
}
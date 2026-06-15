import React from "react";
import Link from "next/link";
import { Eye, Zap, Focus, Layers, BookOpen } from "lucide-react";
import { NavbarClient } from "./NavbarClient";

export function Navbar() {
  const guideOptions = [
    {
      title: "Read Faster",
      description: "Master the art of speed reading.",
      href: "/speed-reading",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "RSVP Method",
      description: "The science of focus points.",
      href: "/rsvp-method",
      icon: <Focus className="w-4 h-4" />
    },
    {
      title: "Cluster Method",
      description: "Group words for deep flow.",
      href: "/cluster-method",
      icon: <Layers className="w-4 h-4" />
    },
    {
      title: "EPUB Reader",
      description: "Secure, local-first reading.",
      href: "/epub-reader",
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return <NavbarClient guideOptions={guideOptions} />;
}

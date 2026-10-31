"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/Footer";

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  // Hide public landing footer in admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
};

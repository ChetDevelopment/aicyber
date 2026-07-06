"use client";

import { usePathname } from "next/navigation";
import { FloatingChat } from "@/components/floating-chat";

export function FloatingChatWrapper() {
  const pathname = usePathname();
  if (pathname === "/chat") return null;
  return <FloatingChat />;
}

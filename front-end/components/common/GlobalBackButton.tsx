"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const GlobalBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  if (pathname === "/") {
    return null;
  }

  const isDisabled = !canGoBack && pathname === "/";

  const handleBack = () => {
    if (canGoBack) {
      router.back();
      return;
    }

    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={isDisabled}
      aria-label="Go back"
      className="fixed left-4 top-20 z-50 inline-flex items-center gap-2 rounded-full bg-transparent px-3 py-2 text-sm font-black text-[var(--foreground)] transition-all hover:bg-white/95 hover:px-4 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[var(--surface)]/95"
    >
      <ArrowLeft size={16} />
      <span className="inline">Back</span>
    </button>
  );
};

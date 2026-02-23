"use client";

import { usePathname } from "next/navigation";

export const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <>
      <div key={`route-progress-${pathname}`} className="route-progress is-active" />
      <div key={pathname} className="route-fade-in">
        {children}
      </div>
    </>
  );
};

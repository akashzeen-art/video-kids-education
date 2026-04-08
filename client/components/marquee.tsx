import { ReactNode } from "react";
import React from "react";

interface MarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
}

export default function Marquee({ children, direction = "left", speed = "normal" }: MarqueeProps) {
  const duration =
    speed === "fast" ? "15s" :
    speed === "slow" ? "40s" : "25s";

  return (
    <div className="relative flex w-full overflow-hidden py-6 border-y-4 border-foreground/5 bg-foreground/5 backdrop-blur-md">
      <div
        className={`flex animate-marquee whitespace-nowrap ${direction === "right" ? "reverse" : ""}`}
        style={{ "--duration": duration } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-12 px-6">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-12 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

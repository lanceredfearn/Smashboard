"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const Pickleballs = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const balls = new Array(number || 20).fill(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {balls.map((_, idx) => {
        const count = number || 20;
        const position = idx * (800 / count) - 400;

        return (
          <span
            key={"pickleball" + idx}
            className={cn(
              "animate-pickleball absolute h-3 w-3 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]",
              className,
            )}
            style={{
              top: "-40px",
              left: position + "px",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.floor(Math.random() * (10 - 5) + 5) + "s",
            }}
          />
        );
      })}
    </motion.div>
  );
};


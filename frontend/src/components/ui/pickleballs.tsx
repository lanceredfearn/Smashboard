"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";
import pickleball from "../../assets/pickleball.svg";

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
          return (
            <img
              key={"pickleball" + idx}
              src={pickleball}
              alt="pickleball"
              className={cn(
                "animate-pickleball absolute h-6 w-6",
                className,
              )}
              style={{
                top: "-40px",
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 5 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }}
            />
          );
        })}
      </motion.div>
    );
  };


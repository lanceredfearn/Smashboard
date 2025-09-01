"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export const CardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("[perspective:1000px]", className)}>{children}</div>
  );
};

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
});
CardBody.displayName = "CardBody";

export const CardItem = ({
  as: Component = "div",
  translateZ = 0,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  translateZ?: number | string;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => {
  return (
    <Component
      className={cn("[transform-style:preserve-3d]", className)}
      style={{ transform: `translateZ(${translateZ}px)` }}
      {...props}
    >
      {children}
    </Component>
  );
};

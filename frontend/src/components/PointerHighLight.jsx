"use client";
import React, { useRef, useEffect, useState } from "react";
import { cn } from "./lib/utils";
import { motion } from "framer-motion";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [triggeredOnce, setTriggeredOnce] = useState(false); // added

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // observe first time it comes into view and trigger once
  useEffect(() => {
    if (!containerRef.current || triggeredOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggeredOnce(true);
            observer.disconnect(); // run once
            break;
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [triggeredOnce]);

  return (
    <div className={cn("relative w-fit", containerClassName)} ref={containerRef}>
      <div className="p-2">
        {children}
      </div>
      {/* render overlay only after dimensions known and first-in-view triggered */}
      {dimensions.width > 0 && dimensions.height > 0 && triggeredOnce && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "absolute inset-0  border-[#4c1f8e]/50 border-3 dark:border-[#c2a7fb]/30",
              rectangleClassName
            )}
            initial={{
              width: 0,
              height: 0,
            }}
            animate={{
              width: dimensions.width,
              height: dimensions.height,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="pointer-events-none absolute"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              x: dimensions.width + 4,
              y: dimensions.height + 4,
            }}
            style={{
              rotate: -90,
            }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <Pointer className={cn("h-5 w-5 text-[#8236ec]", pointerClassName)} />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

const Pointer = (props) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
    </svg>
  );
};
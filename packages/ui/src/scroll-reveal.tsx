"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface ScrollRevealProps {
  children: ReactNode;
  /** Custom class for the wrapper */
  className?: string;
  /** Delay before animation starts in milliseconds (e.g. 200) */
  delay?: number;
}

/**
 * @repo/ui — ScrollReveal Component
 * Uses native IntersectionObserver to trigger a fade-in-up animation
 * when the component enters the viewport. Perfect for premium scroll experiences.
 */
export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the element is visible, trigger the animation and unobserve
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } // Trigger slightly before it's fully visible
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

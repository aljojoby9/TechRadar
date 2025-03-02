"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function AnimatedGradient({
  children,
  className,
  containerClassName,
  gradientClassName,
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  gradientClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      container.style.setProperty("--x", `${x}px`)
      container.style.setProperty("--y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("group relative overflow-hidden rounded-lg p-[1px]", containerClassName)}>
      <div
        className={cn(
          "absolute inset-[-100%] animate-spin-slow bg-gradient-to-r from-transparent via-transparent to-[#7209b7]/50",
          "group-hover:from-transparent group-hover:via-[#480ca8]/50 group-hover:to-[#3f37c9]/50",
          "transition-all duration-500",
          gradientClassName,
        )}
        style={{
          transform: "translate(var(--x, 0), var(--y, 0))",
        }}
      />
      <div className={cn("relative rounded-lg", className)}>{children}</div>
    </div>
  )
}


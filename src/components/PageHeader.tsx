import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-primary">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-[28px] sm:text-[32px] leading-tight font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="page-actions flex min-w-0 shrink-0 flex-wrap items-center gap-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

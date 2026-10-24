import React from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowTarget?: boolean;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function Panel({
  children,
  className,
  glow = false,
  glowTarget = false,
  title,
  subtitle,
  icon,
  headerAction,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "panel-card p-5 transition-all duration-200",
        glow && "panel-glow",
        glowTarget && "panel-glow-target",
        className
      )}
      {...props}
    >
      {(title || headerAction) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-card-border">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-primary">{icon}</span>}
            <div>
              {title && <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

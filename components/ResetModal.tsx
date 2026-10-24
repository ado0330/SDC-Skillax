"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useWorkspace } from "@/lib/workspace/useWorkspace";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetModal({ isOpen, onClose }: ResetModalProps) {
  const { resetWorkspace } = useWorkspace();

  if (!isOpen) return null;

  const handleConfirm = () => {
    resetWorkspace();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-card p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Reset Workspace &amp; Local Storage?
              </h3>
              <span className="text-xs text-muted-foreground">
                Atomic session purge
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Warning text */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          This will permanently delete all your client-side session state, including:
        </p>

        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
          <li>Custom skills profile and self-ratings</li>
          <li>Target career designation and saved learning pathway</li>
          <li>Milestone completion checkoffs and progress history</li>
          <li>Imported workforce datasets and recalculation audit proposals</li>
        </ul>

        <div className="p-3 rounded-lg bg-muted/40 border border-card-border text-[11px] text-muted-foreground">
          <strong>No-Database Guarantee:</strong> Because SKILLAX AI does not persist data to any external database, confirming this purge immediately returns your session to pristine, uninitialized defaults.
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-card-border text-xs font-semibold text-foreground hover:bg-muted/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Confirm Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

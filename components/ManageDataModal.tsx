"use client";

import React, { useState } from "react";
import { WorkforceObservation } from "@/lib/domain/types";
import { SKILLS_CATALOG } from "@/lib/data/skills";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Database,
  Download,
} from "lucide-react";

interface ManageDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (observations: WorkforceObservation[]) => void;
}

const SAMPLE_CSV_TEMPLATE = `sourceId,sourceName,periodStart,periodEnd,skillId,skillName,industry,measurementType,value,unit
my-custom-2026,National AI Talent Survey,2026-01-01,2026-03-31,python,Python programming,Technology,Quarterly Demand Index,115,Index Points
my-custom-2026,National AI Talent Survey,2025-10-01,2025-12-31,python,Python programming,Technology,Quarterly Demand Index,95,Index Points
my-custom-2026,National AI Talent Survey,2026-01-01,2026-03-31,ai,AI literacy,Technology,Quarterly Demand Index,140,Index Points
my-custom-2026,National AI Talent Survey,2025-10-01,2025-12-31,ai,AI literacy,Technology,Quarterly Demand Index,100,Index Points`;

export function ManageDataModal({
  isOpen,
  onClose,
  onImport,
}: ManageDataModalProps) {
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleParseAndImport = () => {
    setErrorMessage(null);
    setSuccessCount(null);

    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorMessage("Please paste or upload CSV or JSON workforce data.");
      return;
    }

    try {
      const parsedObservations: WorkforceObservation[] = [];

      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        // Parse JSON
        const raw = JSON.parse(trimmed);
        const list = Array.isArray(raw) ? raw : [raw];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          parsedObservations.push({
            id: `custom-json-${Date.now()}-${i}`,
            sourceId: String(item.sourceId || "custom-import"),
            sourceName: String(item.sourceName || "User Imported Dataset"),
            provider: String(item.provider || "Self-Reported"),
            publishedAt: String(item.publishedAt || new Date().toISOString().split("T")[0]),
            periodStart: String(item.periodStart || "2026-01-01"),
            periodEnd: String(item.periodEnd || "2026-03-31"),
            skillId: String(item.skillId || "analysis"),
            skillName: String(item.skillName || "Data analysis"),
            roleId: item.roleId ? String(item.roleId) : undefined,
            industry: String(item.industry || "Technology"),
            geography: String(item.geography || "Malaysia"),
            measurementType: String(item.measurementType || "Demand Index"),
            value: Number(item.value) || 100,
            unit: String(item.unit || "Index Points"),
            evidenceType: "Imported Dataset",
            datasetVersion: "CUSTOM-v1",
            synthetic: Boolean(item.synthetic ?? true),
            definition: String(item.definition || "User imported workforce series."),
            method: String(item.method || "Direct tabular upload."),
            importedAt: new Date().toISOString(),
          });
        }
      } else {
        // Parse CSV
        const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error("CSV requires a header line and at least one data row.");
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const rowObj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx] || "";
          });

          const skillId = rowObj["skillid"] || "python";
          const skillMeta = SKILLS_CATALOG.find((s) => s.id === skillId);

          parsedObservations.push({
            id: `custom-csv-${Date.now()}-${i}`,
            sourceId: rowObj["sourceid"] || "custom-csv-import",
            sourceName: rowObj["sourcename"] || "Imported CSV Dataset",
            provider: "User Uploaded",
            publishedAt: new Date().toISOString().split("T")[0],
            periodStart: rowObj["periodstart"] || "2026-01-01",
            periodEnd: rowObj["periodend"] || "2026-03-31",
            skillId,
            skillName: rowObj["skillname"] || skillMeta?.name || skillId,
            industry: rowObj["industry"] || "Technology",
            geography: "Malaysia",
            measurementType: rowObj["measurementtype"] || "Demand Index",
            value: parseFloat(rowObj["value"]) || 100,
            unit: rowObj["unit"] || "Index Points",
            evidenceType: "Custom CSV Dataset",
            datasetVersion: "CUSTOM-2026",
            synthetic: true,
            definition: "User imported tabular demand time-series.",
            method: "Direct CSV parsing.",
            importedAt: new Date().toISOString(),
          });
        }
      }

      if (parsedObservations.length === 0) {
        throw new Error("No valid observations could be parsed from the input.");
      }

      onImport(parsedObservations);
      setSuccessCount(parsedObservations.length);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to parse workforce dataset.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="panel-card w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Import Workforce Dataset</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ingest time-series CSV or JSON for statistical comparability analysis.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successCount !== null && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Successfully ingested {successCount} workforce observations!</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Paste CSV or JSON Content
            </label>
            <button
              type="button"
              onClick={() => setInputText(SAMPLE_CSV_TEMPLATE)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
            >
              <Download className="h-3 w-3" />
              Load Sample Template
            </button>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste CSV (with header) or JSON array of workforce observation records..."
            className="w-full rounded-md border border-card-border bg-background p-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
          />

          <div className="rounded-lg border border-card-border bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Comparability Invariants:</p>
            <p>• Series must contain at least 2 observations with matching measurement unit & industry.</p>
            <p>• Adjacent periods must not overlap and base period value must be positive.</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-card-border px-6 py-4 bg-muted/20">
          <button
            onClick={onClose}
            className="rounded-lg border border-card-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleParseAndImport}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            <span>Validate & Import Observations</span>
          </button>
        </div>
      </div>
    </div>
  );
}

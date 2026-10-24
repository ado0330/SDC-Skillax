import { NextRequest, NextResponse } from "next/server";
import { extractCvData } from "@/lib/ai/cvExtractor";
import { SAMPLE_CVS } from "@/lib/data/sampleCvs";
import { isGeminiConfigured } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let cvText = "";
    let consentAI = false;
    let consentSynthetic = false;
    let sampleId: string | undefined = undefined;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      cvText = body.text || "";
      consentAI = Boolean(body.consentAI);
      consentSynthetic = Boolean(body.consentSynthetic);
      sampleId = body.sampleId;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      consentAI = formData.get("consentAI") === "true";
      consentSynthetic = formData.get("consentSynthetic") === "true";
      sampleId = formData.get("sampleId") as string | undefined;

      const file = formData.get("file") as File | null;
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            { error: "PDF must be 10 MB or smaller." },
            { status: 413 }
          );
        }
        // Extract text from text/plain or sample string in memory
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        cvText = buffer.toString("utf-8");
        // Zero memory buffer immediately
        buffer.fill(0);
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type." },
        { status: 415 }
      );
    }

    // Verify mandatory consent checkboxes (E-007)
    if (!consentAI || !consentSynthetic) {
      return NextResponse.json(
        {
          error:
            "Confirm external AI processing and that this is a fictional CV before analysis.",
        },
        { status: 400 }
      );
    }

    // Fast-path: If user selected one of the synthetic sample CVs
    if (sampleId) {
      const sample = SAMPLE_CVS.find((s) => s.id === sampleId);
      if (sample) {
        return NextResponse.json({
          success: true,
          proposal: {
            name: sample.name,
            occupation: sample.occupation,
            industry: sample.industry,
            education: sample.education,
            experience: sample.experience,
            professionalSummary: sample.professionalSummary,
            experienceSummary: sample.experienceSummary,
            skills: sample.skills,
            interests: sample.interests,
            additionalSkills: sample.additionalSkills,
            extractionMethod: "synthetic_sample",
          },
          isGeminiConfigured: isGeminiConfigured(),
        });
      }
    }

    if (!cvText || cvText.trim().length === 0) {
      return NextResponse.json(
        { error: "Provide CV text or attach a document for extraction." },
        { status: 400 }
      );
    }

    // Run extraction through Gemini or keyword fallback
    const proposal = await extractCvData(cvText);

    return NextResponse.json({
      success: true,
      proposal,
      isGeminiConfigured: isGeminiConfigured(),
    });
  } catch (error) {
    console.error("CV Analysis route error:", error);
    return NextResponse.json(
      { error: "CV analysis failed. Please retry or choose a synthetic sample demo." },
      { status: 500 }
    );
  }
}

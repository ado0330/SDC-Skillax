import { NextRequest, NextResponse } from "next/server";
import { extractCvData } from "@/lib/ai/cvExtractor";
import { SAMPLE_CVS } from "@/lib/data/sampleCvs";
import { isGeminiConfigured } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let cvText = "";
    let fileBuffer: Buffer | null = null;
    let fileMimeType = "";
    let fileName = "";
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
            { error: "Document must be 10 MB or smaller." },
            { status: 413 }
          );
        }
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        fileMimeType = file.type || "application/pdf";
        fileName = file.name;
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
            "Please confirm both consent checkboxes before analysis.",
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

    let proposal;

    if (fileBuffer) {
      proposal = await extractCvData({
        buffer: fileBuffer,
        mimeType: fileMimeType,
        filename: fileName,
      });
      // Zero memory buffer immediately for security
      fileBuffer.fill(0);
    } else if (cvText && cvText.trim().length > 0) {
      proposal = await extractCvData(cvText);
    } else {
      return NextResponse.json(
        { error: "Provide CV text or attach a document for extraction." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      proposal,
      isGeminiConfigured: isGeminiConfigured(),
    });
  } catch (error: any) {
    console.error("CV Analysis Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process CV data." },
      { status: 500 }
    );
  }
}

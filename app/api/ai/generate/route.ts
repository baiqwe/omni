import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/utils/supabase/server";
import { getProjectId } from "@/utils/supabase/project";
import { CREDITS_PER_GENERATION } from "@/config/credit-packs";
import type { AnimeStyleId } from "@/config/landing-pages";

export const runtime = "nodejs";
export const maxDuration = 60; // 1 minute timeout

// Replicate official Nano Banana Pro image editing model.
// Verified input schema uses `prompt` + `image_input[]`.
const REPLICATE_MODEL =
    "google/nano-banana-pro:d71e2df08d6ef4c4fb6d3773e9e557de6312e04444940dbb81fd73366ed83941";

type Intensity = "low" | "medium" | "high";

const PONY_PREFIX =
    "score_9, score_8_up, score_7_up, source_anime, masterpiece, best quality, very aesthetic";
const PONY_NEGATIVE_PREFIX =
    "score_6, score_5, score_4, worst quality, low quality, 3d, realistic, photorealistic, lowres";

const STYLE_PRESETS: Record<AnimeStyleId, { prompt: string; negative: string; denoising: number }> = {
    standard: {
        prompt:
            "anime artwork, 2d illustration, flat shading, high contrast, vibrant colors, clean lines, stunning visual, highly detailed face, official anime art",
        negative: "blurry, muddy colors, bad anatomy",
        denoising: 0.58,
    },
    ghibli: {
        prompt:
            "studio ghibli style, traditional animation, watercolor background, lush nature, soft lighting, spirited away style, flat colors, nostalgic vibe",
        negative: "cyberpunk, dark, neon, 3d render, modern digital art, sharp edges",
        denoising: 0.63,
    },
    cyberpunk: {
        prompt:
            "cyberpunk style, cyberpunk edgerunners, neon lights, glowing accents, night city, high tech, dramatic lighting, dark background, vivid colors",
        negative: "daytime, soft lighting, nature, watercolor, pale colors",
        denoising: 0.65,
    },
    retro_90s: {
        prompt:
            "1990s style, retro anime, vintage anime, classic anime, cel shading, vhs artifacts, soft pastel colors, old anime style, nostalgic",
        negative: "modern anime, high resolution, ultra sharp, glossy skin, 3d",
        denoising: 0.55,
    },
    webtoon: {
        prompt:
            "korean webtoon style, manhwa style, solo leveling style, sharp features, aesthetic, detailed eyes, glossy hair, modern web comic",
        negative: "chibi, cute, 90s style, thick lines",
        denoising: 0.52,
    },
    cosplay: {
        prompt:
            "anime redraw of a cosplay photo, preserve outfit identity and key colors, polished 2d illustration look, clean linework, official anime art, vibrant colors",
        negative: "photorealistic costume texture, messy linework, muddy colors, blurry",
        denoising: 0.56,
    },
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function resolvePromptStrength(base: number, intensity: Intensity) {
    if (intensity === "low") return clamp(base - 0.08, 0.35, 0.8);
    if (intensity === "high") return clamp(base + 0.08, 0.35, 0.8);
    return clamp(base, 0.35, 0.8);
}

function buildPromptParts(opts: {
    style: AnimeStyleId;
    intensity: Intensity;
    keepEyeColor: boolean;
    keepHairColor: boolean;
    userPrompt?: string;
}) {
    const stylePreset = STYLE_PRESETS[opts.style] ?? STYLE_PRESETS.standard;
    const intensityInstruction =
        opts.intensity === "low"
            ? "Apply a subtle anime edit. Keep the original facial structure, pose, and proportions very close to the uploaded photo."
            : opts.intensity === "high"
                ? "Apply a strong anime transformation with expressive 2D stylization, bolder linework, and a clearly illustrated look while keeping the person recognizable."
                : "Apply a balanced anime transformation with clean 2D rendering while preserving identity.";

    const keepInstructions: string[] = [];
    if (opts.keepEyeColor) keepInstructions.push("Preserve the original eye color.");
    if (opts.keepHairColor) keepInstructions.push("Preserve the original hair color.");

    const userInstruction = opts.userPrompt?.trim()
        ? `Extra user request: ${opts.userPrompt.trim()}`
        : "";

    return {
        positive: [
            "Transform the uploaded photo into polished anime artwork.",
            "Keep the same person, pose, composition, and overall identity from the input image.",
            `Use this target style: ${stylePreset.prompt}.`,
            `Quality tags to emphasize: ${PONY_PREFIX}.`,
            intensityInstruction,
            ...keepInstructions,
            "Output one clean final image with no text, no watermark, and no extra subjects unless requested.",
            userInstruction,
        ]
            .filter(Boolean)
            .join(" "),
        negative: `${PONY_NEGATIVE_PREFIX}, ${stylePreset.negative}, text, watermark, logo, caption, signature, jpeg artifacts, extra fingers, extra digits, bad hands, bad anatomy, blurry`,
        promptStrength: resolvePromptStrength(stylePreset.denoising, opts.intensity),
    };
}

function normalizeImageInput(image: string) {
    if (image.startsWith("blob:")) {
        throw new Error("Temporary browser image URLs are not supported. Please re-upload the image.");
    }

    if (image.startsWith("data:")) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
            throw new Error("Invalid image data URL");
        }

        return {
            buffer: Buffer.from(matches[2], "base64"),
            mimeType: matches[1] || "image/png",
        };
    }

    if (/^https?:\/\//.test(image)) {
        return image;
    }

    return {
        buffer: Buffer.from(image, "base64"),
        mimeType: "image/png",
    };
}

function extractReplicateOutputUrl(output: unknown) {
    if (typeof output === "string") {
        return output;
    }

    if (Array.isArray(output) && output.length > 0) {
        const first = output[0];
        if (typeof first === "string") {
            return first;
        }
        if (first && typeof first === "object" && typeof (first as { url?: () => URL }).url === "function") {
            return (first as { url: () => URL }).url().toString();
        }
        if (first && typeof first === "object" && typeof (first as { toString?: () => string }).toString === "function") {
            return (first as { toString: () => string }).toString();
        }
    }

    if (output && typeof output === "object" && typeof (output as { url?: () => URL }).url === "function") {
        return (output as { url: () => URL }).url().toString();
    }

    return null;
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const projectId = await getProjectId(supabase);

    try {
        const body = await request.json();
        const image: string | undefined = body?.image;
        const style: AnimeStyleId = (body?.style as AnimeStyleId) || "standard";
        const intensity: Intensity = (body?.intensity as Intensity) || "medium";
        const keepEyeColor: boolean = body?.keepEyeColor !== false;
        const keepHairColor: boolean = body?.keepHairColor !== false;
        const prompt: string | undefined = body?.prompt;
        const stylePreset = STYLE_PRESETS[style] ?? STYLE_PRESETS.standard;

        // 1. Authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Please sign in to generate.", code: "UNAUTHORIZED" }, { status: 401 });
        }

        // 2. Input Validation
        if (!image) {
            return NextResponse.json({ error: "Missing image", code: "MISSING_IMAGE" }, { status: 400 });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("REPLICATE_API_TOKEN is not set");
            return NextResponse.json({ error: "Service configuration error", code: "CONFIG_ERROR" }, { status: 500 });
        }

        // 3. Deduct Credits
        const { data: deductSuccess, error: rpcError } = await supabase.rpc('decrease_credits', {
            p_user_id: user.id,
            p_amount: CREDITS_PER_GENERATION,
            p_description: `AI Generation (${style})`
        });

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            return NextResponse.json({ error: "System busy, please try again", code: "SYSTEM_ERROR" }, { status: 500 });
        }

        if (!deductSuccess) {
            return NextResponse.json({
                error: "Insufficient credits",
                code: "INSUFFICIENT_CREDITS",
                required: CREDITS_PER_GENERATION
            }, { status: 402 });
        }

        // 4. Call Replicate img2img API
        try {
            const { positive, negative, promptStrength } = buildPromptParts({
                style,
                intensity,
                keepEyeColor,
                keepHairColor,
                userPrompt: prompt,
            });

            console.log("=== Calling Replicate Nano Banana Pro ===");
            console.log("Model:", REPLICATE_MODEL);
            console.log("Style:", style);
            console.log("Prompt:", positive);

            const replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN,
                fileEncodingStrategy: "data-uri",
            });

            const normalizedImage = normalizeImageInput(image);
            const replicateImage =
                typeof normalizedImage === "string"
                    ? normalizedImage
                    : (
                        await replicate.files.create(
                            new Blob([normalizedImage.buffer], { type: normalizedImage.mimeType })
                        )
                    ).urls.get;
            console.log("Replicate uploaded image:", replicateImage);

            const predictionResponse = await fetch("https://api.replicate.com/v1/predictions", {
                method: "POST",
                headers: {
                    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                    "Content-Type": "application/json",
                    Prefer: "wait=60",
                },
                body: JSON.stringify({
                    version: REPLICATE_MODEL.split(":")[1],
                    input: {
                        image_input: [replicateImage],
                        prompt: positive,
                        aspect_ratio: "match_input_image",
                        resolution: "2K",
                        output_format: "jpg",
                        safety_filter_level: "block_only_high",
                    },
                }),
            });

            if (!predictionResponse.ok) {
                const predictionErrorText = await predictionResponse.text();
                console.error("Replicate prediction error:", predictionResponse.status, predictionErrorText);
                throw new Error(
                    `Replicate prediction failed: ${predictionResponse.status} - ${predictionErrorText}`
                );
            }

            const prediction = await predictionResponse.json();
            const output = prediction.output;

            const resultImageUrl = extractReplicateOutputUrl(output);

            if (!resultImageUrl) {
                console.error("Failed to extract image from Replicate output:", output);
                throw new Error("Replicate returned no image");
            }

            console.log("Generated image URL/data length:", resultImageUrl.substring(0, 100) + "...");

            // 5. Log Generation
            await supabase.from("generations").insert({
                project_id: projectId,
                user_id: user.id,
                prompt: positive,
                model_id: "replicate-nano-banana-pro",
                image_url: resultImageUrl,
                input_image_url: image.startsWith("http") ? image : "user_upload",
                status: "succeeded",
                credits_cost: CREDITS_PER_GENERATION,
                metadata: {
                    style,
                    intensity,
                    keepEyeColor,
                    keepHairColor,
                    model: REPLICATE_MODEL,
                    stylePrompt: stylePreset.prompt,
                    styleNegativePrompt: negative,
                    denoisingStrength: promptStrength,
                    promptFramework: "nano-banana-style-matrix",
                    provider: "replicate",
                }
            });

            return NextResponse.json({ url: resultImageUrl, success: true });

        } catch (aiError: any) {
            console.error("AI Service Error:", aiError);
            console.error("AI Error Details:", JSON.stringify({
                message: aiError?.message,
                status: aiError?.status,
                response: aiError?.response,
                name: aiError?.name
            }, null, 2));

            // Refund credits on failure
            await supabase.rpc('decrease_credits', {
                p_user_id: user.id,
                p_amount: -CREDITS_PER_GENERATION,
                p_description: 'Refund: AI Generation Failed'
            });

            return NextResponse.json({
                error: "Generation failed. Credits refunded.",
                code: "AI_FAILED",
                refunded: true,
                details: aiError?.message || "Unknown error"
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Server error", code: "UNKNOWN_ERROR" },
            { status: 500 }
        );
    }
}

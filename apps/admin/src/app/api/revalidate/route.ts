/**
 * POST /api/revalidate — On-demand ISR revalidation
 *
 * Triggered by admin actions (menu toggle, cata publish) to instantly
 * invalidate cached pages on public sites instead of waiting for ISR 5s.
 *
 * executive_summary.md: Toggle visible en sitio en <5s via ISR
 * api_specification.md: §Rendering — ISR + on-demand revalidation
 */

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface RevalidateBody {
  path: string;
  domains?: string[];
}

export async function POST(request: Request) {
  try {
    // Validate secret
    const secret = request.headers.get("x-revalidation-secret");
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error("[revalidate] REVALIDATION_SECRET is not configured");
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      );
    }

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    const body: RevalidateBody = await request.json();
    const { path, domains } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid path" },
        { status: 400 }
      );
    }

    // Revalidate locally (admin app cache)
    revalidatePath(path);

    // Also trigger revalidation on each public site
    const targetDomains = domains || [
      "https://lacarreta.co",
      "https://marytierrazipa.co",
      "https://delicazipa.co",
    ];

    const revalidationResults = await Promise.allSettled(
      targetDomains.map(async (domain) => {
        const url = `${domain}/api/revalidate`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidation-secret": expectedSecret,
          },
          body: JSON.stringify({ path }),
          signal: AbortSignal.timeout(5000),
        });
        return { domain, status: res.status };
      })
    );

    console.log(
      `[revalidate] ✅ Path "${path}" revalidated. Results:`,
      revalidationResults.map((r) =>
        r.status === "fulfilled" ? r.value : { error: "timeout" }
      )
    );

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "[revalidate] Error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}

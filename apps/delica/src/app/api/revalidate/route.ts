import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate — On-demand ISR revalidation
 *
 * Receives a path to revalidate. Authenticated via x-revalidation-secret header.
 * Called by the Admin Panel when content (menu, catas) changes.
 */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-revalidation-secret");
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret) {
      console.error("[revalidate] REVALIDATION_SECRET is not configured");
      return NextResponse.json(
        { error: "Revalidation not configured on this host" },
        { status: 500 }
      );
    }

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const body = await request.json();
    const { path } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Perform revalidation
    revalidatePath(path);
    
    console.log(`[revalidate] ✅ Successfully revalidated path: ${path}`);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[revalidate] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error during revalidation" },
      { status: 500 }
    );
  }
}

import { google } from "googleapis";
// app/api/webhook/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Verify the webhook token (if applicable)
    const token = request.headers.get("x-verification-token");
    if (token !== process.env.WEBHOOK_SECRET_TOKEN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Process the webhook payload
    const payload = await request.json();
    console.log("Webhook payload:", payload);

    // Respond to Moveo.ai
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { google } from "googleapis";
import { NextResponse } from "next/server";

interface WebhookPayload {
  sheetId: string;
  range: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const payload: WebhookPayload = await request.json();

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: payload.sheetId,
      range: payload.range,
    });

    // Handle null or undefined values
    const data = response.data.values || [];

    // Process the data (e.g., save to database, send response, etc.)
    console.log("Data from Google Sheets:", data);

    // Send a response back to Moveo.ai
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

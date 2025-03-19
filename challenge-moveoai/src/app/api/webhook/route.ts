import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(
          /\\n/g,
          "\n"
        ),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Extract data from Moveo.ai webhook payload
    const { sheetId, range } = req.body;

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const data = response.data.values;

    // Process the data (e.g., save to database, send response, etc.)
    console.log("Data from Google Sheets:", data);

    // Send a response back to Moveo.ai
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

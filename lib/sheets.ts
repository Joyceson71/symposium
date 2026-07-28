import { google } from 'googleapis';

export async function appendToSheet(values: string[]) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Assuming the first sheet and columns A to H
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1:H1', 
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    return { success: false, error };
  }
}

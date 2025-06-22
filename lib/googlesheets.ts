import { google } from 'googleapis';

const SHEET_ID = '1oM-DLXOjbNFDf78doefuC7ewfe2WTpYO6QmyEQaBDVQ';
const RANGE = 'Sheet1!A:B';

interface EmailData {
  emails: string[];
  count: number;
}

function getGoogleSheetsClient() {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  };

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getEmailData(): Promise<EmailData> {
  try {
    const sheets = getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    
    // Skip header row, get all email rows
    const emailRows = rows.slice(1).filter(row => row[0] && row[0].trim());
    const emails = emailRows.map(row => row[0].trim());
    
    // Get count from B2 or calculate from emails length + 2 (starting count)
    let count = 2;
    if (rows[1] && rows[1][1]) {
      count = parseInt(rows[1][1]) || 2;
    }

    return { emails, count };
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return { emails: [], count: 2 };
  }
}

export async function saveEmailData(data: EmailData): Promise<void> {
  try {
    const sheets = getGoogleSheetsClient();
    
    // Prepare data: header + emails + count
    const values = [
      ['Email', 'Count'],
      ['', data.count.toString()], // Empty email in row 2, count in B2
      ...data.emails.map(email => [email, '']), // Emails in subsequent rows
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    throw error;
  }
}

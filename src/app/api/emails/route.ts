import { NextResponse } from 'next/server';
import { getEmailData } from '../../../../lib/googlesheets';

export async function GET() {
  try {
    const emailData = await getEmailData();
    return NextResponse.json(emailData);
  } catch (error) {
    console.error('Error reading email data from Google Sheets:', error);
    return NextResponse.json({ emails: [], count: 2 });
  }
}

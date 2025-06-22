import { NextResponse } from 'next/server';
import { getEmailData } from '../../../../lib/googlesheets';

export async function GET() {
  try {
    const emailData = await getEmailData();
    return NextResponse.json({ count: emailData.count });
  } catch (error) {
    console.error('Error reading count from Google Sheets:', error);
    return NextResponse.json({ count: 2 });
  }
}

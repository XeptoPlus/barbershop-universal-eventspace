import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface EmailData {
  emails: string[];
  count: number;
}

async function getEmailData(): Promise<EmailData> {
  try {
    const data = await kv.get<EmailData>('email-data');
    return data || { emails: [], count: 2 };
  } catch {
    return { emails: [], count: 2 };
  }
}

export async function GET() {
  try {
    const emailData = await getEmailData();
    return NextResponse.json({ count: emailData.count });
  } catch (error) {
    console.error('Error reading count:', error);
    return NextResponse.json({ count: 2 });
  }
} 
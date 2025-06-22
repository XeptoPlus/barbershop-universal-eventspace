import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'emails.json');

interface EmailData {
  emails: string[];
  count: number;
}

async function readEmailData(): Promise<EmailData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default data
    return { emails: [], count: 2 };
  }
}

export async function GET() {
  try {
    const emailData = await readEmailData();
    return NextResponse.json({ count: emailData.count });
  } catch (error) {
    console.error('Error reading count:', error);
    return NextResponse.json({ count: 2 });
  }
} 
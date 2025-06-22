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
  } catch {
    // If file doesn't exist, return default data
    return { emails: [], count: 2 };
  }
}

export async function GET() {
  try {
    const emailData = await readEmailData();
    return NextResponse.json(emailData);
  } catch (error) {
    console.error('Error reading email data:', error);
    return NextResponse.json({ emails: [], count: 2 });
  }
} 
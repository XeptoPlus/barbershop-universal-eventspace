import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'emails.json');

interface EmailData {
  emails: string[];
  count: number;
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readEmailData(): Promise<EmailData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return default data
    return { emails: [], count: 2 };
  }
}

async function writeEmailData(data: EmailData): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const emailData = await readEmailData();

    // Check if we've reached the limit
    if (emailData.count >= 50) {
      return NextResponse.json(
        { message: 'Sorry, we have reached our limit of 50 premium clients' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (emailData.emails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { message: 'This email is already registered' },
        { status: 400 }
      );
    }

    // Add email and increment count
    emailData.emails.push(email.toLowerCase());
    emailData.count += 1;

    // Save to file
    await writeEmailData(emailData);

    return NextResponse.json({
      message: 'Successfully registered!',
      newCount: emailData.count
    });

  } catch (error) {
    console.error('Error processing email submission:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
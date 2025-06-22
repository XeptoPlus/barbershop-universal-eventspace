import { NextRequest, NextResponse } from 'next/server';
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

async function setEmailData(data: EmailData): Promise<void> {
  await kv.set('email-data', data);
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

    const emailData = await getEmailData();

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

    // Save to KV store
    await setEmailData(emailData);

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
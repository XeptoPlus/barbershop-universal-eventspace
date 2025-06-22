import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/firebase';

interface EmailData {
  emails: string[];
  count: number;
}

async function getEmailData(): Promise<EmailData> {
  try {
    const db = getDB();
    const doc = await db.collection('app-data').doc('emails').get();
    if (doc.exists) {
      return doc.data() as EmailData;
    } else {
      // If document doesn't exist, return default data
      return { emails: [], count: 2 };
    }
  } catch {
    // If there's an error, return default data
    return { emails: [], count: 2 };
  }
}

async function saveEmailData(data: EmailData): Promise<void> {
  const db = getDB();
  await db.collection('app-data').doc('emails').set(data);
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

    // Save to Firestore
    await saveEmailData(emailData);

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
